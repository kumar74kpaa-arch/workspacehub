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
import { offices } from '@/lib/offices';

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

const getOfficeName = (officeId: string) => {
    return offices.find(o => o.id === officeId)?.name || officeId;
}

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
            createdAt: (data.createdAt as Timestamp)?.toDate(),
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
              <TableHead>Product</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-28" /></TableCell>
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
                  <TableCell>{getOfficeName(payment.officeId)}</TableCell>
                  <TableCell className="capitalize">{payment.workspaceType === 'desk' ? 'Workstation' : 'Room'}</TableCell>
                  <TableCell>
                    {payment.createdAt ? format(payment.createdAt, 'PPp') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
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
