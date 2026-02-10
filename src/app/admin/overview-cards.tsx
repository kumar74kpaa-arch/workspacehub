'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IndianRupee, Users, CalendarCheck, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import type { Booking } from '@/lib/definitions';
import { isToday } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to calculate booking amount
const calculateBookingAmount = (booking: Booking): number => {
    if (booking.workspaceType === 'desk') {
        return 1000; // Day Pass Price
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
    totalBookings: 0,
    extendedHours: 0,
    occupancy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firestore) {
        setLoading(false);
        return;
    }
    setLoading(true);

    const q = query(
      collection(firestore, 'bookings'),
      where('paymentStatus', '==', 'paid')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        let totalRevenue = 0;
        let totalBookings = 0;
        let extendedHours = 0;
        let todayDeskBookings = 0;

        const bookingsData: Booking[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                startTime: (data.startTime as Timestamp).toDate(),
                endTime: (data.endTime as Timestamp).toDate(),
            } as Booking;
        });

        bookingsData.forEach(booking => {
            totalRevenue += calculateBookingAmount(booking);
            totalBookings++;

            if (booking.isExtendedHours) {
                const duration = (booking.endTime.getTime() - booking.startTime.getTime()) / (1000 * 60 * 60);
                extendedHours += duration;
            }

            if (booking.workspaceType === 'desk' && isToday(booking.startTime)) {
                todayDeskBookings++;
            }
        });

        // Total workstations: 12 at Banyan + 16 at Olive = 28
        const totalWorkstations = 28;
        const occupancy = totalWorkstations > 0 ? (todayDeskBookings / totalWorkstations) * 100 : 0;

        setStats({
            totalRevenue,
            totalBookings,
            extendedHours: Math.round(extendedHours),
            occupancy: Math.round(occupancy),
        });
        setLoading(false);
    }, (error) => {
        console.error("Error fetching overview stats:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);
  
  if (loading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><Skeleton className="h-5 w-3/4" /><IndianRupee className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><Skeleton className="h-5 w-3/4" /><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /><Skeleton className="h-2 w-full mt-2" /></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><Skeleton className="h-5 w-3/4" /><Zap className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><Skeleton className="h-5 w-3/4" /><CalendarCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent></Card>
        </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
          <p className="text-xs text-muted-foreground">All time revenue from paid bookings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today's Occupancy</CardTitle>
           <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.occupancy}%</div>
           <Progress value={stats.occupancy} className="h-2 mt-2" />
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extended Hours Booked</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.extendedHours} Hours</div>
          <p className="text-xs text-muted-foreground">Total late booking hours</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <p className="text-xs text-muted-foreground">Total paid bookings all time</p>
        </CardContent>
      </Card>
    </div>
  );
}
