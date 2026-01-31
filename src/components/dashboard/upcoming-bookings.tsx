import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockBookings } from '@/lib/data';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function UpcomingBookings() {
  const upcoming = mockBookings.filter(b => b.startTime > new Date()).slice(0, 3);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>
            Your next few reservations at Deskify.
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
        {upcoming.map(booking => (
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
        ))}
      </CardContent>
    </Card>
  );
}
