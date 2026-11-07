'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Briefcase,
  Phone,
  Mail,
  Search,
  CheckCircle,
  Building2,
  Users,
  RefreshCw,
  ExternalLink,
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
import { getWhatsAppUrl } from '@/lib/contact-config';
import { WhatsAppIcon } from '@/components/contact/floating-contact';

export interface CorporateEnquiry {
  id?: string;
  referenceId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  teamSize: string;
  location: string;
  locationName: string;
  requirementType: string;
  targetStartDate?: string;
  message?: string;
  status: 'New Enquiry' | 'Contacted' | 'Proposal Sent' | 'Site Visit Done' | 'Closed Won' | 'Closed Lost';
  createdAt: string;
  notes?: { text: string; addedAt: string }[];
}

const statusColors: Record<string, string> = {
  'New Enquiry': 'bg-blue-100 text-blue-800 border-blue-200',
  'Contacted': 'bg-amber-100 text-amber-800 border-amber-200',
  'Proposal Sent': 'bg-purple-100 text-purple-800 border-purple-200',
  'Site Visit Done': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Closed Won': 'bg-green-100 text-green-800 border-green-300 font-semibold',
  'Closed Lost': 'bg-gray-100 text-gray-700 border-gray-200',
};

const corpStatuses = [
  'New Enquiry',
  'Contacted',
  'Proposal Sent',
  'Site Visit Done',
  'Closed Won',
  'Closed Lost',
] as const;

export default function AdminCorporateEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CorporateEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<CorporateEnquiry | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/corporate-enquiries');
      const data = await res.json();
      if (data.enquiries) setEnquiries(data.enquiries);
    } catch (err) {
      toast({ title: 'Error loading corporate enquiries', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleOpenDetails = (item: CorporateEnquiry) => {
    setSelected(item);
    setStatusToUpdate(item.status);
    setNewNote('');
  };

  const handleSaveUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/corporate-enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId: selected.referenceId,
          status: statusToUpdate !== selected.status ? statusToUpdate : undefined,
          note: newNote.trim().length > 0 ? newNote.trim() : undefined,
        }),
      });
      if (!res.ok) throw new Error('Update failed');

      toast({ title: 'Corporate Enquiry Updated' });

      const updatedNotes = newNote.trim().length > 0
        ? [...(selected.notes || []), { text: newNote.trim(), addedAt: new Date().toISOString() }]
        : selected.notes;

      setSelected({ ...selected, status: statusToUpdate as any, notes: updatedNotes });
      setEnquiries((prev) =>
        prev.map((e) =>
          e.referenceId === selected.referenceId
            ? { ...e, status: statusToUpdate as any, notes: updatedNotes }
            : e
        )
      );
      setNewNote('');
    } catch (err) {
      toast({ title: 'Update failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      search === '' ||
      e.companyName.toLowerCase().includes(search.toLowerCase()) ||
      e.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.referenceId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Corporate Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            Manage enterprise, team desk clusters, private offices, and event enquiries.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEnquiries} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Corporate Leads</p>
          <p className="text-2xl font-bold mt-1">{enquiries.length}</p>
        </Card>
        <Card className="p-4 border-blue-200 bg-blue-50/30">
          <p className="text-xs text-blue-700 uppercase font-semibold">New Enquiries</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {enquiries.filter((e) => e.status === 'New Enquiry').length}
          </p>
        </Card>
        <Card className="p-4 border-purple-200 bg-purple-50/30">
          <p className="text-xs text-purple-700 uppercase font-semibold">Proposals Sent</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {enquiries.filter((e) => e.status === 'Proposal Sent').length}
          </p>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50/30">
          <p className="text-xs text-green-700 uppercase font-semibold">Closed Won</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {enquiries.filter((e) => e.status === 'Closed Won').length}
          </p>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company, contact person, phone..."
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
              <option value="all">All Corporate Statuses</option>
              {corpStatuses.map((st) => (
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
                <TableHead>Reference & Date</TableHead>
                <TableHead>Company & Contact</TableHead>
                <TableHead>Requirement & Team</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
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
                      <div className="font-bold text-sm text-foreground">{item.companyName}</div>
                      <div className="text-xs text-muted-foreground">{item.contactPerson}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-mono text-foreground hover:bg-muted"
                        >
                          <Phone className="h-2.5 w-2.5 text-accent" />
                          <span>{item.phone}</span>
                        </a>
                        <a
                          href={getWhatsAppUrl(`Hi ${item.contactPerson}, this is 9to5 Workspace regarding your corporate proposal for ${item.companyName}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-200"
                        >
                          <WhatsAppIcon className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs font-medium text-foreground">{item.requirementType}</div>
                      <div className="text-[11px] text-muted-foreground">{item.teamSize}</div>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">{item.locationName}</div>
                    </TableCell>

                    <TableCell>
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}>
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
                    No corporate enquiries found.
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
                <span>Corporate Lead: {selected.companyName}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${statusColors[selected.status]}`}>
                  {selected.status}
                </span>
              </DialogTitle>
              <DialogDescription>Reference: {selected.referenceId}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs sm:text-sm py-2">
              <div className="rounded-xl border bg-secondary/20 p-3.5 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Contact Person:</strong> {selected.contactPerson}</div>
                  <div><strong>Phone:</strong> {selected.phone}</div>
                  <div><strong>Work Email:</strong> {selected.email}</div>
                  <div><strong>Team Size:</strong> {selected.teamSize}</div>
                  <div><strong>Location:</strong> {selected.locationName}</div>
                  <div><strong>Requirement:</strong> {selected.requirementType}</div>
                  <div><strong>Target Start:</strong> {selected.targetStartDate || 'Immediate'}</div>
                </div>
                {selected.message && (
                  <div className="border-t pt-2 mt-2">
                    <p className="font-semibold text-foreground">Specific Requirements:</p>
                    <p className="text-muted-foreground mt-0.5 italic">"{selected.message}"</p>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground">Update Lead Status:</label>
                <select
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                >
                  {corpStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Internal Notes Timeline */}
              <div className="space-y-2">
                <label className="font-semibold text-xs text-foreground">Internal Notes Timeline:</label>
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
                  <p className="text-xs text-muted-foreground italic">No internal notes added yet.</p>
                )}

                <Input
                  placeholder="Add note (e.g. sent quote for 10 seats at The Banyan, follow up Thursday)..."
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
