'use client';

import * as React from 'react';
import { collection, query, onSnapshot, Timestamp, orderBy, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { format } from 'date-fns';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Booking } from '@/lib/definitions';

interface Payment extends Booking {
    amount: number;
}

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

const getStatusBadge = (payment: Payment) => {
    const now = new Date();
    // Ensure startTime and endTime are valid dates before comparing
    if (!payment.startTime || !payment.endTime) return <Badge variant="outline">Unknown</Badge>;

    if (now >= payment.startTime && now <= payment.endTime) {
        return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
            </Badge>
        );
    }
    if (now < payment.startTime) {
        return <Badge variant="secondary">Upcoming</Badge>;
    }
    return <Badge variant="outline">Completed</Badge>;
};


export default function PaymentsPage() {
  const firestore = useFirestore();
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!firestore) {
        setLoading(false);
        return;
    }
    setLoading(true);
    
    const q = query(
      collection(firestore, 'bookings'),
      where('paymentStatus', '==', 'paid'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const booking = {
            id: doc.id,
            ...data,
            startTime: (data.startTime as Timestamp).toDate(),
            endTime: (data.endTime as Timestamp).toDate(),
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        } as Booking;

        return {
            ...booking,
            amount: calculateBookingAmount(booking),
        } as Payment;
      });
      setPayments(paymentsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching payments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>A log of all successful payments and transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Workspace</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Transaction Time</TableHead>
              <TableHead>Booking Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              ))
            ) : payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium">{payment.userName}</div>
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{payment.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Razorpay</Badge>
                  </TableCell>
                  <TableCell>{payment.workspaceName}</TableCell>
                  <TableCell className="capitalize">{payment.workspaceType === 'desk' ? 'Workstation' : 'Room'}</TableCell>
                  <TableCell>
                    {payment.createdAt ? format(payment.createdAt, 'PPp') : 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
