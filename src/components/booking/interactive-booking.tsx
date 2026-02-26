"use client";
import { useState } from "react";
import Script from "next/script";
import type { User } from "firebase/auth";
import { collection, Timestamp, runTransaction, query, where, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
import { Checkbox } from "@/components/ui/checkbox";

/**
 * UTILS & CALCULATIONS
 */
const calculateTotalBookedMinutes = (bookings: Booking[]): number => {
    if (!bookings || bookings.length === 0) return 0;
    const sortedBookings = [...bookings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const merged = [JSON.parse(JSON.stringify(sortedBookings[0]))];
    for (let i = 1; i < sortedBookings.length; i++) {
        const current = sortedBookings[i];
        const lastMerged = merged[merged.length - 1];
        const lastMergedEndTime = new Date(lastMerged.endTime);
        const currentStartTime = new Date(current.startTime);
        if (currentStartTime < lastMergedEndTime) {
            const currentEndTime = new Date(current.endTime);
            lastMerged.endTime = new Date(Math.max(lastMergedEndTime.getTime(), currentEndTime.getTime()));
        } else {
            merged.push(JSON.parse(JSON.stringify(current)));
        }
    }
    const totalMilliseconds = merged.reduce((acc, b) => acc + (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()), 0);
    return totalMilliseconds / (1000 * 60);
};

function OccupancyBar({ bookings, isAdminBlocked }: { bookings: Booking[], isAdminBlocked?: boolean }) {
  const DAY_START_MINS = 9 * 60 + 30; 
  const DAY_TOTAL_MINS = 8 * 60; 
  if (isAdminBlocked) return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1"><div className="h-full bg-red-500 w-full" /></div>
  );
  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex mt-1 relative">
      {bookings.map((b, i) => {
        const startMins = b.startTime.getHours() * 60 + b.startTime.getMinutes();
        const endMins = b.endTime.getHours() * 60 + b.endTime.getMinutes();
        const left = Math.max(0, ((startMins - DAY_START_MINS) / DAY_TOTAL_MINS) * 100);
        const width = Math.min(100, ((endMins - startMins) / DAY_TOTAL_MINS) * 100);
        return <div key={i} className="h-full bg-red-500 absolute" style={{ left: `${left}%`, width: `${width}%` }} />;
      })}
    </div>
  );
}

const calculateWorkstationBookingAmount = ({ startTime, endTime }: { startTime: Date; endTime: Date; }) => {
  const durationInHours = Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
  if (durationInHours <= 0) return { totalCost: 0, pricingTier: 'Invalid', details: '' };
  const HOURLY_RATE = 350;
  const DAY_PASS_RATE = 1000;
  const EXTENDED_RATE = 200;
  const hourlyCost = durationInHours * HOURLY_RATE;
  const standardDayEnd = new Date(startTime); standardDayEnd.setHours(17, 30, 0, 0);
  const extendedHoursStart = Math.max(startTime.getTime(), standardDayEnd.getTime());
  const extendedDurationHours = Math.max(0, endTime.getTime() - extendedHoursStart) / (1000 * 60 * 60);
  const dayPassCost = DAY_PASS_RATE + (Math.ceil(extendedDurationHours) * EXTENDED_RATE);

  if (dayPassCost < hourlyCost && durationInHours > 2.8) {
    return { totalCost: dayPassCost, pricingTier: 'Day Pass', details: `Day Pass + ${extendedDurationHours.toFixed(1)} Extended hrs` };
  }
  return { totalCost: hourlyCost, pricingTier: 'Hourly', details: `${durationInHours.toFixed(1)} hrs @ ₹${HOURLY_RATE}/hr` };
};

const calculateRoomBookingAmount = ({ roomName, durationInHours, extraChairs }: { roomName: string; durationInHours: number; extraChairs: number; }) => {
  const isConference = roomName.toLowerCase().includes('conference');
  const roomCost = (isConference ? 1000 : 750) * durationInHours;
  const extraChairCost = extraChairs * 100 * durationInHours;
  return { roomCost, extraChairCost, totalCost: roomCost + extraChairCost };
};

/**
 * CONFIG & PROPS
 */
type ResourceCategory = "workstation" | "meeting-room" | "conference-room";
const officeConfig: Record<string, any[]> = {
  banyan: [
    { label: "Workstation", category: "workstation", resourceIds: Array.from({ length: 12 }, (_, i) => `BANYAN-WS-${String(i + 1).padStart(2, "0")}`) },
    { label: "Meeting Room", category: "meeting-room", roomId: "BANYAN-MR-06", baseCapacity: 4, totalCapacity: 6, extraCost: 100 },
    { label: "Conference Room", category: "conference-room", roomId: "BANYAN-MR-12", baseCapacity: 9, totalCapacity: 12, extraCost: 100 },
  ],
  olive: [
    { label: "Workstation", category: "workstation", resourceIds: Array.from({ length: 16 }, (_, i) => `OLIVE-WS-${String(i + 1).padStart(2, "0")}`) },
    { label: "Conference Room", category: "conference-room", roomId: "OLIVE-MR-12", baseCapacity: 9, totalCapacity: 12, extraCost: 100 },
  ],
};

/**
 * DIALOG COMPONENTS
 */
function WorkstationBookingDialog({ officeId, workstationId, date, onOpenChange, onBooked, user, bookings }: any) {
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("17:30");
  const [isReserving, setIsReserving] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const startDT = parse(startTime, "HH:mm", date);
  const endDT = parse(endTime, "HH:mm", date);
  const validation = validateBookingTime(startDT, endDT);
  const { totalCost, pricingTier, details } = calculateWorkstationBookingAmount({ startTime: startDT, endTime: endDT });

  const handleBook = async () => {
    if (!agreed || !user || !firestore) return;
    setIsReserving(true);
    try {
        const newRef = doc(collection(firestore, "bookings"));
        await runTransaction(firestore, async (transaction) => {
            const q = query(collection(firestore, "bookings"), where("officeId", "==", officeId), where("workspaceId", "==", workstationId), where("date", "==", format(startDT, 'yyyy-MM-dd')), where("status", "==", "confirmed"));
            const snap = await getDocs(q);
            const conflict = snap.docs.some(d => {
                const b = d.data();
                return startDT < (b.endTime as Timestamp).toDate() && endDT > (b.startTime as Timestamp).toDate();
            });
            if (conflict) throw new Error("Slot already booked.");
            transaction.set(newRef, { officeId, userId: user.uid, userName: user.displayName || user.email, workspaceId: workstationId, workspaceName: `Workstation ${workstationId.split("-").pop()}`, workspaceType: 'desk', date: format(date, "yyyy-MM-dd"), startTime: Timestamp.fromDate(startDT), endTime: Timestamp.fromDate(endDT), status: 'pending', paymentStatus: 'pending', createdAt: serverTimestamp() });
        });

        const res = await fetch("/api/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ totalAmount: totalCost, bookingId: newRef.id, officeId }) });
        const order = await res.json();
        const rzp = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            order_id: order.id,
            name: "9to5 Workspace",
            handler: async (response: any) => {
                const v = await fetch('/api/verify-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...response, bookingId: newRef.id, amount: order.amount }) });
                if (v.ok) { toast({ title: "Booked!" }); onBooked(); onOpenChange(false); }
                setIsReserving(false);
            },
            modal: { ondismiss: () => setIsReserving(false) }
        });
        rzp.open();
    } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); setIsReserving(false); }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reserve Workstation {workstationId.split('-').pop()}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start</Label><Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
            <div className="space-y-2"><Label>End</Label><Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
          </div>
          <Card className="bg-muted/50 p-4 text-sm">
            <div className="flex justify-between"><span>Tier:</span><span>{pricingTier}</span></div>
            <div className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total:</span><span>₹{totalCost.toFixed(2)}</span></div>
          </Card>
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={checked => setAgreed(checked as boolean)} />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-none">
              I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link>.
            </label>
          </div>
        </div>
        <DialogFooter><Button onClick={handleBook} disabled={isReserving || !validation.valid || !agreed}>Confirm & Pay</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoomBookingDialog({ officeId, room, date, extraChairs, onOpenChange, onBooked, user, bookings }: any) {
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("10:30");
  const [isReserving, setIsReserving] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const startDT = parse(startTime, "HH:mm", date);
  const endDT = parse(endTime, "HH:mm", date);
  const validation = validateBookingTime(startDT, endDT);
  const duration = Math.max(0, (endDT.getTime() - startDT.getTime()) / (1000 * 60 * 60));
  const { totalCost } = calculateRoomBookingAmount({ roomName: room.name, durationInHours: duration, extraChairs });

  const handleBook = async () => {
    if (!agreed || !user || !firestore) return;
    setIsReserving(true);
    try {
      const newRef = doc(collection(firestore, "bookings"));
      await runTransaction(firestore, async (transaction) => {
        transaction.set(newRef, { officeId, userId: user.uid, userName: user.displayName || user.email, workspaceId: room.id, workspaceName: room.name, workspaceType: 'room', date: format(date, "yyyy-MM-dd"), startTime: Timestamp.fromDate(startDT), endTime: Timestamp.fromDate(endDT), status: 'pending', paymentStatus: 'pending', createdAt: serverTimestamp() });
      });
      const res = await fetch("/api/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ totalAmount: totalCost, bookingId: newRef.id, officeId }) });
      const order = await res.json();
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        order_id: order.id,
        name: "9to5 Workspace",
        handler: async (response: any) => {
          await fetch('/api/verify-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...response, bookingId: newRef.id, amount: order.amount }) });
          toast({ title: "Room Reserved!" }); onBooked(); onOpenChange(false); setIsReserving(false);
        },
        modal: { ondismiss: () => setIsReserving(false) }
      });
      rzp.open();
    } catch (e: any) { setIsReserving(false); }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Reserve {room.name}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start</Label><Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
            <div className="space-y-2"><Label>End</Label><Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
          </div>
          <Card className="bg-muted/50 p-4 text-sm font-bold flex justify-between"><span>Estimate:</span><span>₹{totalCost.toFixed(2)}</span></Card>
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox id="terms-room" checked={agreed} onCheckedChange={checked => setAgreed(checked as boolean)} />
            <label htmlFor="terms-room" className="text-xs text-muted-foreground">I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link>.</label>
          </div>
        </div>
        <DialogFooter><Button onClick={handleBook} disabled={isReserving || !validation.valid || !agreed}>Confirm & Pay</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * MAIN COMPONENT
 */
export default function InteractiveBooking(props: any) {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [workstationDetails, setWorkstationDetails] = useState<string | null>(null);
  const router = useRouter();
  const config = officeConfig[props.officeId] || [];

  const handleSelect = (type: 'room' | 'ws', data: any) => {
    if (!props.user) return router.push(`/login?redirect_uri=/seat-booking?office=${props.officeId}`);
    if (type === 'room') setRoomDetails(data); else setWorkstationDetails(data);
  };

  const renderContent = () => {
    if (!selectedCategory) return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <Armchair className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Select a category above to view available spaces.</p>
      </div>
    );
    const cat = config.find(c => c.category === selectedCategory);
    if (!cat) return null;

    if (cat.resourceIds) return (
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 pt-4">
        {cat.resourceIds.map((id: string) => (
          <div key={id} className="flex flex-col items-center">
            <Button variant="outline" className="w-full" onClick={() => handleSelect('ws', id)}>{id.split("-").pop()}</Button>
            <OccupancyBar bookings={props.bookings.filter((b: any) => b.workspaceId === id)} isAdminBlocked={props.adminBlocks.some((b: any) => b.workspaceId === id)} />
          </div>
        ))}
      </div>
    );

    const room = allResources.find(r => r.id === cat.roomId);
    if (!room) return null;
    return (
      <Card className="mt-4">
        <CardHeader><CardTitle>{room.name}</CardTitle></CardHeader>
        <CardContent>
          <Button onClick={() => handleSelect('room', { room, extraChairs: 0 })}>Select Time for {room.name}</Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {config.map((item: any) => (
          <Button key={item.category} variant={selectedCategory === item.category ? "default" : "outline"} onClick={() => setSelectedCategory(item.category)}>{item.label}</Button>
        ))}
      </div>
      <div className="mt-4">{renderContent()}</div>
      {workstationDetails && props.date && <WorkstationBookingDialog officeId={props.officeId} workstationId={workstationDetails} date={props.date} user={props.user} bookings={props.bookings} onOpenChange={(open: any) => !open && setWorkstationDetails(null)} onBooked={() => { setWorkstationDetails(null); props.onBooking(); }} />}
      {roomDetails && props.date && <RoomBookingDialog officeId={props.officeId} room={roomDetails.room} date={props.date} extraChairs={roomDetails.extraChairs} user={props.user} bookings={props.bookings} onOpenChange={(open: any) => !open && setRoomDetails(null)} onBooked={() => { setRoomDetails(null); props.onBooking(); }} />}
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
