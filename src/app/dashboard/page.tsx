import { mockUser, mockWorkspaces } from '@/lib/data';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { UpcomingBookings } from '@/components/dashboard/upcoming-bookings';
import { AiOptimizer } from '@/components/dashboard/ai-optimizer';
import { WorkspaceCard } from '@/components/dashboard/workspace-card';

export default function DashboardPage() {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {mockUser.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your personalized workspace overview.
        </p>
      </div>
      <OverviewCards />
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <UpcomingBookings />
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Workspaces</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockWorkspaces.map((space) => (
                <WorkspaceCard key={space.id} workspace={space} />
              ))}
            </div>
          </div>
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <AiOptimizer />
        </div>
      </div>
    </div>
  );
}
