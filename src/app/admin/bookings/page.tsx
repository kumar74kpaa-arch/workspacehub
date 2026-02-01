'use client';

import * as React from 'react';
import { collection, query, where, onSnapshot, Timestamp, Firestore } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Booking } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Helper to group bookings by workspace
const groupBookingsByWorkspace = (bookings: Booking[]) => {
  return bookings.reduce((acc, booking) => {
    const key = booking.workspaceId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);
};

// Helper to sort bookings by start time
const sortBookingsByStartTime = (bookings: Booking[]) => {
  return [...bookings].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

// Helper to format time
const formatTime = (date: Date) => format(date, 'h:mm a');

// Helper to check for conflicts in a sorted list of bookings
const hasConflict = (current: Booking, previous?: Booking) => {
  if (!previous) return false;
  return current.startTime.getTime() < previous.endTime.getTime();
};

export default function AdminBookingsPage() {
  const firestore = useFirestore();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!firestore || !selectedDate) {
        setLoading(false);
        return;
    }
    setLoading(true);

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    const q = query(
      collection(firestore, 'bookings'),
      where('date', '==', dateStr)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            startTime: (data.startTime as Timestamp).toDate(),
            endTime: (data.endTime as Timestamp).toDate(),
        } as Booking;
      });
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, selectedDate]);
  
  const groupedBookings = groupBookingsByWorkspace(bookings);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="animate-float">Bookings by Date</CardTitle>
        <CardDescription>
          View all bookings for a specific day. Conflicts are highlighted automatically.
        </CardDescription>
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
                  !selectedDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(day) => {
                  setSelectedDate(day);
                  setCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-2 rounded-md border p-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : Object.keys(groupedBookings).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedBookings).map(([workspaceId, bookings]) => {
              const sortedBookings = sortBookingsByStartTime(bookings);
              return (
                <div key={workspaceId}>
                  <h3 className="font-semibold text-lg mb-2 capitalize">
                    {bookings[0].workspaceName}
                  </h3>
                  <div className="space-y-2">
                    {sortedBookings.map((booking, index) => {
                      const conflict = hasConflict(booking, sortedBookings[index - 1]);
                      return (
                        <div
                          key={booking.id}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-md border text-sm',
                            conflict ? 'bg-destructive/10 border-destructive text-destructive-foreground' : 'bg-secondary'
                          )}
                        >
                          <div>
                            <span className="font-medium">
                              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                            </span>
                            <span className="text-muted-foreground mx-2">|</span>
                            <span>{booking.userName}</span>
                          </div>
                          {conflict && (
                            <Badge variant="destructive" className="gap-1.5">
                               <AlertTriangle className="h-3.5 w-3.5"/>
                               Conflict
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <Separator className="my-4" />
            <p className="py-12 text-center text-sm text-muted-foreground">
              No bookings found for {selectedDate ? format(selectedDate, 'PPP') : 'the selected date'}.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
