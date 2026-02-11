'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useFirestore } from '@/firebase';
import type { Booking } from '@/lib/definitions';
import { collection, onSnapshot, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { CalendarPlus } from 'lucide-react';

export function RecentActivity() {
  const firestore = useFirestore();
  const [activities, setActivities] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const q = query(collection(firestore, 'bookings'), orderBy('createdAt', 'desc'), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activitiesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startTime: (data.startTime as Timestamp).toDate(),
          endTime: (data.endTime as Timestamp).toDate(),
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        } as Booking;
      });
      setActivities(activitiesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching recent activity:", error);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [firestore]);

  const getInitials = (name: string) => name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A live log of the latest user bookings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-4">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="grid gap-1 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>A live log of the latest user bookings.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border">
                <AvatarFallback>{getInitials(activity.userName)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {activity.userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Booked <span className="font-semibold">{activity.workspaceName}</span>
                </p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">
                {activity.createdAt ? formatDistanceToNow(activity.createdAt, { addSuffix: true }) : ''}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarPlus className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No recent activity yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
