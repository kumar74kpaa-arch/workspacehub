'use client';

import * as React from 'react';
import { format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getMockBookings } from '@/lib/data';
import type { Booking } from '@/lib/definitions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type WorkstationBooking = Booking & { workspaceName: string, workspaceType: 'desk' | 'room' };

export function WorkstationBooking() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookings, setBookings] = React.useState<WorkstationBooking[]>([]);

  React.useEffect(() => {
    // Fetch mock bookings on the client side
    const allBookings = getMockBookings();
    setBookings(allBookings.filter(b => b.workspaceType === 'desk'));
  }, []);

  const workstations = Array.from({ length: 16 }, (_, i) => `WS-${String(i + 1).padStart(2, '0')}`);

  const getBookingForWorkstation = (workstationId: string) => {
    if (!date) return null;
    return bookings.find(
      (b) => b.workspaceId.toLowerCase() === workstationId.toLowerCase() && isSameDay(b.startTime, date)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workstations</CardTitle>
        <CardDescription>Select a date to see availability and book a single person desk.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Select Date</label>
            <Popover>
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
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
            </Popover>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {workstations.map((ws) => {
            const booking = getBookingForWorkstation(ws);
            return (
                <TooltipProvider key={ws}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Button
                                    variant={booking ? 'destructive' : 'outline'}
                                    className="w-full"
                                    disabled={!!booking}
                                >
                                    {ws}
                                </Button>
                            </div>
                        </TooltipTrigger>
                        {booking && (
                            <TooltipContent>
                                <p className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Booked from {format(booking.startTime, 'h:mm a')} to {format(booking.endTime, 'h:mm a')}
                                </p>
                            </TooltipContent>
                        )}
                         {!booking && (
                             <TooltipContent>
                                <p>Available</p>
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
