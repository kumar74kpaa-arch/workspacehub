'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getMockWorkspaces } from '@/lib/data';
import type { Workspace } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export default function ResourcesPage() {
  const [resources, setResources] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch this data from a service.
    const fetchedResources = getMockWorkspaces();
    setResources(fetchedResources);
    setLoading(false);
  }, []);

  return (
    <Card className="relative overflow-hidden">
       <div className="absolute top-0 right-0 -z-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
      <CardHeader>
        <CardTitle>Resources</CardTitle>
        <CardDescription>Manage workspaces, meeting rooms, and other resources.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
             <Skeleton className="h-28" />
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
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
        )}
      </CardContent>
    </Card>
  );
}
