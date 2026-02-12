
"use client";
import { useState } from "react";
import type { User } from "firebase/auth";
import { collection, Timestamp, runTransaction, query, where, doc, serverTimestamp, deleteDoc, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";
import { useRouter } from "next/navigation";

import type { Booking, Workspace } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Armchair, Clock, AlertTriangle } from "lucide-react";
import { allResources } from "@/lib/resources";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { validateBookingTime } from "@/lib/validateBookingTime";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const calculateWorkstationBookingAmount = ({
  startTime,
  endTime,
}: {
  startTime: Date;
  endTime: Date;
}) => {
  const durationInHours = Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));

  if (durationInHours <= 0) {
    return { totalCost: 0, pricingTier: 'Invalid', details: '' };
  }

  const HOURLY_RATE = 350;
  const DAY_PASS_RATE = 1000;
  const EXTENDED_RATE = 200;

  // --- Calculate cost as hourly booking ---
  const hourlyCost = durationInHours * HOURLY_RATE;

  // --- Calculate cost as Day Pass booking ---
  const standardDayStart = new Date(startTime);
  standardDayStart.setHours(9, 30, 0, 0);
  const standardDayEnd = new Date(startTime);
  standardDayEnd.setHours(17, 30, 0, 0);

  // Calculate hours within the standard 9:30-5:30 block
  const standardHoursStart = Math.max(startTime.getTime(), standardDayStart.getTime());
  const standardHoursEnd = Math.min(endTime.getTime(), standardDayEnd.getTime());
  const standardDurationMs = Math.max(0, standardHoursEnd - standardHoursStart);
  const standardDurationHours = standardDurationMs / (1000 * 60 * 60);

  let dayPassCost = 0;
  let dayPassDetails = '';
  if (standardDurationHours > 0) {
      dayPassCost = DAY_PASS_RATE; // Flat rate if booking touches the standard day pass hours
      dayPassDetails = `Day Pass (₹${DAY_PASS_RATE})`;
  }
  
  // Calculate extended hours after 5:30 PM
  const extendedHoursStart = Math.max(startTime.getTime(), standardDayEnd.getTime());
  const extendedHoursEnd = endTime.getTime();
  const extendedDurationMs = Math.max(0, extendedHoursEnd - extendedHoursStart);
  if (extendedDurationMs > 0) {
      const extendedDurationHours = extendedDurationMs / (1000 * 60 * 60);
      const extendedCost = Math.ceil(extendedDurationHours) * EXTENDED_RATE;
      dayPassCost += extendedCost;
      if (dayPassDetails) dayPassDetails += ' + ';
      dayPassDetails += `${extendedDurationHours.toFixed(1)} Extended Hr(s) (₹${extendedCost})`;
  }
  
  // --- Compare and decide ---
  // Only offer day pass if it's cheaper and the booking is for a substantial duration (e.g., > 2.8 hours, where day pass becomes cheaper)
  if (dayPassCost > 0 && dayPassCost < hourlyCost) {
    return {
      totalCost: dayPassCost,
      pricingTier: 'Day Pass',
      details: dayPassDetails,
    }
  }

  return {
    totalCost: hourlyCost,
    pricingTier: 'Hourly',
    details: `${durationInHours.toFixed(1)} hours @ ₹${HOURLY_RATE}/hr`,
  };
};


const calculateRoomBookingAmount = ({
  roomName,
  durationInHours,
  extraChairs,
}: {
  roomName: string;
  durationInHours: number;
  extraChairs: number;
}) => {
  const isConference = roomName.toLowerCase().includes('conference');
  const roomBasePrice = isConference ? 1000 : 750;
  const roomCost = roomBasePrice * durationInHours;
  const extraChairCost = extraChairs > 0 ? extraChairs * 100 * durationInHours : 0;
  const totalCost = roomCost + extraChairCost;
  return { roomCost, extraChairCost, totalCost };
};

type InteractiveBookingProps = {
  officeId: string;
  date: Date;
  bookings: Booking[];
  user: User | null;
  agreedToTerms: boolean;
  onBooking: () => void;
};

type ResourceCategory = "workstation" | "meeting-room" | "conference-room";

const officeConfig: Record<
  string,
  {
    label: string;
    category: ResourceCategory;
    resourceIds?: string[];
    roomId?: string;
    baseCapacity?: number;
    totalCapacity?: number;
    extraCost?: number;
  }[]
> = {
  banyan: [
    {
      label: "Workstation",
      category: "workstation",
      resourceIds: Array.from(
        { length: 12 },
        (_, i) => `BANYAN-WS-${String(i + 1).padStart(2, "0")}`
      ),
    },
    {
      label: "Meeting Room",
      category: "meeting-room",
      roomId: "BANYAN-MR-06",
      baseCapacity: 4,
      totalCapacity: 6,
      extraCost: 100,
    },
    {
      label: "Conference Room",
      category: "conference-room",
      roomId: "BANYAN-MR-12",
      baseCapacity: 9,
      totalCapacity: 12,
      extraCost: 100,
    },
  ],
  olive: [
    {
      label: "Workstation",
      category: "workstation",
      resourceIds: Array.from(
        { length: 16 },
        (_, i) => `OLIVE-WS-${String(i + 1).padStart(2, "0")}`
      ),
    },
    {
      label: "Conference Room",
      category: "conference-room",
      roomId: "OLIVE-MR-12",
      baseCapacity: 9,
      totalCapacity: 12,
      extraCost: 100,
    },
  ],
};

function WorkstationBookingDialog({
  officeId,
  workstationId,
  date,
  onOpenChange,
  onBooked,
  user,
}: {
  officeId: string;
  workstationId: string;
  date: Date;
  onOpenChange: (open: boolean) => void;
  onBooked: () => void;
  user: User | null;
}) {
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("17:30");
  const [isReserving, setIsReserving] = useState(false);

  const firestore = useFirestore();
  const { toast } = useToast();

  const startDateTime = parse(startTime, "HH:mm", date);
  const endDateTime = parse(endTime, "HH:mm", date);
  const validationResult = validateBookingTime(startDateTime, endDateTime);

  const { totalCost, pricingTier, details } = calculateWorkstationBookingAmount({
    startTime: startDateTime,
    endTime: endDateTime,
  });

  const handleBookWorkstation = async () => {
    if (!user || !firestore || !officeId || !workstationId) {
        toast({ variant: "destructive", title: "Error", description: "Missing required booking information. Please refresh and try again." });
        return;
    }

    if (totalCost <= 0) {
      toast({ variant: 'destructive', title: 'Invalid time selected.' });
      return;
    }
    
    setIsReserving(true);
    let newBookingId: string | null = null;
    
    try {
        const newBookingRef = doc(collection(firestore, "bookings"));
        newBookingId = newBookingRef.id;

        await runTransaction(firestore, async (transaction) => {
            const bookingsRef = collection(firestore, "bookings");
            const dateStr = format(startDateTime, 'yyyy-MM-dd');
            
            const q = query(
                bookingsRef,
                where("officeId", "==", officeId),
                where("workspaceId", "==", workstationId),
                where("date", "==", dateStr)
            );

            const snapshot = await getDocs(q);
            const existingBookings = snapshot.docs.map(d => d.data()).filter(b => b.status !== 'cancelled');

            const hasConflictInTx = existingBookings.some(booking => {
                const existingStart = (booking.startTime as Timestamp).toDate();
                const existingEnd = (booking.endTime as Timestamp).toDate();
                return startDateTime < existingEnd && endDateTime > existingStart;
            });

            if (hasConflictInTx) {
                throw new Error("This time slot was just booked. Please try another one.");
            }

            transaction.set(newBookingRef, {
                officeId,
                userId: user.uid,
                userName: user.displayName || user.email,
                workspaceId: workstationId,
                workspaceName: `Workstation ${workstationId.split("-").pop()}`,
                workspaceType: 'desk',
                date: format(date, "yyyy-MM-dd"),
                startTime: Timestamp.fromDate(startDateTime),
                endTime: Timestamp.fromDate(endDateTime),
                isExtendedHours: validationResult.extended,
                pricingType: validationResult.extended ? 'extended' : 'standard',
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: serverTimestamp(),
            });
        });

      if (!newBookingId) {
        setIsReserving(false);
        return;
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: totalCost,
          bookingId: newBookingId,
          officeId: officeId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Razorpay order.");
      }
      
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: `9to5 Workspace`,
        description: `Booking for ${format(date, "PPP")} from ${startTime} to ${endTime}`,
        order_id: order.id,
        notes: {
            bookingId: newBookingId,
            officeId: officeId,
        },
        handler: async function (response: any) {
          const verificationRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: newBookingId!,
            }),
          });
          
          if (verificationRes.ok) {
            toast({ title: 'Workstation Booked!', description: `You've booked Workstation ${workstationId.split('-').pop()} on ${format(date, 'PPP')} from ${startTime} to ${endTime}.` });
            onBooked();
            onOpenChange(false);
          } else {
             toast({ variant: 'destructive', title: 'Payment Failed', description: 'Payment verification failed. Please contact support.' });
             onBooked();
          }
          setIsReserving(false);
        },
        prefill: {
            name: user.displayName || '',
            email: user.email || '',
        },
        theme: {
          color: "#C8A24D",
        },
        modal: {
            ondismiss: async function() {
                setIsReserving(false);
            }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', async function (response: any) {
        toast({ variant: 'destructive', title: 'Payment Failed', description: response.error.description });
        setIsReserving(false);
      });

    } catch (error: any) {
        console.error("Error reserving workstation: ", error);
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not reserve the workstation. Please try again.' });
        setIsReserving(false);
        return;
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Workstation {workstationId.split('-').pop()}</DialogTitle>
          <DialogDescription>
            For {format(date, "PPP")}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-10" step="1800" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-10" step="1800" />
              </div>
            </div>
          </div>
          
          {totalCost > 0 && (
             <Card className="bg-muted/50 p-4">
              <CardContent className="p-0">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Pricing Tier:</span> <span className="font-medium">{pricingTier}</span></div>
                  <div className="flex justify-between"><span>Details:</span> <span>{details}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Estimate:</span> <span>₹{totalCost.toFixed(2)}</span></div>
                </div>
              </CardContent>
            </Card>
          )}

          {validationResult.extended && (
            <Alert className="bg-yellow-50 border-yellow-300 text-yellow-900 [&>svg]:text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Extended Hours Selected</AlertTitle>
              <AlertDescription>{validationResult.message}</AlertDescription>
            </Alert>
          )}
          {!validationResult.valid && validationResult.reason && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invalid Time</AlertTitle>
              <AlertDescription>{validationResult.reason}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleBookWorkstation} disabled={isReserving || !validationResult.valid}>
            {isReserving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function WorkstationSelector({
  wsIds,
  bookings,
  user,
  onBookWorkstation
}: {
  wsIds: string[];
  bookings: Booking[];
  user: User | null;
  onBookWorkstation: (workstationId: string) => void;
}) {
  
  const getBookingStatus = (wsId: string) => {
    const userBookings = bookings.filter(b => b.userId === user?.uid && b.workspaceId === wsId && b.workspaceType === "desk" && b.status === "confirmed");
    if(userBookings.length > 0) return 'my-booking';
    
    const otherBookings = bookings.filter(b => b.workspaceId === wsId && b.workspaceType === "desk" && b.status === "confirmed");
    if(otherBookings.length > 0) return 'booked';

    return "available";
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 pt-4">
      {wsIds.map((wsId) => {
        const status = getBookingStatus(wsId);
        const isDisabled =
          status === "booked" || status === "my-booking";

        return (
          <Button
            key={wsId}
            onClick={() => onBookWorkstation(wsId)}
            disabled={isDisabled}
            className={cn(
              "font-semibold transition-all",
              status === "available" &&
                "bg-green-100 text-green-800 hover:bg-green-200",
              status === "booked" && "bg-red-100 text-red-800 cursor-not-allowed",
              status === "my-booking" &&
                "bg-blue-100 text-blue-800 cursor-not-allowed"
            )}
            title={wsId}
          >
            {wsId.split("-").pop()}
          </Button>
        );
      })}
    </div>
  );
}

function RoomBookingDialog({
  officeId,
  room,
  date,
  extraChairs,
  onOpenChange,
  onBooked,
  user,
}: {
  officeId: string;
  room: Workspace;
  date: Date;
  extraChairs: number;
  onOpenChange: (open: boolean) => void;
  onBooked: () => void;
  user: User | null;
}) {
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("10:30");
  const [isReserving, setIsReserving] = useState(false);

  const firestore = useFirestore();
  const { toast } = useToast();

  const startDateTime = parse(startTime, "HH:mm", date);
  const endDateTime = parse(endTime, "HH:mm", date);
  const validationResult = validateBookingTime(startDateTime, endDateTime);

  const durationInHours = Math.max(0, (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60));

  const { roomCost, extraChairCost, totalCost } = calculateRoomBookingAmount({
    roomName: room.name,
    durationInHours,
    extraChairs,
  });
  
  const handleReserveClick = async () => {
    if (!user || !firestore || !officeId || !room.id) {
        toast({ variant: "destructive", title: "Error", description: "Missing required booking information. Please refresh and try again." });
        return;
    }

    if (isNaN(durationInHours) || durationInHours <= 0) {
      toast({ variant: 'destructive', title: 'Invalid time selected.' });
      return;
    }

    setIsReserving(true);
    let newBookingId: string | null = null;

    try {
        const newBookingRef = doc(collection(firestore, "bookings"));
        newBookingId = newBookingRef.id;

        await runTransaction(firestore, async (transaction) => {
            const bookingsRef = collection(firestore, "bookings");
            const dateStr = format(startDateTime, 'yyyy-MM-dd');
            
            const q = query(
                bookingsRef,
                where("officeId", "==", officeId),
                where("workspaceId", "==", room.id),
                where("date", "==", dateStr)
            );

            const snapshot = await getDocs(q);
            const existingBookings = snapshot.docs.map(d => d.data()).filter(b => b.status !== 'cancelled');

            const hasConflictInTx = existingBookings.some(booking => {
                const existingStart = (booking.startTime as Timestamp).toDate();
                const existingEnd = (booking.endTime as Timestamp).toDate();
                return startDateTime < existingEnd && endDateTime > existingStart;
            });

            if (hasConflictInTx) {
                throw new Error("This time slot was just booked. Please try another one.");
            }

            transaction.set(newBookingRef, {
                officeId,
                userId: user.uid,
                userName: user.displayName || user.email,
                workspaceId: room.id,
                workspaceName: `${room.name} (+${extraChairs} seats)`,
                workspaceType: 'room',
                date: format(date, "yyyy-MM-dd"),
                startTime: Timestamp.fromDate(startDateTime),
                endTime: Timestamp.fromDate(endDateTime),
                isExtendedHours: validationResult.extended,
                pricingType: validationResult.extended ? 'extended' : 'standard',
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: serverTimestamp(),
            });
        });

      if (!newBookingId) {
          setIsReserving(false);
          return;
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAmount: totalCost,
          bookingId: newBookingId,
          officeId: officeId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Razorpay order.");
      }
      
      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: `9to5 Workspace`,
        description: `Booking for ${format(date, "PPP")} from ${startTime} to ${endTime}`,
        order_id: order.id,
        notes: {
            bookingId: newBookingId,
            officeId: officeId,
        },
        handler: async function (response: any) {
          const verificationRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: newBookingId!,
            }),
          });
          
          if (verificationRes.ok) {
            toast({ title: 'Room Reserved!', description: `You've booked ${room.name} on ${format(date, 'PPP')} from ${startTime} to ${endTime}.` });
            onBooked();
            onOpenChange(false);
          } else {
             toast({ variant: 'destructive', title: 'Payment Failed', description: 'Payment verification failed. Please contact support.' });
             onBooked();
          }
          setIsReserving(false);
        },
        prefill: {
            name: user.displayName || '',
            email: user.email || '',
        },
        theme: {
          color: "#C8A24D",
        },
        modal: {
            ondismiss: async function() {
                setIsReserving(false);
            }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      rzp.on('payment.failed', async function (response: any) {
        toast({ variant: 'destructive', title: 'Payment Failed', description: response.error.description });
        setIsReserving(false);
      });

    } catch (error: any) {
        console.error("Error reserving room: ", error);
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not reserve the room. Please try again.' });
        setIsReserving(false);
        return;
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve {room.name}</DialogTitle>
          <DialogDescription>
            For {format(date, "PPP")}. Base capacity: {room.name.toLowerCase().includes('conference') ? 9 : 4} people.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-10" step="1800" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-10" step="1800" />
              </div>
            </div>
          </div>
          
          {extraChairs > 0 && <p className="text-sm text-muted-foreground">{extraChairs} extra seat(s) selected.</p>}

          {durationInHours > 0 && (
             <Card className="bg-muted/50 p-4">
              <CardContent className="p-0">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Duration:</span> <span>{durationInHours.toFixed(1)} hours</span></div>
                  <div className="flex justify-between"><span>Room Cost:</span> <span>₹{roomCost}</span></div>
                  {extraChairs > 0 && <div className="flex justify-between"><span>Extra Seats Cost:</span> <span>₹{extraChairCost}</span></div>}
                  <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Estimate:</span> <span>₹{totalCost.toFixed(2)}</span></div>
                </div>
              </CardContent>
            </Card>
          )}

          {validationResult.extended && (
            <Alert className="bg-yellow-50 border-yellow-300 text-yellow-900 [&>svg]:text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Extended Hours Selected</AlertTitle>
              <AlertDescription>{validationResult.message}</AlertDescription>
            </Alert>
          )}
          {!validationResult.valid && validationResult.reason && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invalid Time</AlertTitle>
              <AlertDescription>{validationResult.reason}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleReserveClick} disabled={isReserving || !validationResult.valid}>
            {isReserving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function RoomSelector({
  roomId,
  baseCapacity,
  totalCapacity,
  extraCost,
  onBookRoom,
}: {
  roomId: string;
  baseCapacity: number;
  totalCapacity: number;
  extraCost: number;
  onBookRoom: (room: Workspace, extraChairs: number) => void;
}) {
  const [extraChairs, setExtraChairs] = useState(0);

  const room = allResources.find((r) => r.id === roomId);
  
  if (!room) return <p className="text-red-500">Room configuration error.</p>;

  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">This room is booked as a whole. Select the number of extra chairs you need.</p>
          <div className="flex flex-wrap gap-4 items-center">
            {Array.from({ length: totalCapacity }).map((_, i) => {
              const isExtra = i >= baseCapacity;
              const isSelected = isExtra && i - baseCapacity < extraChairs;
              return (
                <Button
                  key={i}
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    isExtra &&
                    setExtraChairs((c) =>
                      i - baseCapacity < c ? i - baseCapacity : i - baseCapacity + 1
                    )
                  }
                  className={cn(
                    "h-12 w-12",
                    isSelected && "bg-blue-200 border-blue-400",
                    isExtra && "cursor-pointer hover:bg-gray-100",
                    !isExtra && "opacity-50 cursor-default"
                  )}
                  disabled={!isExtra}
                  title={isExtra ? `Select ${i + 1} seats` : `Seat ${i + 1} (included)`}
                >
                  <Armchair
                    className={cn(
                      isSelected ? "text-blue-700" : "text-gray-600"
                    )}
                  />
                </Button>
              );
            })}
          </div>
          <div className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">
              The first {baseCapacity} seats are included. Each additional seat
              costs ₹{extraCost}/hr.
            </p>
            {extraChairs > 0 && (
              <p className="font-semibold">
                You've selected {extraChairs} extra seat(s).
              </p>
            )}
            <Button onClick={() => onBookRoom(room, extraChairs)}>
              Select Time for {room.name}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InteractiveBooking(props: InteractiveBookingProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ResourceCategory | null>(null);
  const [roomDetails, setRoomDetails] = useState<{ room: Workspace, extraChairs: number} | null>(null);
  const [workstationDetails, setWorkstationDetails] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const config = officeConfig[props.officeId];

  const handleRoomSelection = (room: Workspace, extraChairs: number) => {
    if (!props.user) {
        toast({ title: "Login Required", description: "Please log in to book a space." });
        router.push(`/login?redirect_uri=/seat-booking?office=${props.officeId}`);
        return;
    }
    if (!props.agreedToTerms) {
        toast({
            variant: "destructive",
            title: "Terms Required",
            description: "Please agree to the terms and conditions on this page before booking.",
        });
        return;
    }
    setRoomDetails({ room, extraChairs });
  }

  const handleWorkstationSelection = (workstationId: string) => {
    if (!props.user) {
        toast({ title: "Login Required", description: "Please log in to book a space." });
        router.push(`/login?redirect_uri=/seat-booking?office=${props.officeId}`);
        return;
    }
    if (!props.agreedToTerms) {
        toast({
            variant: "destructive",
            title: "Terms Required",
            description: "Please agree to the terms and conditions on this page before booking.",
        });
        return;
    }
    setWorkstationDetails(workstationId);
  }

  if (!config) return null;

  const renderContent = () => {
    if (!selectedCategory) return null;

    const categoryConfig = config.find((c) => c.category === selectedCategory);
    if (!categoryConfig) return null;

    if (categoryConfig.resourceIds) {
      return <WorkstationSelector 
        onBookWorkstation={handleWorkstationSelection}
        wsIds={categoryConfig.resourceIds} 
        bookings={props.bookings}
        user={props.user}
      />;
    }

    if (
      categoryConfig.roomId &&
      categoryConfig.baseCapacity &&
      categoryConfig.totalCapacity &&
      categoryConfig.extraCost
    ) {
      return (
        <RoomSelector
          roomId={categoryConfig.roomId}
          baseCapacity={categoryConfig.baseCapacity}
          totalCapacity={categoryConfig.totalCapacity}
          extraCost={categoryConfig.extraCost}
          onBookRoom={handleRoomSelection}
        />
      );
    }

    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {config.map((item) => (
          <Button
            key={item.category}
            variant={selectedCategory === item.category ? "default" : "outline"}
            onClick={() => setSelectedCategory(item.category)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="mt-4">{renderContent()}</div>

       {workstationDetails && props.date && (
        <WorkstationBookingDialog
          officeId={props.officeId}
          workstationId={workstationDetails}
          date={props.date}
          user={props.user}
          onOpenChange={(open) => !open && setWorkstationDetails(null)}
          onBooked={() => {
              setWorkstationDetails(null);
              props.onBooking();
          }}
        />
       )}
       
       {roomDetails && props.date && (
        <RoomBookingDialog
            officeId={props.officeId}
            room={roomDetails.room}
            date={props.date}
            extraChairs={roomDetails.extraChairs}
            onOpenChange={(open) => !open && setRoomDetails(null)}
            onBooked={() => {
                setRoomDetails(null);
                props.onBooking();
            }}
            user={props.user}
        />
    )}
    </div>
  );
}
