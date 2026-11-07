'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  ShieldAlert,
  Phone,
  Mail,
  Search,
  CheckCircle,
  Clock,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export interface GrievanceRecord {
  id?: string;
  referenceId: string;
  fullName: string;
  contactInfo: string;
  bookingRef?: string;
  natureOfComplaint: string;
  description: string;
  preferredChannel: string;
  status: 'Received' | 'Under Review' | 'Response Sent' | 'Resolved' | 'Closed';
  createdAt: string;
  notes?: { text: string; addedAt: string }[];
}

const grvStatuses = [
  'Received',
  'Under Review',
  'Response Sent',
  'Resolved',
  'Closed',
] as const;

const grvStatusColors: Record<string, string> = {
  'Received': 'bg-red-100 text-red-800 border-red-200',
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  'Response Sent': 'bg-blue-100 text-blue-800 border-blue-200',
  'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold',
  'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function AdminGrievancesPage() {
  const [grievances, setGrievances] = useState<GrievanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<GrievanceRecord | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/grievances');
      const data = await res.json();
      if (data.grievances) setGrievances(data.grievances);
    } catch (err) {
      toast({ title: 'Error fetching grievances', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleOpenDetails = (item: GrievanceRecord) => {
    setSelected(item);
    setStatusToUpdate(item.status);
    setNewNote('');
  };

  const handleSaveUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/grievances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId: selected.referenceId,
          status: statusToUpdate !== selected.status ? statusToUpdate : undefined,
          note: newNote.trim().length > 0 ? newNote.trim() : undefined,
        }),
      });
      if (!res.ok) throw new Error('Update failed');

      toast({ title: 'Grievance updated' });

      const updatedNotes = newNote.trim().length > 0
        ? [...(selected.notes || []), { text: newNote.trim(), addedAt: new Date().toISOString() }]
        : selected.notes;

      setSelected({ ...selected, status: statusToUpdate as any, notes: updatedNotes });
      setGrievances((prev) =>
        prev.map((g) =>
          g.referenceId === selected.referenceId
            ? { ...g, status: statusToUpdate as any, notes: updatedNotes }
            : g
        )
      );
      setNewNote('');
    } catch (err) {
      toast({ title: 'Failed to update', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = grievances.filter((g) => {
    const matchesSearch =
      search === '' ||
      g.fullName.toLowerCase().includes(search.toLowerCase()) ||
      g.contactInfo.includes(search) ||
      g.referenceId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy & Grievances Redressal</h1>
          <p className="text-sm text-muted-foreground">
            Track user privacy requests, consent withdrawals, and service complaints.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchGrievances} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Grievances</p>
          <p className="text-2xl font-bold mt-1">{grievances.length}</p>
        </Card>
        <Card className="p-4 border-red-200 bg-red-50/30">
          <p className="text-xs text-red-700 uppercase font-semibold">Action Required (Received)</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {grievances.filter((g) => g.status === 'Received').length}
          </p>
        </Card>
        <Card className="p-4 border-amber-200 bg-amber-50/30">
          <p className="text-xs text-amber-700 uppercase font-semibold">Under Review</p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {grievances.filter((g) => g.status === 'Under Review').length}
          </p>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50/30">
          <p className="text-xs text-green-700 uppercase font-semibold">Resolved</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {grievances.filter((g) => g.status === 'Resolved').length}
          </p>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, contact, tracking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm shadow-sm"
            >
              <option value="all">All Grievance Statuses</option>
              {grvStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking ID & Date</TableHead>
                <TableHead>Applicant & Contact</TableHead>
                <TableHead>Nature of Request</TableHead>
                <TableHead>Preferred Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length > 0 ? (
                filtered.map((item) => (
                  <TableRow key={item.referenceId}>
                    <TableCell>
                      <div className="font-mono text-xs font-semibold">{item.referenceId}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy') : 'Recent'}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-medium text-foreground">{item.fullName}</div>
                      <div className="text-xs text-muted-foreground">{item.contactInfo}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-foreground">{item.natureOfComplaint}</div>
                      {item.bookingRef && (
                        <div className="text-[11px] text-muted-foreground">Ref: {item.bookingRef}</div>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="text-xs text-muted-foreground">{item.preferredChannel}</div>
                    </TableCell>

                    <TableCell>
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${grvStatusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>
                        {item.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => handleOpenDetails(item)} className="text-xs">
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No grievance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      {selected && (
        <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Grievance Record: {selected.referenceId}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${grvStatusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </DialogTitle>
              <DialogDescription>
                Submitted on {format(new Date(selected.createdAt), 'PPP p')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs sm:text-sm py-2">
              <div className="rounded-xl border bg-secondary/20 p-3.5 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Applicant Name:</strong> {selected.fullName}</div>
                  <div><strong>Contact Detail:</strong> {selected.contactInfo}</div>
                  <div><strong>Nature:</strong> {selected.natureOfComplaint}</div>
                  <div><strong>Response Channel:</strong> {selected.preferredChannel}</div>
                  {selected.bookingRef && <div><strong>Booking Ref:</strong> {selected.bookingRef}</div>}
                </div>
                <div className="border-t pt-2 mt-2">
                  <p className="font-semibold text-foreground">Detailed Description:</p>
                  <p className="text-muted-foreground mt-0.5 whitespace-pre-wrap">{selected.description}</p>
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground">Update Grievance Status:</label>
                <select
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                >
                  {grvStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Notes / Resolution Log */}
              <div className="space-y-2">
                <label className="font-semibold text-xs text-foreground">Resolution & Communication Log:</label>
                {selected.notes && selected.notes.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border p-2 bg-muted/20">
                    {selected.notes.map((note, idx) => (
                      <div key={idx} className="rounded bg-card p-2 text-xs border border-border/60">
                        <p className="text-foreground">{note.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {format(new Date(note.addedAt), 'dd MMM yyyy, h:mm a')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No resolution logs added yet.</p>
                )}

                <Input
                  placeholder="Add communication or resolution note (e.g. data erased as requested, response emailed)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setSelected(null)} className="text-xs">
                Cancel
              </Button>
              <Button onClick={handleSaveUpdate} disabled={saving} className="text-xs font-semibold">
                {saving ? 'Saving...' : 'Save Updates'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
