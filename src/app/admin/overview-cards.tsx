'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IndianRupee, Users, Compass, Inbox } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import type { Booking } from '@/lib/definitions';
import { isToday, format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to calculate booking amount
const calculateBookingAmount = (booking: Booking): number => {
  if (booking.workspaceType === 'desk') {
    return 1000; // Day Pass Price in INR
  }
  if (booking.workspaceType === 'room') {
    const durationInHours = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60);
    if (durationInHours <= 0) return 0;

    const isConference = booking.workspaceName.toLowerCase().includes('conference');
    const roomBasePrice = isConference ? 1000 : 750;

    const extraChairsMatch = booking.workspaceName.match(/\(\+(\d+)\s*seats\)/);
    const extraChairs = extraChairsMatch ? parseInt(extraChairsMatch[1], 10) : 0;

    const roomCost = roomBasePrice * durationInHours;
    const extraChairCost = extraChairs > 0 ? extraChairs * 100 * durationInHours : 0;

    return roomCost + extraChairCost;
  }
  return 0;
};

export function OverviewCards() {
  const firestore = useFirestore();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newEnquiries: 0,
    upcomingTours: 0,
    occupancy: 0,
    todayBookingsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }
    setLoading(true);

    // 1. Listen to paid bookings
    const bookingsQuery = query(
      collection(firestore, 'bookings'),
      where('paymentStatus', '==', 'paid')
    );

    let bookingsTotal = 0;
    let todayDesks = 0;

    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        let rev = 0;
        let todayCount = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const booking: Booking = {
            id: doc.id,
            ...data,
            startTime: (data.startTime as Timestamp)?.toDate ? (data.startTime as Timestamp).toDate() : new Date(data.startTime),
            endTime: (data.endTime as Timestamp)?.toDate ? (data.endTime as Timestamp).toDate() : new Date(data.endTime),
          } as Booking;

          rev += calculateBookingAmount(booking);

          if (isToday(booking.startTime)) {
            todayCount++;
          }
        });

        bookingsTotal = rev;
        todayDesks = todayCount;

        // Total bookable capacity: 28 desks (12 Banyan + 16 Olive)
        const totalCapacity = 28;
        const occ = Math.min(100, Math.round((todayDesks / totalCapacity) * 100));

        setStats((prev) => ({
          ...prev,
          totalRevenue: bookingsTotal,
          occupancy: occ,
          todayBookingsCount: todayDesks,
        }));
      },
      (err) => console.warn('[Overview] Bookings listener note:', err)
    );

    // 2. Listen to tour enquiries for upcoming tours and new status
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    let newEnquiriesCount = 0;
    let upcomingToursCount = 0;

    const unsubTours = onSnapshot(
      collection(firestore, 'tour_enquiries'),
      (snap) => {
        let toursNew = 0;
        let toursUpcoming = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          if ((data.status || 'new') === 'new') toursNew++;
          if (data.preferredDate && data.preferredDate >= todayStr) toursUpcoming++;
        });

        upcomingToursCount = toursUpcoming;
        setStats((prev) => ({
          ...prev,
          upcomingTours: upcomingToursCount,
          newEnquiries: prev.newEnquiries + toursNew,
        }));
        setLoading(false);
      },
      () => setLoading(false)
    );

    // 3. Listen to corporate enquiries
    const unsubCorp = onSnapshot(
      collection(firestore, 'corporate_enquiries'),
      (snap) => {
        let corpNew = 0;
        snap.docs.forEach((d) => {
          const data = d.data();
          if ((data.status || 'new') === 'new') corpNew++;
        });
        setStats((prev) => ({
          ...prev,
          newEnquiries: corpNew,
        }));
      },
      () => {}
    );

    return () => {
      unsubBookings();
      unsubTours();
      unsubCorp();
    };
  }, [firestore]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-36 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Revenue */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Revenue
          </CardTitle>
          <IndianRupee className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Confirmed & paid bookings to date
          </p>
        </CardContent>
      </Card>

      {/* 2. New Enquiries */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New Enquiries
          </CardTitle>
          <Inbox className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            {stats.newEnquiries}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Uncontacted tour & corporate leads
          </p>
        </CardContent>
      </Card>

      {/* 3. Upcoming Tours */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Upcoming Tours
          </CardTitle>
          <Compass className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-mono">
            {stats.upcomingTours}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Scheduled on or after today
          </p>
        </CardContent>
      </Card>

      {/* 4. Today's Occupancy */}
      <Card className="border-border shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Today&apos;s Occupancy
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono">{stats.occupancy}%</span>
            <span className="text-xs text-muted-foreground font-mono">
              {stats.todayBookingsCount}/28 Desks
            </span>
          </div>
          <Progress value={stats.occupancy} className="h-2 mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
