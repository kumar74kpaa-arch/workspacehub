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
import { Loader2, Armchair, CheckCircle2, MapPin, Phone, Download, Home, ExternalLink, AlertCircle } from "lucide-react";
import { allResources } from "@/lib/resources";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

/** * --- UTILITIES --- */
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
    const earlyMs = Math.max(0, Math.min(end.getTime(), stdStart.getTime()) - start.getTime());
    const lateMs = Math.max(0, end.getTime() - Math.max(start.getTime(), stdEnd.getTime()));
    const extendedHrs = (earlyMs + lateMs) / (1000 * 60 * 60);
    const extendedCharge = extendedHrs * 200;
    let baseCharge = 0;
    let label = "Hourly Rate";
    if (type === 'ws') {
        const hourly = totalDuration * 350;
        if (1000 < hourly && totalDuration > 2.8) { baseCharge = 1000; label = "Day Pass"; }
        else { baseCharge = hourly; }
    } else {
        const roomRate = isConference ? 1000 : 750;
        baseCharge = (roomRate * totalDuration) + (extraChairs * 100 * totalDuration);
        label = isConference ? "Conference Room" : "Meeting Room";
    }
    return { total: baseCharge + extendedCharge, base: baseCharge, extended: extendedCharge, extendedHrs, label };
};

/** * --- SUCCESS MODAL (WITH MAPS & SUPPORT CONTACT) --- */
function SuccessModal({ isOpen, onClose, officeId }: { isOpen: boolean, onClose: () => void, officeId: string }) {
    const officeDetails = {
        banyan: {
            name: "The Banyan - 9to5 Workspace",
            address: "Plot No. 123, Banyan Tree Lane, Sector 44, Gurgaon",
            mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.282214157771!2d77.23480397409114!3d28.56128708731501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce24db49350f1%3A0x954fda3635e87a4e!2sMiglanis%20%26%20Associates%20Private%20Limited!5e0!3m2!1sen!2sin!4v1772124355967!5m2!1sen!2sin",
            directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=The+Banyan+Gurgaon"
        },
        olive: {
            name: "The Olive - 9to5 Workspace",
            address: "Suite 405, Olive Greens Building, Golf Course Road, Gurgaon",
            mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2100632314828!2d77.23507307409116!3d28.563454187216863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce24b1555553f%3A0x23fd1fc914616587!2sDevelopment%20Solutions!5e0!3m2!1sen!2sin!4v1772124328821!5m2!1sen!2sin",
            directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=The+Olive+Gurgaon"
        }
    }[officeId as 'banyan' | 'olive'] || { name: "Workspace", address: "Check your email for location", mapIframe: "", directionsUrl: "#" };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden border-none shadow-2xl">
                {/* Header Section */}
                <div className="bg-green-600 p-6 text-center text-white">
                    <div className="flex justify-center mb-2">
                        <CheckCircle2 className="h-12 w-12 text-white animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold">Payment Successful!</h2>
                    <p className="text-green-100 text-sm">Your space is reserved and confirmation is being sent.</p>
                </div>

                {/* Main Content */}
                <div className="p-6 grid md:grid-cols-2 gap-6 bg-white">
                    <div className="space-y-5">
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex gap-3">
                            <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-orange-900">Facing any issue or Something went wrong?</p>
                                <p className="text-xs text-orange-800 mt-1">
                                    Please call <span className="font-bold underline">Ms. Jyoti: +91-8800337608</span> for immediate assistance!
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-tighter">Booked Space</Label>
                            <p className="font-bold text-xl text-[#C8A24D]">{officeDetails.name}</p>
                            <p className="text-sm text-muted-foreground">{officeDetails.address}</p>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                           <Button asChild className="w-full bg-[#C8A24D] hover:bg-[#b38f40]">
                               <a href={officeDetails.directionsUrl} target="_blank">
                                   <MapPin className="mr-2 h-4 w-4" /> Get Directions
                               </a>
                           </Button>
                           <Button variant="outline" className="w-full" onClick={() => window.print()}>
                               <Download className="mr-2 h-4 w-4" /> Save Receipt
                           </Button>
                        </div>
                    </div>

                    {/* Dynamic Map Iframe */}
                    <div className="rounded-xl overflow-hidden border bg-muted h-[250px] md:h-full min-h-[200px]">
                        <iframe 
                            src={officeDetails.mapIframe} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                        />
                    </div>
                </div>

                <DialogFooter className="bg-gray-50 p-4 flex sm:justify-center">
                    <Button variant="ghost" className="text-muted-foreground text-xs" onClick={onClose}>
                        Close and return to Dashboard
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** * --- UI SUB-COMPONENTS --- */
function OccupancyBar({ bookings, isAdminBlocked }: { bookings: Booking[], isAdminBlocked?: boolean }) {
  const DAY_START = 8 * 60; const DAY_TOTAL = 12 * 60;
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

function WorkstationSelector({ wsIds, bookings, adminBlocks, onSelect }: any) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 pt-4">
        {wsIds.map((id: string) => {
          const sBookings = bookings.filter((b: any) => b.workspaceId === id && b.status === "confirmed");
          const blocked = adminBlocks.some((b: any) => b.workspaceId === id);
          const mins = calculateTotalBookedMinutes(sBookings);
          const isFull = mins >= 720 || blocked;
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
      <Card className="mt-4 border-2">
        <CardHeader className="pb-2 bg-muted/20">
            <CardTitle className="flex justify-between items-center text-lg">{room.name} <Badge variant="outline">Seats: {baseCapacity}-{totalCapacity}</Badge></CardTitle>
            <OccupancyBar bookings={sBookings} isAdminBlocked={blocked} />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: totalCapacity }).map((_, i) => {
              const isExtra = i >= baseCapacity;
              const isSelected = isExtra && (i - baseCapacity < extra);
              return (
                <Button key={i} variant="outline" size="icon" disabled={!isExtra || blocked}
                  className={cn("h-10 w-10", isSelected ? "bg-[#C8A24D] text-white border-[#C8A24D]" : !isExtra ? "bg-gray-100 opacity-50" : "")}
                  onClick={() => setExtra(i - baseCapacity + 1)}><Armchair className="h-5 w-5" /></Button>
              );
            })}
          </div>
          <Button className="w-full bg-[#C8A24D] hover:bg-[#b38f40]" onClick={() => onSelect(room, extra)} disabled={blocked}>
            Select Booking Time (+{extra} extra chairs)
          </Button>
        </CardContent>
      </Card>
    );
}

/** * --- BOOKING DIALOG --- */
function FinalBookingDialog({ officeId, resource, date, type, extraChairs, onOpenChange, onBooked, user }: any) {
    const [times, setTimes] = useState({ start: "09:30", end: "17:30" });
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const startDT = parse(times.start, "HH:mm", date);
    const endDT = parse(times.end, "HH:mm", date);
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
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                order_id: order.id,
                name: "9to5 Workspace",
                description: "Workspace Booking",
                prefill: {
                    name: user.displayName || "",
                    email: user.email || "",
                    contact: user.phoneNumber || "",
                },
                theme: { color: "#C8A24D" },
                handler: async (resp: any) => {
                    await fetch('/api/verify-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...resp, bookingId: newRef.id }) });
                    setShowSuccess(true); // TRIGGER THE BIG DETAILED SUCCESS POPUP
                    onBooked(); 
                }
            });
            rzp.open();
        } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); } 
        finally { setLoading(false); }
    };

    if (showSuccess) {
        return <SuccessModal isOpen={showSuccess} onClose={() => { setShowSuccess(false); onOpenChange(false); router.push('/dashboard'); }} officeId={officeId} />;
    }

    return (
        <Dialog open onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Finalize Booking</DialogTitle><DialogDescription>Operating hours: 8:00 AM - 8:00 PM</DialogDescription></DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1"><Label>From</Label><Input type="time" value={times.start} onChange={e => setTimes({...times, start: e.target.value})} /></div>
                        <div className="space-y-1"><Label>To</Label><Input type="time" value={times.end} onChange={e => setTimes({...times, end: e.target.value})} /></div>
                    </div>
                    <Card className="bg-muted/50 p-4 border-none">
                        <div className="flex justify-between text-sm mb-1"><span>{p.label}:</span><span>₹{p.base.toFixed(2)}</span></div>
                        {p.extendedHrs > 0 && <div className="flex justify-between text-xs text-orange-600 font-bold mb-2"><span>Extended ({p.extendedHrs.toFixed(1)}h):</span><span>₹{p.extended.toFixed(2)}</span></div>}
                        <div className="border-t pt-2 flex justify-between items-baseline"><span className="font-bold text-lg">Total Payable:</span><span className="font-bold text-lg text-[#C8A24D]">₹{p.total.toFixed(2)}</span></div>
                    </Card>
                    <div className="flex items-start space-x-2">
                        <Checkbox id="terms" checked={agreed} onCheckedChange={c => setAgreed(c as boolean)} />
                        <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight">I agree to the <Link href="/terms-and-conditions" target="_blank" className="text-[#C8A24D] underline">Terms & Conditions</Link>.</label>
                    </div>
                </div>
                <DialogFooter><Button className="w-full bg-[#C8A24D]" disabled={loading || !agreed} onClick={handlePay}>{loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm & Pay"}</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** * --- MAIN COMPONENT --- */
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
                {config.map((i: any) => <Button key={i.label} variant={cat === i.label ? "default" : "outline"} onClick={() => setCat(i.label)} className={cn(cat === i.label && "bg-[#C8A24D] hover:bg-[#b38f40]")}>{i.label}</Button>)}
            </div>
            <div className="mt-4">
                {!cat ? <div className="text-center py-20 opacity-20"><Armchair className="mx-auto h-16 w-16 mb-2" /><p className="font-medium">Please select a workspace category</p></div> :
                 cat === "Workstation" ? <WorkstationSelector wsIds={config.find(c => c.label === cat).resourceIds} bookings={props.bookings} adminBlocks={props.adminBlocks} onSelect={(id: any) => onSelect('ws', id)} /> :
                 <RoomSelector {...config.find(c => c.label === cat)} bookings={props.bookings} adminBlocks={props.adminBlocks} onSelect={(r: any, e: any) => onSelect('room', r, e)} />}
            </div>
            {active && <FinalBookingDialog {...props} type={active.type} resource={active.data} extraChairs={active.extra} onOpenChange={() => setActive(null)} onBooked={props.onBooking} />}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        </div>
    );
}
