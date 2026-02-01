'use client';

import * as React from 'react';
import { format, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, addDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import type { Booking } from '@/lib/definitions';


export function WorkstationBooking() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = React.useState(true);
  const [bookingInProgress, setBookingInProgress] = React.useState<string | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!firestore || !date) return;

    setIsLoadingBookings(true);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    // To avoid a composite index, we query only on the date range
    // and filter for workspaceType on the client.
    const q = query(
      collection(firestore, 'bookings'),
      where('startTime', '>=', dayStart),
      where('startTime', '<=', dayEnd)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking)).filter(b => b.workspaceType === 'desk');
      setBookings(bookingsData);
      setIsLoadingBookings(false);
    }, (error) => {
      console.error("Error fetching workstation bookings:", error);
      setIsLoadingBookings(false);
    });
    
    return () => unsubscribe();

  }, [date, firestore]);

  const workstations = Array.from({ length: 16 }, (_, i) => `WS-${String(i + 1).padStart(2, '0')}`);

  const getBookingForWorkstation = (workstationId: string) => {
    if (!date) return null;
    return bookings.find(
      (b) => b.workspaceId.toLowerCase() === workstationId.toLowerCase() && isSameDay(new Date(b.startTime), date)
    );
  };
  
  const handleBookWorkstation = async (workstationId: string) => {
    if (!user || !firestore) {
      router.push('/login');
      return;
    }
    if (!date) return;

    setBookingInProgress(workstationId);

    try {
        const booking = getBookingForWorkstation(workstationId);
        if (booking) {
            toast({ variant: "destructive", title: "Already Booked", description: "This workstation is already booked for the selected day." });
            return;
        }
        
        // Default booking for the whole day (9am to 5pm)
        const dayStart = new Date(date);
        dayStart.setHours(9,0,0,0);

        const dayEnd = new Date(date);
        dayEnd.setHours(17,0,0,0);

        await addDoc(collection(firestore, "bookings"), {
            userId: user.uid,
            workspaceId: workstationId,
            workspaceName: `Workstation ${workstationId}`,
            workspaceType: 'desk',
            startTime: Timestamp.fromDate(dayStart),
            endTime: Timestamp.fromDate(dayEnd),
            status: 'confirmed'
        });

        toast({
            title: 'Workstation Booked!',
            description: `You have booked ${workstationId} for ${format(date, 'PPP')}.`,
        });

    } catch (error) {
        console.error("Error booking workstation: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not book workstation. Please try again.' });
    } finally {
        setBookingInProgress(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workstations</CardTitle>
        <CardDescription>Select a date to see availability and book a single person desk for the day.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
                <Button
                variant={'outline'}
                className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(day) => {
                    setDate(day);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                  disabled={(day) => day < startOfDay(new Date())}
                />
            </PopoverContent>
            </Popover>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {workstations.map((ws) => {
            const booking = getBookingForWorkstation(ws);
            const isThisOneBooking = bookingInProgress === ws;
            const isBooked = !!booking;
            
            return (
                <TooltipProvider key={ws}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Button
                                    variant={isBooked ? 'destructive' : 'outline'}
                                    className="w-full"
                                    disabled={isBooked || !date || isLoadingBookings || !!bookingInProgress}
                                    onClick={() => handleBookWorkstation(ws)}
                                >
                                    {isThisOneBooking ? <Loader2 className="animate-spin"/> : ws}
                                </Button>
                            </div>
                        </TooltipTrigger>
                        {isBooked && (
                            <TooltipContent>
                                <p className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Booked for the day
                                </p>
                            </TooltipContent>
                        )}
                         {!isBooked && date && (
                             <TooltipContent>
                                <p>Available</p>
                            </TooltipContent>
                         )}
                         {!date && (
                             <TooltipContent>
                                <p>Please select a date</p>
                            </TooltipContent>
                         )}
                    </Tooltip>
                </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
