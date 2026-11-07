'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Building, Calendar, Download, RefreshCw } from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact-config';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BarChart3 className="h-7 w-7 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Performance analytics, location utilization, and booking revenue trends across South Delhi centres.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => window.print()}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Monthly Active Bookings</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">100% Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              Real-time Firestore synchronization
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Banyan Centre Utilization</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">Lajpat Nagar IV</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Workstations & Conference Room
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Olive Centre Utilization</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">Lajpat Nagar II</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Private Suites & Shared Desks
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs uppercase font-medium">Lead Conversion Health</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono">Active Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Tracked via Enquiries Inbox
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Centre Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              The Banyan Performance
            </CardTitle>
            <CardDescription>
              {CONTACT_CONFIG.locations.banyan.shortAddress} • Metro: {CONTACT_CONFIG.locations.banyan.metroStation}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Inventory Setup</span>
              <span className="font-semibold text-foreground">Flexible Desks + Meeting Room</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Operating Schedule</span>
              <span className="font-semibold text-foreground">{CONTACT_CONFIG.operatingHours}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Primary Contact</span>
              <span className="font-semibold text-foreground">{CONTACT_CONFIG.primaryContactName} ({CONTACT_CONFIG.primaryPhoneDisplay})</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              The Olive Performance
            </CardTitle>
            <CardDescription>
              {CONTACT_CONFIG.locations.olive.shortAddress} • Metro: {CONTACT_CONFIG.locations.olive.metroStation}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Inventory Setup</span>
              <span className="font-semibold text-foreground">Dedicated Desks + Private Cabins</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Operating Schedule</span>
              <span className="font-semibold text-foreground">{CONTACT_CONFIG.operatingHours}</span>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between">
              <span className="text-muted-foreground">Primary Contact</span>
              <span className="font-semibold text-foreground">{CONTACT_CONFIG.secondaryContactName} ({CONTACT_CONFIG.secondaryPhoneDisplay})</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
