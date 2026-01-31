import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { mockUser, mockAdmin } from '@/lib/data';

const activities = [
    {
        user: mockUser,
        action: "booked The Boardroom for 2 hours.",
        time: "5m ago"
    },
    {
        user: { ...mockAdmin, name: "New User" },
        action: "signed up for a Monthly plan.",
        time: "15m ago"
    },
    {
        user: mockAdmin,
        action: "blocked Sunny Window Desk for maintenance.",
        time: "1h ago"
    },
    {
        user: { ...mockUser, name: "Jane Smith"},
        action: "booked a Day Pass.",
        time: "3h ago"
    },
    {
        user: mockUser,
        action: "upgraded to an Annual plan.",
        time: "1d ago"
    }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>A log of recent bookings and user actions.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src={activity.user.avatarUrl} alt="Avatar" />
              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {activity.user.name}
              </p>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">{activity.time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
