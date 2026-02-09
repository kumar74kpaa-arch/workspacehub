'use client';

import { UpcomingBookings } from '@/components/dashboard/upcoming-bookings';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
        <div className="grid auto-rows-max items-start gap-4 md:gap-8">
            <div className="grid gap-4">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-64" />
        </div>
    );
  }

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8">
        {user ? (
            <>
                <div className="grid gap-4">
                    <h1 className="text-3xl font-bold tracking-tight animate-float">
                    Welcome {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'back'}!
                    </h1>
                    <p className="text-muted-foreground">
                    Here&apos;s your personalized workspace overview.
                    </p>
                </div>
                 <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-4">
                    <Button asChild>
                      <Link href="/seat-booking?office=banyan">Book at The Banyan</Link>
                    </Button>
                     <Button asChild>
                      <Link href="/seat-booking?office=olive">Book at The Olive</Link>
                    </Button>
                  </CardContent>
                </Card>
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
    </div>
  );
}
