'use client';

import { mockWorkspaces } from '@/lib/data';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { UpcomingBookings } from '@/components/dashboard/upcoming-bookings';
import { WorkspaceCard } from '@/components/dashboard/workspace-card';
import { useUser } from '@/firebase';

export default function DashboardPage() {
  const { user } = useUser();

  const welcomeName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'back';

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome {welcomeName}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your personalized workspace overview.
        </p>
      </div>
      <OverviewCards />
      <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        <UpcomingBookings />
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Workspaces</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockWorkspaces.map((space) => (
              <WorkspaceCard key={space.id} workspace={space} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
