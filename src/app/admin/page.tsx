import { OverviewCards } from '@/app/admin/overview-cards';
import { RevenueChart } from '@/app/admin/revenue-chart';
import { RecentActivity } from '@/components/admin/recent-activity';

export default function AdminDashboardPage() {
  return (
    <div>
       <h1 className="text-3xl font-bold tracking-tight mb-4">
          Admin Dashboard
        </h1>
      <div className="grid gap-4 md:gap-8">
        <OverviewCards />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
