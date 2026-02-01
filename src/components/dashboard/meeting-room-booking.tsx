'use client';

import * as React from 'react';
import { format, parse } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Workspace } from '@/lib/definitions';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';

interface MeetingRoomBookingProps {
    rooms: Workspace[];
}

export function MeetingRoomBooking({ rooms }: MeetingRoomBookingProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('10:00');
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | undefined>(rooms[0]?.id);
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);
  const [isReserving, setIsReserving] = React.useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleReserveClick = async () => {
    if (!user || !firestore) {
      router.push('/login');
      return;
    }
    if (!date || !selectedRoomId || !startTime || !endTime) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill out all fields.' });
      return;
    }
    
    setIsReserving(true);

    const selectedRoom = rooms.find(r => r.id === selectedRoomId);
    if (!selectedRoom) {
      toast({ variant: 'destructive', title: 'Error', description: 'Selected room not found.' });
      setIsReserving(false);
      return;
    }
    
    const startDateTime = parse(startTime, 'HH:mm', date);
    startDateTime.setSeconds(0,0);
    const endDateTime = parse(endTime, 'HH:mm', date);
    endDateTime.setSeconds(0,0);

    if (startDateTime >= endDateTime) {
        toast({ variant: 'destructive', title: 'Invalid Time', description: 'End time must be after start time.' });
        setIsReserving(false);
        return;
    }

    try {
      // Check for overlapping bookings
      const bookingsRef = collection(firestore, 'bookings');
      const q = query(bookingsRef, where('workspaceId', '==', selectedRoomId), where('status', '==', 'confirmed'));
      const querySnapshot = await getDocs(q);
      
      const isOverlapping = querySnapshot.docs.some(doc => {
          const booking = doc.data();
          const bookingStart = (booking.startTime as Timestamp).toDate();
          const bookingEnd = (booking.endTime as Timestamp).toDate();
          // Logic: (StartA < EndB) and (EndA > StartB)
          return startDateTime < bookingEnd && endDateTime > bookingStart;
      });

      if (isOverlapping) {
        toast({
            variant: 'destructive',
            title: 'Booking Conflict',
            description: 'This time slot is unavailable. Please choose another time.',
        });
        setIsReserving(false);
        return;
      }
      
      // Create new booking
      await addDoc(bookingsRef, {
        userId: user.uid,
        workspaceId: selectedRoom.id,
        workspaceName: selectedRoom.name,
        workspaceType: 'room',
        startTime: Timestamp.fromDate(startDateTime),
        endTime: Timestamp.fromDate(endDateTime),
        status: 'confirmed',
      });

      toast({
        title: 'Room Reserved!',
        description: `You've booked ${selectedRoom.name} on ${format(date, 'PPP')} from ${startTime} to ${endTime}.`,
      });

    } catch (error) {
        console.error("Error reserving room: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not reserve the room. Please try again.' });
    } finally {
        setIsReserving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Reserve Meeting Room</CardTitle>
        <CardDescription>Book a meeting room by the hour for your team.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Select Room</Label>
            <Select onValueChange={setSelectedRoomId} defaultValue={selectedRoomId}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a meeting room" />
                </SelectTrigger>
                <SelectContent>
                    {rooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                            {room.name} (up to {room.capacity} people)
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="date">Select Date</Label>
                <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal',
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
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="start-time" 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="pl-10" 
                        step="1800"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="end-time" 
                        type="time" 
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="pl-10"
                        step="1800"
                    />
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full md:w-auto ml-auto" onClick={handleReserveClick} disabled={isReserving}>
          {isReserving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isReserving ? 'Reserving...' : 'Reserve Room'}
        </Button>
      </CardFooter>
    </Card>
  );
}
