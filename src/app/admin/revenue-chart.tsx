'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import type { Booking } from '@/lib/definitions';

const chartConfig = {
  total: {
    label: "Revenue (₹)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function RevenueChart() {
  const firestore = useFirestore();
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const monthlyTotals = MONTH_NAMES.map((name) => ({ name, total: 0 }));

    if (!firestore) {
      setData(monthlyTotals);
      setLoading(false);
      return;
    }

    const q = query(
      collection(firestore, 'bookings'),
      where('paymentStatus', '==', 'paid')
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const counts = [...monthlyTotals];

        snapshot.docs.forEach((doc) => {
          const b = doc.data();
          const start = (b.startTime as Timestamp)?.toDate
            ? (b.startTime as Timestamp).toDate()
            : new Date(b.startTime);
          
          const monthIdx = start.getMonth();
          if (monthIdx >= 0 && monthIdx < 12) {
            let amount = 1000;
            if (b.amount) {
              amount = Number(b.amount);
            } else if (b.workspaceType === 'room') {
              amount = 1500;
            }
            counts[monthIdx].total += amount;
          }
        });

        setData(counts);
        setLoading(false);
      },
      () => {
        setData(monthlyTotals);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [firestore]);

  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <CardTitle className="text-lg font-headline">Revenue Trends</CardTitle>
        <CardDescription>Monthly verified booking revenue against operational breakeven threshold.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data} accessibilityLayer>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
                tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                  />
                }
              />
              <ReferenceLine
                y={40000}
                stroke="hsl(var(--destructive))"
                strokeDasharray="3 3"
                label={{
                  value: 'Breakeven Target (₹40,000)',
                  position: 'top',
                  fill: 'hsl(var(--destructive))',
                  fontSize: 10,
                }}
              />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}