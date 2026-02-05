'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { allResources } from '@/lib/resources';
import type { Workspace } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { offices } from '@/lib/offices';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data from a service.
    // For now, we use the mock data.
    setResources(allResources);
    setLoading(false);
  }, []);

  const resourcesByOffice = offices.map(office => ({
    ...office,
    resources: resources.filter(r => r.officeId === office.id),
  }));

  return (
    <Card className="relative overflow-hidden">
       <div className="absolute top-0 right-0 -z-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>Manage workspaces, meeting rooms, and other resources across all offices.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {loading ? (
           <div className="space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                </div>
              </div>
           </div>
        ) : (
          resourcesByOffice.map(office => (
            <div key={office.id}>
              <h3 className="text-xl font-semibold mb-4">{office.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {office.resources.map((resource) => (
                  <div key={resource.id} className="rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{resource.type === 'desk' ? 'Workstation' : 'Meeting Room'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-md ${
                        resource.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {resource.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      Capacity: <span className="font-medium text-foreground">{resource.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
