
"use client";
import { useState, useMemo } from "react";
import type { User } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
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
import { hasBookingConflict } from "@/lib/checkBookingConflict";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from 'next/link';
import { validateBookingTime } from "@/lib/validateBookingTime";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

function WorkstationSelector({
  wsIds,
  officeId,
  date,
  bookings,
  user,
  agreedToTerms,
  onBooking,
}: InteractiveBookingProps & { wsIds: string[] }) {
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  );
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const getBookingStatus = (wsId: string) => {
    const booking = bookings.find(
      (b) => b.workspaceId === wsId && b.workspaceType === "desk"
    );
    if (!booking) return "available";
    if (booking.userId === user?.uid) return "my-booking";
    return "booked";
  };

  const handleBookWorkstation = async (workstationId: string) => {
    if (!user || !firestore) {
      router.push(`/login?redirect_uri=/seat-booking?office=${officeId}`);
      return;
    }
    if (!date) {
      toast({ variant: "destructive", title: "Please select a date." });
      return;
    }
    if (!agreedToTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
      });
      return;
    }

    setBookingInProgress(workstationId);
    try {
      const dayStart = new Date(date);
      dayStart.setHours(9, 30, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(17, 30, 0, 0);

      const conflict = await hasBookingConflict({
        firestore,
        officeId,
        workspaceId: workstationId,
        startTime: dayStart,
        endTime: dayEnd,
      });

      if (conflict) {
        toast({
          variant: 'destructive',
          title: 'Booking Conflict',
          description: 'This workstation is no longer available. Please refresh.',
        });
        onBooking();
        setBookingInProgress(null);
        return;
      }

      await addDoc(collection(firestore, "bookings"), {
        officeId,
        userId: user.uid,
        userName: user.displayName || user.email,
        workspaceId: workstationId,
        workspaceName: `Workstation ${workstationId.split("-").pop()}`,
        workspaceType: "desk",
        date: format(date, "yyyy-MM-dd"),
        startTime: Timestamp.fromDate(dayStart),
        endTime: Timestamp.fromDate(dayEnd),
        status: "confirmed",
        isExtendedHours: false,
        pricingType: "standard",
      });
      toast({
        title: "Workstation Booked!",
        description: `You have booked ${workstationId} for ${format(
          date,
          "PPP"
        )}.`,
      });
      onBooking();
    } catch (error) {
      console.error("Error booking workstation: ", error);
      toast({
        variant: "destructive",
        title: "Booking Error",
        description: "Could not book the workstation.",
      });
    } finally {
      setBookingInProgress(null);
    }
  };

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 pt-4">
      {wsIds.map((wsId) => {
        const status = getBookingStatus(wsId);
        const isBookingThis = bookingInProgress === wsId;
        const isDisabled =
          status === "booked" || status === "my-booking" || !!bookingInProgress;

        return (
          <Button
            key={wsId}
            onClick={() => handleBookWorkstation(wsId)}
            disabled={isDisabled}
            className={cn(
              "font-semibold transition-all",
              status === "available" &&
                "bg-green-100 text-green-800 hover:bg-green-200",
              status === "booked" && "bg-red-100 text-red-800 cursor-not-allowed",
              status === "my-booking" &&
                "bg-blue-100 text-blue-800 cursor-not-allowed"
            )}
          >
            {isBookingThis ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              wsId.split("-").pop()
            )}
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
  const [dialogAgreedToTerms, setDialogAgreedToTerms] = useState(false);

  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const startDateTime = parse(startTime, "HH:mm", date);
  const endDateTime = parse(endTime, "HH:mm", date);
  const validationResult = validateBookingTime(startDateTime, endDateTime);

  const durationHours = Math.max(0, (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60));

  const { roomCost, extraChairCost, totalCost } = calculateRoomBookingAmount({
    roomName: room.name,
    durationInHours,
    extraChairs,
  });
  
  const handleReserveClick = async () => {
    if (!user) {
      router.push(`/login?redirect_uri=/seat-booking?office=${officeId}`);
      return;
    }
    if (!firestore) return;

    setIsReserving(true);

    try {
      const conflict = await hasBookingConflict({ firestore, officeId, workspaceId: room.id, startTime: startDateTime, endTime: endDateTime });

      if (conflict) {
        toast({ variant: 'destructive', title: 'Booking Conflict', description: 'This time slot is unavailable. Please choose another time or refresh.' });
        onBooked();
        setIsReserving(false);
        return;
      }
      
      await addDoc(collection(firestore, 'bookings'), {
        officeId,
        userId: user.uid,
        userName: user.displayName || user.email,
        workspaceId: room.id,
        workspaceName: `${room.name} (+${extraChairs} seats)`,
        workspaceType: 'room',
        date: format(date, 'yyyy-MM-dd'),
        startTime: Timestamp.fromDate(startDateTime),
        endTime: Timestamp.fromDate(endDateTime),
        isExtendedHours: validationResult.extended,
        pricingType: validationResult.extended ? 'extended' : 'standard',
        status: 'confirmed',
      });

      toast({ title: 'Room Reserved!', description: `You've booked ${room.name} on ${format(date, 'PPP')} from ${startTime} to ${endTime}.` });
      onBooked();
      onOpenChange(false);
    } catch (error) {
        console.error("Error reserving room: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not reserve the room. Please try again.' });
    } finally {
        setIsReserving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
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

          {durationHours > 0 && (
             <Card className="bg-muted/50 p-4">
              <CardContent className="p-0">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between"><span>Duration:</span> <span>{durationHours.toFixed(1)} hours</span></div>
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
            {isReserving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm Reservation"}
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
  ...props
}: InteractiveBookingProps & {
  roomId: string;
  baseCapacity: number;
  totalCapacity: number;
  extraCost: number;
  onBookRoom: (room: Workspace, extraChairs: number) => void;
}) {
  const { officeId, date, bookings, user, agreedToTerms, onBooking } = props;
  const [extraChairs, setExtraChairs] = useState(0);

  const room = allResources.find((r) => r.id === roomId);
  const isRoomBooked = useMemo(
    () =>
      bookings.some(
        (b) => b.workspaceId === roomId && b.workspaceType === "room"
      ),
    [bookings, roomId]
  );

  if (!room) return <p className="text-red-500">Room configuration error.</p>;

  if (isRoomBooked) {
    return (
      <p className="text-center text-muted-foreground p-8">
        This room is already booked for the selected date.
      </p>
    );
  }

  return (
    <div className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>{room.name}</CardTitle>
        </CardHeader>
        <CardContent>
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
                    !isExtra && "opacity-50"
                  )}
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
              Book {room.name}
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
  const router = useRouter();
  const { toast } = useToast();

  const config = officeConfig[props.officeId];

  const handleRoomSelection = (room: Workspace, extraChairs: number) => {
    if (!props.user) {
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

  if (!config) return null;

  const renderContent = () => {
    if (!selectedCategory) return null;

    const categoryConfig = config.find((c) => c.category === selectedCategory);
    if (!categoryConfig) return null;

    if (categoryConfig.resourceIds) {
      return <WorkstationSelector wsIds={categoryConfig.resourceIds} {...props} />;
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
          {...props}
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
