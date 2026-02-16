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

const chartConfig = {
  total: {
    label: "Revenue",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  const [data, setData] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    // Initializing with real February revenue and 0 for other months
    const cleanData = [
      { name: 'Jan', total: 0 },
      { name: 'Feb', total: 5.83 }, // Your first real transaction
      { name: 'Mar', total: 0 },
      { name: 'Apr', total: 0 },
      { name: 'May', total: 0 },
      { name: 'Jun', total: 0 },
      { name: 'Jul', total: 0 },
      { name: 'Aug', total: 0 },
      { name: 'Sep', total: 0 },
      { name: 'Oct', total: 0 },
      { name: 'Nov', total: 0 },
      { name: 'Dec', total: 0 },
    ];
    setData(cleanData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>An overview of your monthly revenue against your breakeven target.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={data} accessibilityLayer>
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                // Sets the visual range from 5k to 50k as requested
                domain={[5000, 50000]}
                ticks={[5000, 10000, 20000, 30000, 40000, 50000]}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                />}
                cursor={{ fill: 'hsl(var(--accent) / 0.2)'}}
              />
              {/* Updated Breakeven Target to 50k */}
              <ReferenceLine 
                y={40000} 
                label={{ value: "Breakeven Target", position: 'top', fill: 'hsl(var(--destructive))', fontSize: 10 }} 
                strokeDasharray="3 3" 
                stroke="hsl(var(--destructive))" 
              />
              <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <Skeleton className="h-[350px] w-full" />
        )}
      </CardContent>
    </Card>
  );
}