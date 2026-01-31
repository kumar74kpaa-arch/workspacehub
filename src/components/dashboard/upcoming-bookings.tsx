'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMockBookings } from '@/lib/data';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import type { Booking } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

type UpcomingBooking = Booking & { workspaceName: string; workspaceType: 'desk' | 'room' };

export function UpcomingBookings() {
  const [upcoming, setUpcoming] = useState<UpcomingBooking[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This runs only on the client, after hydration
    const mockBookings = getMockBookings();
    const futureBookings = mockBookings.filter(b => b.startTime > new Date()).slice(0, 3);
    setUpcoming(futureBookings);
    setIsClient(true);
  }, []);

  if (!isClient) {
    // On the server, and during initial client render, show a skeleton loader.
    return (
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>
              Your next few reservations at Workspace Hub.
            </CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1" disabled>
            <a href="#">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4 p-2">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="grid gap-1 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
           <div className="flex items-center gap-4 p-2">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="grid gap-1 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>
            Your next few reservations at Workspace Hub.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <a href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {upcoming.length > 0 ? (
          upcoming.map(booking => (
            <div key={booking.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-secondary/50">
              <div className="p-3 bg-secondary rounded-md">
                <Calendar className="h-6 w-6 text-muted-foreground"/>
              </div>
              <div className="grid gap-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  {booking.workspaceName}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                   <Clock className="h-3 w-3" /> {format(booking.startTime, "EEEE, MMM d 'at' h:mm a")}
                </p>
              </div>
              <div className="font-medium">{booking.workspaceType === 'desk' ? 'Desk' : 'Room'}</div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground p-2">You have no upcoming bookings.</p>
        )}
      </CardContent>
    </Card>
  );
}
