"use client";
import { useState } from "react";
import Script from "next/script";
import type { User } from "firebase/auth";
import { collection, Timestamp, runTransaction, query, where, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { format, parse, isBefore, isAfter, setHours, setMinutes } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Booking, Workspace } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Armchair, Clock, AlertTriangle } from "lucide-react";
import { allResources } from "@/lib/resources";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

/** * --- UTILITIES & CALCULATIONS --- 
 */
const calculateTotalBookedMinutes = (bookings: Booking[]): number => {
    if (!bookings || bookings.length === 0) return 0;
    const sorted = [...bookings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    const merged = [JSON.parse(JSON.stringify(sorted[0]))];
    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        const last = merged[merged.length - 1];
        if (new Date(current.startTime) < new Date(last.endTime)) {
            last.endTime = new Date(Math.max(new Date(last.endTime).getTime(), new Date(current.endTime).getTime()));
        } else {
            merged.push(JSON.parse(JSON.stringify(current)));
        }
    }
    return merged.reduce((acc, b) => acc + (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()), 0) / (1000 * 60);
};

const getPricingBreakdown = (start: Date, end: Date, type: 'ws' | 'room', extraChairs = 0, isConference = false) => {
    const totalDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (totalDuration <= 0) return { total: 0, base: 0, extended: 0, extendedHrs: 0 };

    const stdStart = setMinutes(setHours(new Date(start), 9), 30);
    const stdEnd = setMinutes(setHours(new Date(start), 17), 30);

    // Calculate Extended Hours: 8:00-9:30 and 17:30-20:00
    const earlyMs = Math.max(0, Math.min(end.getTime(), stdStart.getTime()) - start.getTime());
    const lateMs = Math.max(0, end.getTime() - Math.max(start.getTime(), stdEnd.getTime()));
    const extendedHrs = (earlyMs + lateMs) / (1000 * 60 * 60);
    const extendedCharge = extendedHrs * 200;

    let baseCharge = 0;
    let label = "Hourly Rate";

    if (type === 'ws') {
        const hourly = totalDuration * 350;
        if (1000 < hourly && totalDuration > 2.8) {
            baseCharge = 1000;
            label = "Day Pass";
        } else {
            baseCharge = hourly;
        }
    } else {
        const roomRate = isConference ? 1000 : 750;
        baseCharge = (roomRate * totalDuration) + (extraChairs * 100 * totalDuration);
        label = isConference ? "Conference Room" : "Meeting Room";
    }

    return { total: baseCharge + extendedCharge, base: baseCharge, extended: extendedCharge, extendedHrs, label };
};

function OccupancyBar({ bookings, isAdminBlocked }: { bookings: Booking[], isAdminBlocked?: boolean }) {
  const DAY_START = 8 * 60; // 8 AM
  const DAY_TOTAL = 12 * 60; // 12 hours total
  if (isAdminBlocked) return <div className="w-full h-1.5 bg-red-500 rounded-full mt-1" />;
  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1 relative">
      {bookings.map((b, i) => {
        const left = ((b.startTime.getHours() * 60 + b.startTime.getMinutes() - DAY_START) / DAY_TOTAL) * 100;
        const width = ((b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60 * DAY_TOTAL)) * 100;
        return <div key={i} className="h-full bg-red-500 absolute" style={{ left: `${Math.max(0, left)}%`, width: `${width}%` }} />;
      })}
    </div>
  );
}

/** * --- SELECTION UI COMPONENTS --- 
 */
function WorkstationSelector({ wsIds, bookings, adminBlocks, onSelect }: any) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-4">
        {wsIds.map((id: string) => {
          const sBookings = bookings.filter((b: any) => b.workspaceId === id && b.status === "confirmed");
          const blocked = adminBlocks.some((b: any) => b.workspaceId === id);
          const mins = calculateTotalBookedMinutes(sBookings);
          const isFull = mins >= 720 || blocked; // 12 hours
          return (
            <div key={id} className="flex flex-col items-center">
              <Button variant="outline" onClick={() => onSelect(id)} disabled={isFull}
                className={cn("w-full font-bold", isFull ? "bg-red-100 text-red-700" : mins > 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700")}>
                {id.split("-").pop()}
              </Button>
              <OccupancyBar bookings={sBookings} isAdminBlocked={blocked} />
            </div>
          );
        })}
      </div>
    );
}

function RoomSelector({ roomId, baseCapacity, totalCapacity, onSelect, bookings, adminBlocks }: any) {
    const [extra, setExtra] = useState(0);
    const room = allResources.find(r => r.id === roomId);
    const sBookings = bookings.filter((b: any) => b.workspaceId === roomId && b.status === "confirmed");
    const blocked = adminBlocks.some((b: any) => b.workspaceId === roomId);

    if (!room) return null;
    return (
      <Card className="mt-4">
        <CardHeader className="pb-2"><CardTitle>{room.name}</CardTitle><OccupancyBar bookings={sBookings} isAdminBlocked={blocked} /></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: totalCapacity }).map((_, i) => {
              const isExtra = i >= baseCapacity;
              const isSelected = isExtra && (i - baseCapacity < extra);
              return (
                <Button key={i} variant="outline" size="icon" disabled={!isExtra || blocked}
                  className={cn("h-10 w-10", isSelected ? "bg-[#C8A24D] text-white" : !isExtra ? "bg-gray-100 opacity-50" : "")}
                  onClick={() => setExtra(i - baseCapacity + 1)}><Armchair className="h-5 w-5" /></Button>
              );
            })}
          </div>
          <Button className="bg-[#C8A24D] hover:bg-[#b38f40]" onClick={() => onSelect(room, extra)} disabled={blocked}>
            Select Time (+{extra} extra seats)
          </Button>
        </CardContent>
      </Card>
    );
}

/** * --- BOOKING DIALOGS --- 
 */
function FinalBookingDialog({ officeId, resource, date, type, extraChairs, onOpenChange, onBooked, user }: any) {
    const [times, setTimes] = useState({ start: "09:30", end: "17:30" });
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const startDT = parse(times.start, "HH:mm", date);
    const endDT = parse(times.end, "HH:mm", date);
    
    // Validation: 8 AM to 8 PM
    const limitStart = setHours(new Date(date), 8);
    const limitEnd = setHours(new Date(date), 20);
    const isInvalidTime = isBefore(startDT, limitStart) || isAfter(endDT, limitEnd) || isBefore(endDT, startDT);

    const p = getPricingBreakdown(startDT, endDT, type, extraChairs, resource?.name?.toLowerCase().includes('conference'));

    const handlePay = async () => {
        if (!agreed || !firestore || !user) return;
        setLoading(true);
        try {
            const newRef = doc(collection(firestore, "bookings"));
            await runTransaction(firestore, async (tx) => {
                tx.set(newRef, { officeId, userId: user.uid, userName: user.displayName || user.email, workspaceId: resource.id || resource, workspaceName: resource.name || `Workstation ${resource.split('-').pop()}`, workspaceType: type === 'ws' ? 'desk' : 'room', date: format(date, "yyyy-MM-dd"), startTime: Timestamp.fromDate(startDT), endTime: Timestamp.fromDate(endDT), status: 'pending', paymentStatus: 'pending', createdAt: serverTimestamp() });
            });
            const res = await fetch("/api/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ totalAmount: p.total, bookingId: newRef.id, officeId }) });
            const order = await res.json();
            const rzp = new (window as any).Razorpay({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, amount: order.amount, order_id: order.id, name: "9to5 Workspace",
                handler: async (resp: any) => {
                    await fetch('/api/verify-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...resp, bookingId: newRef.id }) });
                    onBooked(); onOpenChange(false); toast({ title: "Booking Confirmed!" });
                }
            });
            rzp.open();
        } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } finally { setLoading(false); }
    };

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Finalize Booking</DialogTitle><DialogDescription>Operating hours: 8:00 AM - 8:00 PM</DialogDescription></DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label>From</Label><Input type="time" value={times.start} onChange={e => setTimes({...times, start: e.target.value})} /></div>
                        <div className="space-y-1"><Label>To</Label><Input type="time" value={times.end} onChange={e => setTimes({...times, end: e.target.value})} /></div>
                    </div>
                    {isInvalidTime && <p className="text-red-500 text-xs font-bold">Please select time between 08:00 and 20:00.</p>}
                    <Card className="bg-muted/50 p-4 text-sm space-y-2">
                        <div className="flex justify-between"><span>{p.label}:</span><span>₹{p.base.toFixed(2)}</span></div>
                        {p.extendedHrs > 0 && <div className="flex justify-between text-orange-600 font-bold"><span>Extended (Early/Late):</span><span>₹{p.extended.toFixed(2)}</span></div>}
                        <div className="border-t pt-2 flex justify-between items-baseline">
                            <span className="font-bold text-lg">Total Price:</span><span className="font-bold text-lg">₹{p.total.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] text-right italic text-muted-foreground">Inclusive of all taxes</p>
                    </Card>
                    <div className="flex items-start space-x-2 pt-2">
                        <Checkbox id="terms" checked={agreed} onCheckedChange={c => setAgreed(c as boolean)} />
                        <label htmlFor="terms" className="text-xs text-muted-foreground">I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link>.</label>
                    </div>
                </div>
                <DialogFooter><Button className="w-full bg-[#C8A24D]" disabled={loading || !agreed || isInvalidTime} onClick={handlePay}>Confirm & Pay</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** * --- MAIN INTERACTIVE COMPONENT --- 
 */
export default function InteractiveBooking(props: any) {
    const [cat, setCat] = useState<any>(null);
    const [active, setActive] = useState<any>(null);
    const router = useRouter();
    const config = {
        banyan: [
            { label: "Workstation", category: "ws", resourceIds: Array.from({ length: 12 }, (_, i) => `BANYAN-WS-${String(i+1).padStart(2,"0")}`) },
            { label: "Meeting Room", category: "mr", roomId: "BANYAN-MR-06", baseCapacity: 4, totalCapacity: 6 },
            { label: "Conference Room", category: "cr", roomId: "BANYAN-MR-12", baseCapacity: 9, totalCapacity: 12 },
        ],
        olive: [
            { label: "Workstation", category: "ws", resourceIds: Array.from({ length: 16 }, (_, i) => `OLIVE-WS-${String(i+1).padStart(2,"0")}`) },
            { label: "Conference Room", category: "cr", roomId: "OLIVE-MR-12", baseCapacity: 9, totalCapacity: 12 },
        ]
    }[props.officeId] || [];

    const onSelect = (type: string, data: any, extra = 0) => {
        if (!props.user) return router.push(`/login?redirect_uri=/seat-booking?office=${props.officeId}`);
        setActive({ type, data, extra });
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap gap-2 border-b pb-4">
                {config.map((i: any) => <Button key={i.label} variant={cat === i.label ? "default" : "outline"} onClick={() => setCat(i.label)}>{i.label}</Button>)}
            </div>
            <div className="mt-4">
                {!cat ? <div className="text-center py-10 opacity-30"><Armchair className="mx-auto h-12 w-12" /><p>Select a category</p></div> :
                 cat === "Workstation" ? <WorkstationSelector wsIds={config.find(c => c.label === cat).resourceIds} bookings={props.bookings} adminBlocks={props.adminBlocks} onSelect={(id: any) => onSelect('ws', id)} /> :
                 <RoomSelector {...config.find(c => c.label === cat)} bookings={props.bookings} adminBlocks={props.adminBlocks} onSelect={(r: any, e: any) => onSelect('room', r, e)} />}
            </div>
            {active && <FinalBookingDialog {...props} type={active.type} resource={active.data} extraChairs={active.extra} onOpenChange={() => setActive(null)} onBooked={props.onBooking} />}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
}
