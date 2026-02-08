"use client";
import { useState, useMemo } from "react";
import type { User } from "firebase/auth";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import type { Booking } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Armchair } from "lucide-react";
import { allResources } from "@/lib/resources";
import { hasBookingConflict } from "@/lib/checkBookingConflict";

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

function RoomSelector({
  roomId,
  baseCapacity,
  totalCapacity,
  extraCost,
  ...props
}: InteractiveBookingProps & {
  roomId: string;
  baseCapacity: number;
  totalCapacity: number;
  extraCost: number;
}) {
  const { officeId, date, bookings, user, agreedToTerms, onBooking } = props;
  const [extraChairs, setExtraChairs] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

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

  const handleBookRoom = () => {
    // This is a placeholder. For a real app, we'd open a dialog for time selection.
    // As per prompt, this part is simplified.
    toast({
      title: "Booking not implemented",
      description: "Time selection is required to book a room.",
    });
  };

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
            <Button onClick={handleBookRoom} disabled>
              Book {room.name}
            </Button>
            <p className="text-xs text-muted-foreground">
              Note: Room booking requires time selection. This feature is
              demonstrative.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InteractiveBooking(props: InteractiveBookingProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ResourceCategory | null>(null);
  const config = officeConfig[props.officeId];

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
    </div>
  );
}
