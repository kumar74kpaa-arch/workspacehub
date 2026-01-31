'use client';

import { getMockWorkspaces } from '@/lib/data';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { UpcomingBookings } from '@/components/dashboard/upcoming-bookings';
import { useUser } from '@/firebase';
import { WorkstationBooking } from '@/components/dashboard/workstation-booking';
import { MeetingRoomBooking } from '@/components/dashboard/meeting-room-booking';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import type { Workspace } from '@/lib/definitions';

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [meetingRooms, setMeetingRooms] = useState<Workspace[]>([]);

  useEffect(() => {
    const rooms = getMockWorkspaces().filter(space => space.type === 'room');
    setMeetingRooms(rooms);
  }, []);

  if (loading) {
    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-64" />
            <div className="space-y-8">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-96" />
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                 </div>
            </div>
        </div>
    );
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {user ? (
            <>
                <div className="grid gap-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                    Welcome {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'back'}!
                    </h1>
                    <p className="text-muted-foreground">
                    Here&apos;s your personalized workspace overview.
                    </p>
                </div>
                <OverviewCards />
                <UpcomingBookings />
            </>
        ) : (
            <div className="grid gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Explore Our Workspaces
                </h1>
                <p className="text-muted-foreground">
                Sign in to view your personal dashboard and make bookings.
                </p>
            </div>
        )}

        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Workspaces</h2>
              <div className="grid gap-8">
                  <WorkstationBooking />
                  {meetingRooms.length > 0 && <MeetingRoomBooking rooms={meetingRooms} />}
              </div>
            </div>
        </div>
    </div>
  );
}
