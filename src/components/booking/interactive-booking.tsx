"use client";
import { useState } from "react";
import Script from "next/script";
import { collection, Timestamp, runTransaction, query, where, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";

import type { Booking, Workspace } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Armchair } from "lucide-react";
import { allResources } from "@/lib/resources";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { validateBookingTime } from "@/lib/validateBookingTime";
import { Checkbox } from "@/components/ui/checkbox";

/** * --- UTILITIES --- 
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

function OccupancyBar({ bookings, isAdminBlocked }: { bookings: Booking[], isAdminBlocked?: boolean }) {
  const DAY_START_MINS = 9 * 60 + 30; 
  const DAY_TOTAL_MINS = 8 * 60; 
  if (isAdminBlocked) return <div className="w-full h-1.5 bg-red-500 rounded-full mt-1" />;
  return (
    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1 relative">
      {bookings.map((b, i) => {
        const left = Math.max(0, (((b.startTime.getHours() * 60 + b.startTime.getMinutes()) - DAY_START_MINS) / DAY_TOTAL_MINS) * 100);
        const width = Math.min(100, ((b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60 * DAY_TOTAL_MINS)) * 100);
        return <div key={i} className="h-full bg-red-500 absolute" style={{ left: `${left}%`, width: `${width}%` }} />;
      })}
    </div>
  );
}

/** * --- PRICING LOGIC --- 
 */
const getPricingDetails = (startTime: Date, endTime: Date, type: 'ws' | 'room', extraChairs = 0, isConference = false) => {
    const durationHrs = Math.max(0, (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    const dayEndNormal = new Date(startTime);
    dayEndNormal.setHours(17, 30, 0, 0);
    
    const extendedHrs = Math.max(0, (endTime.getTime() - Math.max(startTime.getTime(), dayEndNormal.getTime())) / (1000 * 60 * 60));
    
    let baseAmount = 0;
    let extendedAmount = 0;
    let label = "";

    if (type === 'ws') {
        const hourly = durationHrs * 350;
        const dayPass = 1000;
        if (dayPass < hourly && durationHrs > 2.8) {
            baseAmount = dayPass;
            label = "Day Pass";
        } else {
            baseAmount = hourly;
            label = "Hourly Rate";
        }
        extendedAmount = extendedHrs * 200;
    } else {
        const roomBase = isConference ? 1000 : 750;
        baseAmount = (roomBase * durationHrs) + (extraChairs * 100 * durationHrs);
        label = isConference ? "Conference Room" : "Meeting Room";
        extendedAmount = 0; // Standard room rates usually flat/hr, but added for logic consistency
    }

    return {
        baseAmount,
        extendedHrs,
        extendedAmount,
        total: baseAmount + extendedAmount,
        label
    };
};

/** * --- SELECTION COMPONENTS --- 
 */
function WorkstationSelector({ wsIds, bookings, adminBlocks, onSelect }: any) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 pt-4">
        {wsIds.map((id: string) => {
          const seatBookings = bookings.filter((b: any) => b.workspaceId === id && b.status === "confirmed");
          const blocked = adminBlocks.some((b: any) => b.workspaceId === id);
          const bookedMins = calculateTotalBookedMinutes(seatBookings);
          const isFull = bookedMins >= 480 || blocked;
          const isPartial = bookedMins > 0;
  
          return (
            <div key={id} className="flex flex-col items-center">
              <Button 
                variant="outline" 
                onClick={() => onSelect(id)} 
                disabled={isFull}
                className={cn(
                    "w-full h-10 font-bold border-2",
                    isFull ? "bg-red-50 border-red-200 text-red-700" : 
                    isPartial ? "bg-orange-50 border-orange-200 text-orange-700" : 
                    "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                )}
              >
                {id.split("-").pop()}
              </Button>
              <div className="w-full px-1"><OccupancyBar bookings={seatBookings} isAdminBlocked={blocked} /></div>
            </div>
          );
        })}
      </div>
    );
}

function RoomSelector({ roomId, baseCapacity, totalCapacity, onSelect, bookings, adminBlocks }: any) {
    const [extra, setExtra] = useState(0);
    const room = allResources.find(r => r.id === roomId);
    const seatBookings = bookings.filter((b: any) => b.workspaceId === roomId && b.status === "confirmed");
    const isBlocked = adminBlocks.some((b: any) => b.workspaceId === roomId) || calculateTotalBookedMinutes(seatBookings) >= 480;
  
    if (!room) return null;
  
    return (
      <Card className={cn("mt-4 overflow-hidden", isBlocked && "opacity-60")}>
        <CardHeader className="bg-muted/30 pb-4">
          <CardTitle className="flex justify-between items-center">
            {room.name}
            <span className="text-xs font-normal px-2 py-1 bg-white rounded border">
                Cap: {baseCapacity} + {totalCapacity - baseCapacity} extra
            </span>
          </CardTitle>
          <OccupancyBar bookings={seatBookings} isAdminBlocked={isBlocked} />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 mb-6 justify-center sm:justify-start">
            {Array.from({ length: totalCapacity }).map((_, i) => {
              const isExtra = i >= baseCapacity;
              const isSelected = isExtra && (i - baseCapacity < extra);
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        disabled={isBlocked}
                        className={cn(
                            "h-12 w-12 transition-all",
                            !isExtra ? "bg-gray-100 cursor-default border-gray-300" : 
                            isSelected ? "bg-[#C8A24D] text-white border-[#C8A24D]" : "hover:border-[#C8A24D]"
                        )}
                        onClick={() => isExtra && setExtra(i - baseCapacity + 1)}
                    >
                        <Armchair className={cn("h-6 w-6", !isExtra ? "text-gray-400" : "")} />
                    </Button>
                    <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                </div>
              );
            })}
          </div>
          <Button 
            className="w-full sm:w-auto bg-[#C8A24D] hover:bg-[#b38f40]"
            onClick={() => onSelect(room, extra)} 
            disabled={isBlocked}
          >
            {isBlocked ? "Fully Booked" : `Book with ${extra} extra chairs`}
          </Button>
        </CardContent>
      </Card>
    );
}

/** * --- BOOKING DIALOGS --- 
 */
function BookingSummary({ startTime, endTime, type, extraChairs, isConference }: any) {
    const p = getPricingDetails(startTime, endTime, type, extraChairs, isConference);
    return (
        <Card className="bg-muted/50 p-4 space-y-2 text-sm border-dashed">
            <div className="flex justify-between">
                <span>{p.label}:</span>
                <span>₹{p.baseAmount.toFixed(2)}</span>
            </div>
            {p.extendedHrs > 0 && (
                <div className="flex justify-between text-orange-600 font-medium">
                    <span>Extended Hours ({p.extendedHrs.toFixed(1)} hrs):</span>
                    <span>₹{p.extendedAmount.toFixed(2)}</span>
                </div>
            )}
            <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-baseline">
                    <span className="font-bold text-lg">Total Price:</span>
                    <span className="font-bold text-lg">₹{p.total.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-right italic">Inclusive of all taxes</p>
            </div>
        </Card>
    );
}

function WorkstationBookingDialog({ officeId, workstationId, date, onOpenChange, onBooked, user }: any) {
    const [times, setTimes] = useState({ start: "09:30", end: "17:30" });
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const startDT = parse(times.start, "HH:mm", date);
    const endDT = parse(times.end, "HH:mm", date);
    const validation = validateBookingTime(startDT, endDT);

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Booking Workstation {workstationId.split('-').pop()}</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label>From</Label><Input type="time" value={times.start} onChange={e => setTimes({...times, start: e.target.value})} /></div>
                        <div className="space-y-1"><Label>To</Label><Input type="time" value={times.end} onChange={e => setTimes({...times, end: e.target.value})} /></div>
                    </div>
                    <BookingSummary startTime={startDT} endTime={endDT} type="ws" />
                    <div className="flex items-start space-x-2 pt-2">
                        <Checkbox id="terms-ws" checked={agreed} onCheckedChange={c => setAgreed(c as boolean)} />
                        <label htmlFor="terms-ws" className="text-xs text-muted-foreground leading-tight">
                            I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link> for this booking.
                        </label>
                    </div>
                </div>
                <DialogFooter>
                    <Button className="w-full" disabled={loading || !agreed || !validation.valid} onClick={() => {}}>Confirm & Pay</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function RoomBookingDialog({ officeId, room, date, extraChairs, onOpenChange, onBooked }: any) {
    const [times, setTimes] = useState({ start: "09:30", end: "10:30" });
    const [agreed, setAgreed] = useState(false);
    const startDT = parse(times.start, "HH:mm", date);
    const endDT = parse(times.end, "HH:mm", date);

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Booking {room.name}</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label>From</Label><Input type="time" value={times.start} onChange={e => setTimes({...times, start: e.target.value})} /></div>
                        <div className="space-y-1"><Label>To</Label><Input type="time" value={times.end} onChange={e => setTimes({...times, end: e.target.value})} /></div>
                    </div>
                    <BookingSummary startTime={startDT} endTime={endDT} type="room" extraChairs={extraChairs} isConference={room.name.toLowerCase().includes('conference')} />
                    <div className="flex items-start space-x-2 pt-2">
                        <Checkbox id="terms-room" checked={agreed} onCheckedChange={c => setAgreed(c as boolean)} />
                        <label htmlFor="terms-room" className="text-xs text-muted-foreground leading-tight">
                            I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link>.
                        </label>
                    </div>
                </div>
                <DialogFooter><Button className="w-full" disabled={!agreed} onClick={() => {}}>Confirm & Pay</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** * --- OFFICE CONFIG --- 
 */
const officeConfig: Record<string, any[]> = {
    banyan: [
      { label: "Workstation", category: "workstation", resourceIds: Array.from({ length: 12 }, (_, i) => `BANYAN-WS-${String(i + 1).padStart(2, "0")}`) },
      { label: "Meeting Room", category: "meeting-room", roomId: "BANYAN-MR-06", baseCapacity: 4, totalCapacity: 6 },
      { label: "Conference Room", category: "conference-room", roomId: "BANYAN-MR-12", baseCapacity: 9, totalCapacity: 12 },
    ],
    olive: [
      { label: "Workstation", category: "workstation", resourceIds: Array.from({ length: 16 }, (_, i) => `OLIVE-WS-${String(i + 1).padStart(2, "0")}`) },
      { label: "Conference Room", category: "conference-room", roomId: "OLIVE-MR-12", baseCapacity: 9, totalCapacity: 12 },
    ],
};

/** * --- MAIN --- 
 */
export default function InteractiveBooking(props: any) {
  const [category, setCategory] = useState<any>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [wsData, setWsData] = useState<string | null>(null);
  const router = useRouter();
  const config = officeConfig[props.officeId] || [];

  const handleAction = (type: string, data: any) => {
    if (!props.user) return router.push(`/login?redirect_uri=/seat-booking?office=${props.officeId}`);
    if (type === 'room') setRoomData(data); else setWsData(data);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {config.map((item: any) => (
          <Button key={item.category} variant={category === item.category ? "default" : "outline"} onClick={() => setCategory(item.category)}>{item.label}</Button>
        ))}
      </div>

      <div className="mt-4">
        {!category ? (
           <div className="text-center py-12 border-2 border-dashed rounded-lg">
               <Armchair className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
               <p className="text-muted-foreground">Please select a space category above.</p>
           </div>
        ) : category === "workstation" ? (
          <WorkstationSelector wsIds={config.find((c: any) => c.category === "workstation").resourceIds} bookings={props.bookings} adminBlocks={props.adminBlocks} onSelect={(id: string) => handleAction('ws', id)} />
        ) : (
          <RoomSelector {...config.find((c: any) => c.category === category)} bookings={props.bookings} adminBlocks={props.adminBlocks} onSelect={(room: any, ex: number) => handleAction('room', { room, extraChairs: ex })} />
        )}
      </div>

      {wsData && props.date && <WorkstationBookingDialog officeId={props.officeId} workstationId={wsData} date={props.date} user={props.user} onOpenChange={() => setWsData(null)} onBooked={props.onBooking} />}
      {roomData && props.date && <RoomBookingDialog officeId={props.officeId} room={roomData.room} extraChairs={roomData.extraChairs} date={props.date} onOpenChange={() => setRoomData(null)} onBooked={props.onBooking} />}
      <Script id="rzp" src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
}
