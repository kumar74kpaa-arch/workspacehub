'use client';

import * as React from 'react';
import { format, parse, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Loader2, Users, Armchair, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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

const layoutElements = {
    workstations: [
        // Top row
        { id: 'WS-01', top: '10%', left: '30%' }, { id: 'WS-02', top: '22%', left: '30%' },
        { id: 'WS-03', top: '10%', left: '38%' }, { id: 'WS-04', top: '22%', left: '38%' },
        { id: 'WS-05', top: '10%', left: '50%' }, { id: 'WS-06', top: '22%', left: '50%' },
        // Bottom row
        { id: 'WS-07', top: '65%', left: '30%' }, { id: 'WS-08', top: '77%', left: '30%' },
        { id: 'WS-09', top: '65%', left: '38%' }, { id: 'WS-10', top: '77%', left: '38%' },
        { id: 'WS-11', top: '55%', left: '52%' }, { id: 'WS-12', top: '55%', left: '58%' },
        { id: 'WS-13', top: '65%', left: '70%' }, { id: 'WS-14', top: '77%', left: '70%' },
        { id: 'WS-15', top: '65%', left: '82%' }, { id: 'WS-16', top: '77%', left: '82%' },
    ],
    meetingRooms: [
        { id: 'conference-hall', name: 'Conference Hall', top: '8%', left: '3%', width: '22%', height: '38%' },
        { id: 'mini-meeting-room', name: 'Mini Meeting Room', top: '8%', left: '70%', width: '22%', height: '30%' },
    ],
    decor: [
        // Desks
        { top: '8%', left: '29%', width: '18%', height: '20%', type: 'desk' },
        { top: '8%', left: '49%', width: '9%', height: '20%', type: 'desk' },
        { top: '63%', left: '29%', width: '18%', height: '20%', type: 'desk' },
        { top: '63%', left: '69%', width: '22%', height: '20%', type: 'desk' },
        // Walls and other
        { top: '5%', left: '68%', width: '1px', height: '35%', type: 'wall' },
        { top: '40%', left: '68%', width: '30%', height: '1px', type: 'wall' },
        { top: '40%', right: '2%', width: '28%', height: '55%', label: 'Pantry/Restroom' },
    ]
};

function MeetingRoomDialog({ room, date, onOpenChange, onBooked }: { room: Workspace, date: Date, onOpenChange: (open: boolean) => void, onBooked: () => void }) {
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('10:00');
  const [isReserving, setIsReserving] = React.useState(false);
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
      const conflict = await hasBookingConflict({ firestore, workspaceId: room.id, startTime: startDateTime, endTime: endDateTime });

      if (conflict) {
        toast({ variant: 'destructive', title: 'Booking Conflict', description: 'This time slot is unavailable. Please choose another time.' });
        setIsReserving(false);
        return;
      }
      
      await addDoc(collection(firestore, 'bookings'), {
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
        </div>
        <DialogFooter>
          <Button onClick={handleReserveClick} disabled={isReserving || !validationResult.valid}>
            {isReserving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Reservation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function OfficeLayoutBooking({ rooms }: { rooms: Workspace[] }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [bookingInProgress, setBookingInProgress] = React.useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = React.useState<Workspace | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const fetchBookings = React.useCallback(async () => {
    if (!firestore || !date) return;
    setIsLoading(true);
    const dateStr = format(date, 'yyyy-MM-dd');
    const q = query(collection(firestore, 'bookings'), where('date', '==', dateStr));
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
  }, [date, firestore, toast]);

  React.useEffect(() => {
    fetchBookings();
  }, [date, fetchBookings]);

  const getBookingForWorkstation = (workstationId: string) => {
    return bookings.find(b => b.workspaceType === 'desk' && b.workspaceId === workstationId);
  };
  
  const getBookingsForRoom = (roomId: string) => {
    return bookings.filter(b => b.workspaceType === 'room' && b.workspaceId === roomId);
  };

  const handleBookWorkstation = async (workstationId: string) => {
    if (!user || !firestore) {
      router.push('/login'); return;
    }
    if (!date) return;

    setBookingInProgress(workstationId);
    try {
        if (getBookingForWorkstation(workstationId)) {
            toast({ variant: "destructive", title: "Already Booked", description: "This workstation is booked." });
            return;
        }
        
        const dayStart = new Date(date); dayStart.setHours(9,0,0,0);
        const dayEnd = new Date(date); dayEnd.setHours(17,0,0,0);

        await addDoc(collection(firestore, "bookings"), {
            userId: user.uid, userName: user.displayName || user.email,
            workspaceId: workstationId, workspaceName: `Workstation ${workstationId}`, workspaceType: 'desk',
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
  
  const handleRoomClick = (roomId: string) => {
    if (!user) { router.push('/login'); return; }
    if (!date) return;
    const roomData = rooms.find(r => r.id === roomId);
    if (roomData) setSelectedRoom(roomData);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserve Your Space</CardTitle>
        <CardDescription>Select a date and click on an available desk or room in the layout below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
          <Label>Select Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant={'outline'} className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={(day) => { setDate(day); setCalendarOpen(false); }} initialFocus disabled={(day) => day < startOfDay(new Date())} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative w-full bg-muted/30 rounded-lg aspect-[2/1] p-4 overflow-hidden">
          {isLoading && <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20"><Loader2 className="h-8 w-8 animate-spin" /></div>}
          
          <TooltipProvider>
            {/* Decor Elements */}
            {layoutElements.decor.map((el, i) => (
                <div key={`dec-${i}`} className={cn("absolute bg-secondary/80 rounded-sm", el.label && "flex items-center justify-center text-muted-foreground text-sm")} style={{ top: el.top, left: el.left, right: el.right, width: el.width, height: el.height }}>
                   {el.label}
                </div>
            ))}
            
            {/* Workstations */}
            {layoutElements.workstations.map((ws) => {
              const booking = getBookingForWorkstation(ws.id);
              const isBooked = !!booking;
              const isMyBooking = isBooked && booking.userId === user?.uid;
              const isThisOneBooking = bookingInProgress === ws.id;

              return (
                <Tooltip key={ws.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleBookWorkstation(ws.id)}
                      disabled={isBooked || !!bookingInProgress || isLoading}
                      className={cn(
                        "absolute z-10 flex flex-col items-center justify-center w-14 h-10 rounded-md transition-colors border text-xs font-semibold",
                        isMyBooking 
                          ? 'bg-blue-500 text-white border-blue-600 cursor-default' 
                          : isBooked 
                          ? 'bg-muted text-muted-foreground border-border cursor-not-allowed' 
                          : 'bg-card hover:bg-secondary border-border text-foreground',
                        !!bookingInProgress && !isThisOneBooking && 'opacity-50 cursor-not-allowed',
                        isThisOneBooking && 'animate-pulse'
                      )}
                      style={{ top: ws.top, left: ws.left, transform: 'translate(-50%, -50%)' }}
                    >
                      {isThisOneBooking ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                        <>
                          <Armchair className="w-4 h-4" />
                          <span className="mt-0.5">{ws.id.replace('WS-', '')}</span>
                        </>
                      }
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                      <p className="font-semibold">{ws.id}</p>
                      {isMyBooking ? <p>Booked by you</p> : isBooked ? <p>Booked by {booking.userName}</p> : <p>Available</p>}
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {/* Meeting Rooms */}
            {layoutElements.meetingRooms.map((mr) => {
              const roomData = rooms.find(r => r.id === mr.id);
              const roomBookings = getBookingsForRoom(mr.id);
              const isBookedToday = roomBookings.length > 0;
              return (
                 <Tooltip key={mr.id}>
                    <TooltipTrigger asChild>
                        <button 
                            onClick={() => handleRoomClick(mr.id)}
                            disabled={isLoading}
                            className="absolute z-10 bg-card hover:bg-secondary/80 border border-border rounded-lg transition-colors flex items-center justify-center p-2 shadow-sm"
                             style={{ top: mr.top, left: mr.left, width: mr.width, height: mr.height }}
                        >
                            <div className="text-center">
                                <p className="font-bold text-foreground text-sm">{mr.name}</p>
                                {isBookedToday && (
                                    <Badge variant="secondary" className="mt-2 text-xs font-normal">
                                        {roomBookings.length} booking(s)
                                    </Badge>
                                )}
                            </div>
                        </button>
                    </TooltipTrigger>
                     <TooltipContent>
                        <p className="font-semibold">{mr.name}</p>
                        <p>Capacity: {roomData?.capacity}</p>
                        <p className="mt-1 text-xs">Click to see schedule & book</p>
                    </TooltipContent>
                 </Tooltip>
              )
            })}

          </TooltipProvider>
        </div>
        {selectedRoom && date && (
          <MeetingRoomDialog
            room={selectedRoom}
            date={date}
            onOpenChange={(open) => !open && setSelectedRoom(null)}
            onBooked={fetchBookings}
          />
        )}
      </CardContent>
    </Card>
  );
}
