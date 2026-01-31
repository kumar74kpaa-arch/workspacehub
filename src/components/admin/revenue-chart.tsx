'use client';

import * as React from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
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
    // Generate data on the client to avoid hydration mismatch
    const generatedData = [
      { name: 'Jan', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Feb', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Mar', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Apr', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'May', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Jun', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Jul', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Aug', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Sep', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Oct', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Nov', total: Math.floor(Math.random() * 400000) + 80000 },
      { name: 'Dec', total: Math.floor(Math.random() * 400000) + 80000 },
    ];
    setData(generatedData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>An overview of your monthly revenue.</CardDescription>
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
                tickFormatter={(value) => `₹${Number(value) / 1000}k`}
              />
              <ChartTooltip
                content={<ChartTooltipContent 
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />}
                cursor={{ fill: 'hsl(var(--accent) / 0.2)'}}
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
