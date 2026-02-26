"use client";
import { useState } from "react";
import Script from "next/script";
import type { User } from "firebase/auth";
import { collection, Timestamp, runTransaction, query, where, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Added for the terms link

import type { Booking, Workspace } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Armchair, Clock, AlertTriangle } from "lucide-react";
import { allResources } from "@/lib/resources";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { validateBookingTime } from "@/lib/validateBookingTime";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox"; // Ensure you have this shadcn component

// ... (calculateTotalBookedMinutes and OccupancyBar remain unchanged)

function WorkstationBookingDialog({
  officeId,
  workstationId,
  date,
  onOpenChange,
  onBooked,
  user,
  bookings,
}: {
  officeId: string;
  workstationId: string;
  date: Date;
  onOpenChange: (open: boolean) => void;
  onBooked: () => void;
  user: User | null;
  bookings: Booking[];
}) {
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("17:30");
  const [isReserving, setIsReserving] = useState(false);
  const [agreed, setAgreed] = useState(false); // New state for terms

  const firestore = useFirestore();
  const { toast } = useToast();

  const startDateTime = parse(startTime, "HH:mm", date);
  const endDateTime = parse(endTime, "HH:mm", date);
  const validationResult = validateBookingTime(startDateTime, endDateTime);

  const { totalCost, pricingTier, details } = calculateWorkstationBookingAmount({
    startTime: startDateTime,
    endTime: endDateTime,
  });

  const seatBookings = bookings?.filter(b => b.workspaceId === workstationId && b.status === "confirmed") || [];

  const handleBookWorkstation = async () => {
    if (!agreed) return; // Guard clause
    if (!user || !firestore || !officeId || !workstationId) {
        toast({ variant: "destructive", title: "Error", description: "Missing required booking information." });
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
                where("date", "==", dateStr),
                where("status", "==", "confirmed")
            );

            const snapshot = await getDocs(q);
            const existingBookings = snapshot.docs.map(d => ({...d.data(), startTime: (d.data().startTime as Timestamp).toDate(), endTime: (d.data().endTime as Timestamp).toDate()} as Booking));

            const hasConflictInTx = existingBookings.some(booking => {
                return startDateTime < booking.endTime && endDateTime > booking.startTime;
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
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create Razorpay order.");
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
              amount: order.amount,
            }),
          });
          
          if (verificationRes.ok) {
            toast({ title: 'Workstation Booked!', description: `You've booked Workstation ${workstationId.split('-').pop()} on ${format(date, 'PPP')} from ${startTime} to ${endTime}.` });
            onBooked();
            onOpenChange(false);
          } else {
             toast({ variant: 'destructive', title: 'Payment Failed', description: 'Payment verification failed.' });
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

    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not reserve the workstation.' });
        setIsReserving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Workstation {workstationId.split('-').pop()}</DialogTitle>
          <DialogDescription>For {format(date, "PPP")}.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          {totalCost > 0 && (
             <Card className="bg-muted/50 p-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Pricing Tier:</span> <span>{pricingTier}</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2"><span>Total Estimate:</span> <span>₹{totalCost.toFixed(2)}</span></div>
                </div>
            </Card>
          )}

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link> and Refund Policy.
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleBookWorkstation} disabled={isReserving || !validationResult.valid || !agreed}>
            {isReserving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  bookings,
}: {
  officeId: string;
  room: Workspace;
  date: Date;
  extraChairs: number;
  onOpenChange: (open: boolean) => void;
  onBooked: () => void;
  user: User | null;
  bookings: Booking[];
}) {
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("10:30");
  const [isReserving, setIsReserving] = useState(false);
  const [agreed, setAgreed] = useState(false); // New state for terms

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
    if (!agreed) return;
    if (!user || !firestore || !officeId || !room.id) return;
    setIsReserving(true);

    try {
      // ... (Firestore transaction logic same as your original)
      // ... (Razorpay creation logic same as your original)
      
      // Note: Ensure the confirm button logic uses the 'agreed' state
    } catch (e) {
      setIsReserving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange} modal={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve {room.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
           {/* ... (Existing Time Pickers) */}

          {durationInHours > 0 && (
             <Card className="bg-muted/50 p-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Total Estimate:</span> <span className="font-bold">₹{totalCost.toFixed(2)}</span></div>
                </div>
            </Card>
          )}

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms-room" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <label htmlFor="terms-room" className="text-xs text-muted-foreground leading-none">
              I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link>.
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleReserveClick} disabled={isReserving || !validationResult.valid || !agreed}>
            {isReserving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function InteractiveBooking(props: InteractiveBookingProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [roomDetails, setRoomDetails] = useState<{ room: Workspace, extraChairs: number} | null>(null);
  const [workstationDetails, setWorkstationDetails] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleRoomSelection = (room: Workspace, extraChairs: number) => {
    if (!props.user) {
        router.push(`/login?redirect_uri=/seat-booking?office=${props.officeId}`);
        return;
    }
    // Logic removed: Customer wants terms at the end, not here.
    setRoomDetails({ room, extraChairs });
  }

  const handleWorkstationSelection = (workstationId: string) => {
    if (!props.user) {
        router.push(`/login?redirect_uri=/seat-booking?office=${props.officeId}`);
        return;
    }
    // Logic removed: Customer wants terms at the end, not here.
    setWorkstationDetails(workstationId);
  }

  // ... (Rest of the component remains the same)
}
