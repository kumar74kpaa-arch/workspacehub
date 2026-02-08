'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parse, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Loader2, Users, Armchair, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import type { Booking, Workspace } from '@/lib/definitions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { hasBookingConflict } from '@/lib/checkBookingConflict';
import { Badge } from '@/components/ui/badge';
import { validateBookingTime } from '@/lib/validateBookingTime';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { officeLayouts } from '@/lib/officeLayouts';
import type { SeatHotspot } from '@/lib/officeLayouts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { offices } from '@/lib/offices';
import { allResources } from '@/lib/resources';


function MeetingRoomDialog({ officeId, room, date, onOpenChange, onBooked }: { officeId: string, room: Workspace, date: Date, onOpenChange: (open: boolean) => void, onBooked: () => void }) {
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('10:00');
  const [isReserving, setIsReserving] = React.useState(false);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState(validateBookingTime(parse(startTime, 'HH:mm', date), parse(endTime, 'HH:mm', date)));

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    const start = parse(startTime, 'HH:mm', date);
    const end = parse(endTime, 'HH:mm', date);
    setValidationResult(validateBookingTime(start, end));
  }, [startTime, endTime, date]);

  const handleReserveClick = async () => {
    if (!user || !firestore) {
      router.push('/login');
      return;
    }
    
    setIsReserving(true);

    const startDateTime = parse(startTime, 'HH:mm', date);
    const endDateTime = parse(endTime, 'HH:mm', date);

    const timeValidation = validateBookingTime(startDateTime, endDateTime);
    if (!timeValidation.valid) {
      toast({ variant: 'destructive', title: 'Invalid Time', description: timeValidation.reason });
      setIsReserving(false);
      return;
    }

    try {
      const conflict = await hasBookingConflict({ firestore, officeId, workspaceId: room.id, startTime: startDateTime, endTime: endDateTime });

      if (conflict) {
        toast({ variant: 'destructive', title: 'Booking Conflict', description: 'This time slot is unavailable. Please choose another time.' });
        setIsReserving(false);
        return;
      }
      
      await addDoc(collection(firestore, 'bookings'), {
        officeId,
        userId: user.uid,
        userName: user.displayName || user.email,
        workspaceId: room.id,
        workspaceName: room.name,
        workspaceType: 'room',
        date: format(date, 'yyyy-MM-dd'),
        startTime: Timestamp.fromDate(startDateTime),
        endTime: Timestamp.fromDate(endDateTime),
        isExtendedHours: timeValidation.extended,
        pricingType: timeValidation.extended ? 'extended' : 'standard',
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
          <DialogDescription>Book for {format(date, 'PPP')}. Capacity: {room.capacity} people.</DialogDescription>
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
            {validationResult.extended && (
                <Alert className="bg-yellow-50 border-yellow-300 text-yellow-900 [&>svg]:text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Extended Hours Selected</AlertTitle>
                    <AlertDescription>
                        {validationResult.message}
                    </AlertDescription>
                </Alert>
            )}
            {!validationResult.valid && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Invalid Time</AlertTitle>
                    <AlertDescription>
                        {validationResult.reason}
                    </AlertDescription>
                </Alert>
            )}
             <div className="items-top flex space-x-2 pt-2">
                <Checkbox id="terms1" onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the <Link href="/terms-and-conditions" target="_blank" className="underline text-primary">Terms & Conditions</Link>.
                    </label>
                    <p className="text-sm text-muted-foreground">
                    Booking implies agreement to all terms, including charges for extra seating and paid services.
                    </p>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={handleReserveClick} disabled={isReserving || !validationResult.valid || !agreedToTerms}>
            {isReserving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Reservation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 my-6 border-y py-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500/20" />
        <span className="text-sm text-muted-foreground">Available</span>
      </div>
       <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/20" />
        <span className="text-sm text-muted-foreground">Your Booking</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-gray-400 bg-gray-400/30" />
        <span className="text-sm text-muted-foreground">Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-300/30" />
        <span className="text-sm text-muted-foreground">Utility</span>
      </div>
    </div>
  );
}

export function OfficeLayoutBooking() {
  const [selectedOfficeId, setSelectedOfficeId] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [bookingInProgress, setBookingInProgress] = React.useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = React.useState<Workspace | null>(null);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const selectedOfficeLayout = selectedOfficeId ? officeLayouts[selectedOfficeId] : null;
  const currentResources = selectedOfficeId ? allResources.filter(r => r.officeId === selectedOfficeId) : [];

  const fetchBookings = React.useCallback(async () => {
    if (!firestore || !date || !selectedOfficeId) return;
    setIsLoading(true);
    const dateStr = format(date, 'yyyy-MM-dd');
    const q = query(
        collection(firestore, 'bookings'), 
        where('date', '==', dateStr),
        where('officeId', '==', selectedOfficeId)
    );
    try {
        const snapshot = await getDocs(q);
        const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
        setBookings(bookingsData);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch bookings.' });
    } finally {
        setIsLoading(false);
    }
  }, [date, firestore, toast, selectedOfficeId]);

  React.useEffect(() => {
    if (selectedOfficeId && date) {
        fetchBookings();
    } else {
        setBookings([]);
    }
  }, [selectedOfficeId, date, fetchBookings]);

  const getBookingForSpot = (spotId: string) => {
    return bookings.find(b => b.workspaceId === spotId);
  };
  
  const handleBookWorkstation = async (workstationId: string) => {
    if (!user || !firestore || !selectedOfficeId) {
      router.push('/login'); return;
    }
    if (!date) return;
    if (!agreedToTerms) {
        toast({ variant: "destructive", title: "Terms and Conditions", description: "You must agree to the terms and conditions to book a space." });
        return;
    }

    setBookingInProgress(workstationId);
    try {
        const dayStart = new Date(date); dayStart.setHours(9,0,0,0);
        const dayEnd = new Date(date); dayEnd.setHours(17,0,0,0);
        
        const conflict = await hasBookingConflict({
            firestore,
            officeId: selectedOfficeId,
            workspaceId: workstationId,
            startTime: dayStart,
            endTime: dayEnd
        });

        if (conflict) {
            toast({ variant: "destructive", title: "Already Booked", description: "This workstation is no longer available." });
            fetchBookings(); // Re-fetch to update UI with latest data
            setBookingInProgress(null);
            return;
        }
        
        await addDoc(collection(firestore, "bookings"), {
            officeId: selectedOfficeId,
            userId: user.uid, userName: user.displayName || user.email,
            workspaceId: workstationId, workspaceName: `Workstation ${workstationId.split('-').pop()}`, workspaceType: 'desk',
            date: format(date, 'yyyy-MM-dd'), startTime: Timestamp.fromDate(dayStart), endTime: Timestamp.fromDate(dayEnd),
            status: 'confirmed',
            isExtendedHours: false,
            pricingType: 'standard'
        });
        toast({ title: 'Workstation Booked!', description: `You have booked ${workstationId} for ${format(date, 'PPP')}.`});
        fetchBookings(); // Re-fetch to update UI
    } catch (error) {
        console.error("Error booking workstation: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not book workstation.' });
    } finally {
        setBookingInProgress(null);
    }
  };
  
  const handleSpotClick = (spot: SeatHotspot) => {
    if (spot.disabled) return;
    if (!user) { router.push('/login'); return; }
    if (!date || !selectedOfficeId) return;

    if (!agreedToTerms) {
        toast({ variant: "destructive", title: "Terms and Conditions", description: "You must agree to the terms and conditions to book a space." });
        return;
    }
    
    if (spot.type === 'workstation') {
        handleBookWorkstation(spot.id);
    } else if (spot.type === 'meeting-room') {
        const roomData = currentResources.find(r => r.id === spot.id && r.type === 'room');
        if (roomData) setSelectedRoom(roomData);
    } else if (spot.type === 'breakout') {
        toast({ title: 'Breakout Area', description: 'This area is first-come, first-served and cannot be booked.' });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserve Your Space</CardTitle>
        <CardDescription>Select an office and date, then click on an available desk or room in the layout below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex flex-col gap-2">
            <Label>Select Office</Label>
            <Select onValueChange={setSelectedOfficeId} value={selectedOfficeId || ''}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Choose an office location" />
                </SelectTrigger>
                <SelectContent>
                    {offices.map(office => (
                        <SelectItem key={office.id} value={office.id}>{office.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Select Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')} disabled={!selectedOfficeId}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(day) => { setDate(day); setCalendarOpen(false); }} initialFocus disabled={(day) => day < startOfDay(new Date())} />
              </PopoverContent>
            </Popover>
          </div>
            <div className="items-top flex space-x-2 pt-6">
                <Checkbox id="terms-main" onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} disabled={!selectedOfficeId} />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms-main" className={cn("text-sm font-medium leading-none", !selectedOfficeId ? "cursor-not-allowed opacity-70" : "peer-disabled:cursor-not-allowed peer-disabled:opacity-70")}>
                    I agree to the <Link href="/terms-and-conditions" target="_blank" className="underline text-primary">Terms & Conditions</Link>.
                    </label>
                </div>
            </div>
        </div>
        
        {selectedOfficeId && (
          selectedOfficeId === 'banyan' || selectedOfficeId === 'olive' ? (
              <div className="relative w-full max-w-6xl mx-auto pt-6">
                  <p className="text-center text-muted-foreground pb-4">Below is a static layout plan.</p>
                  <Image
                      src={selectedOfficeId === 'banyan' ? "/layouts/the-banyan-layout.jpeg" : "/layouts/the-olive-layout.jpeg"}
                      alt={selectedOfficeId === 'banyan' ? "The Banyan Layout" : "The Olive Layout"}
                      width={2000}
                      height={1200}
                      className="w-full h-auto object-contain rounded-lg border"
                  />
              </div>
          ) : (
            <>
                <Legend />
                <div className="relative w-full max-w-6xl mx-auto">
                    {isLoading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                    
                    {selectedOfficeLayout && (
                        <>
                        <Image
                            src={selectedOfficeLayout.imageUrl}
                            alt={selectedOfficeLayout.name}
                            width={2000}
                            height={1414}
                            className={cn("w-full rounded-lg", isLoading && 'opacity-50')}
                            priority
                        />

                        <TooltipProvider>
                            {selectedOfficeLayout.hotspots.map((spot) => {
                            const booking = getBookingForSpot(spot.id);
                            const isBooked = !!booking;
                            const isMyBooking = isBooked && booking?.userId === user?.uid;
                            const isThisOneBooking = bookingInProgress === spot.id;

                            let stateClass = 'border-blue-500 bg-blue-500/20 hover:bg-blue-500/40 cursor-pointer'; // Available
                            if (spot.disabled) {
                                stateClass = 'border-gray-300 bg-gray-300/30 cursor-not-allowed'; // Utility
                            } else if (spot.type === 'breakout') {
                                stateClass = 'border-purple-500 bg-purple-500/20 cursor-help';
                            }
                            else if (isMyBooking) {
                                stateClass = 'border-green-500 bg-green-500/20 cursor-default'; // My Booking
                            }
                            else if (isBooked) {
                                stateClass = 'border-gray-400 bg-gray-400/30 cursor-not-allowed'; // Booked by others
                            }

                            return (
                                <Tooltip key={spot.id}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => handleSpotClick(spot)}
                                        disabled={spot.disabled || isBooked || !!bookingInProgress || isLoading}
                                        className={cn("absolute border-2 text-xs font-semibold transition-colors flex items-center justify-center", stateClass)}
                                        style={{
                                            top: spot.top,
                                            left: spot.left,
                                            width: spot.width,
                                            height: spot.height,
                                            transform: spot.type === 'workstation' ? 'translate(-50%, -50%)' : 'none',
                                            borderRadius: spot.type === 'workstation' ? '0.375rem' : '0.125rem'
                                        }}
                                        title={spot.id}
                                    >
                                        {isThisOneBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                            <span className={cn("font-bold text-[10px] sm:text-xs", spot.type === 'workstation' ? 'text-black/80' : 'text-foreground')}>
                                                {spot.label || spot.id.split('-').pop()}
                                            </span>
                                        }
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-semibold">{spot.label || spot.id}</p>
                                    {spot.disabled ? <p>Utility</p> :
                                    spot.type === 'breakout' ? <p>First-come, first-served</p> :
                                    isMyBooking ? <p>Booked by you</p> : 
                                    isBooked ? <p>Booked by {booking?.userName}</p> : <p>Available</p>}
                                </TooltipContent>
                                </Tooltip>
                            );
                            })}
                        </TooltipProvider>
                        </>
                    )}
                </div>
                {selectedRoom && date && selectedOfficeId && (
                <MeetingRoomDialog
                    officeId={selectedOfficeId}
                    room={selectedRoom}
                    date={date}
                    onOpenChange={(open) => !open && setSelectedRoom(null)}
                    onBooked={fetchBookings}
                />
                )}
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}
