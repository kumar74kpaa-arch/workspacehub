'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Compass,
  Phone,
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  FileText,
  User,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

export interface TourEnquiry {
  id?: string;
  referenceId: string;
  fullName: string;
  phone: string;
  email?: string;
  location: string;
  locationName: string;
  preferredDate: string;
  preferredTime: string;
  spaceInterest: string;
  message?: string;
  marketingConsent?: boolean;
  status: 'New Enquiry' | 'Contacted' | 'Tour Scheduled' | 'Tour Completed' | 'Converted' | 'Not Interested';
  createdAt: string;
  notes?: { text: string; addedAt: string }[];
}

const statusColorMap: Record<string, string> = {
  'New Enquiry': 'bg-blue-100 text-blue-800 border-blue-200',
  'Contacted': 'bg-amber-100 text-amber-800 border-amber-200',
  'Tour Scheduled': 'bg-purple-100 text-purple-800 border-purple-200',
  'Tour Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Converted': 'bg-green-100 text-green-800 border-green-300 font-semibold',
  'Not Interested': 'bg-gray-100 text-gray-700 border-gray-200',
};

const allStatuses = [
  'New Enquiry',
  'Contacted',
  'Tour Scheduled',
  'Tour Completed',
  'Converted',
  'Not Interested',
] as const;

export default function AdminTourEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<TourEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState<TourEnquiry | null>(null);
  const [newNote, setNewNote] = useState('');
  const [statusToUpdate, setStatusToUpdate] = useState<string>('');
  const [savingUpdate, setSavingUpdate] = useState(false);
  const { toast } = useToast();

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tour-enquiries');
      const data = await res.json();
      if (data.enquiries) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error('Error loading enquiries:', err);
      toast({
        title: 'Error loading tour enquiries',
        description: 'Failed to fetch enquiries. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleOpenDetails = (enquiry: TourEnquiry) => {
    setSelectedEnquiry(enquiry);
    setStatusToUpdate(enquiry.status);
    setNewNote('');
  };

  const handleSaveUpdate = async () => {
    if (!selectedEnquiry) return;
    setSavingUpdate(true);
    try {
      const res = await fetch('/api/admin/tour-enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId: selectedEnquiry.referenceId,
          status: statusToUpdate !== selectedEnquiry.status ? statusToUpdate : undefined,
          note: newNote.trim().length > 0 ? newNote.trim() : undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to update enquiry');

      toast({
        title: 'Enquiry Updated',
        description: `Successfully updated reference ${selectedEnquiry.referenceId}`,
      });

      // Update local state
      const updatedNotes = newNote.trim().length > 0
        ? [...(selectedEnquiry.notes || []), { text: newNote.trim(), addedAt: new Date().toISOString() }]
        : selectedEnquiry.notes;

      setSelectedEnquiry({
        ...selectedEnquiry,
        status: statusToUpdate as any,
        notes: updatedNotes,
      });

      setEnquiries((prev) =>
        prev.map((e) =>
          e.referenceId === selectedEnquiry.referenceId
            ? { ...e, status: statusToUpdate as any, notes: updatedNotes }
            : e
        )
      );

      setNewNote('');
    } catch (err) {
      toast({
        title: 'Update failed',
        description: 'Could not update tour enquiry. Please check connection.',
        variant: 'destructive',
      });
    } finally {
      setSavingUpdate(false);
    }
  };

  // Filtered list
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      searchQuery === '' ||
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery) ||
      e.referenceId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || e.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const countNew = enquiries.filter((e) => e.status === 'New Enquiry').length;
  const countScheduled = enquiries.filter((e) => e.status === 'Tour Scheduled').length;
  const countConverted = enquiries.filter((e) => e.status === 'Converted').length;

  return (
    <div className="space-y-6">
      {/* Header and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tour Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            Manage incoming prospective visitor tours, coordinate scheduling, and follow up.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEnquiries} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Total Received</p>
          <p className="text-2xl font-bold mt-1">{enquiries.length}</p>
        </Card>
        <Card className="p-4 border-blue-200 bg-blue-50/30">
          <p className="text-xs text-blue-700 uppercase font-semibold">New Enquiries</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{countNew}</p>
        </Card>
        <Card className="p-4 border-purple-200 bg-purple-50/30">
          <p className="text-xs text-purple-700 uppercase font-semibold">Tours Scheduled</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{countScheduled}</p>
        </Card>
        <Card className="p-4 border-green-200 bg-green-50/30">
          <p className="text-xs text-green-700 uppercase font-semibold">Converted</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{countConverted}</p>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or reference ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs sm:text-sm"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Statuses</option>
              {allStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">All Locations</option>
              <option value="banyan">The Banyan</option>
              <option value="olive">The Olive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference & Date</TableHead>
                <TableHead>Visitor Details</TableHead>
                <TableHead>Location & Space</TableHead>
                <TableHead>Requested Time</TableHead>
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
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredEnquiries.length > 0 ? (
                filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.referenceId}>
                    {/* Ref ID & Submission Time */}
                    <TableCell>
                      <div className="font-mono text-xs font-semibold">{enquiry.referenceId}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {enquiry.createdAt ? format(new Date(enquiry.createdAt), 'dd MMM yyyy, h:mm a') : 'Recent'}
                      </div>
                    </TableCell>

                    {/* Visitor Name & Direct Contact Links */}
                    <TableCell>
                      <div className="font-medium text-foreground">{enquiry.fullName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`tel:${enquiry.phone}`}
                          title="Call Visitor"
                          className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[11px] font-mono text-foreground hover:bg-muted"
                        >
                          <Phone className="h-2.5 w-2.5 text-accent" />
                          <span>{enquiry.phone}</span>
                        </a>
                        <a
                          href={getWhatsAppUrl(`Hi ${enquiry.fullName}, this is 9to5 Workspace regarding your tour enquiry (${enquiry.referenceId}).`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message on WhatsApp"
                          className="inline-flex items-center gap-1 rounded bg-emerald-100 px-1.5 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-200"
                        >
                          <WhatsAppIcon className="h-3 w-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </TableCell>

                    {/* Location & Interest */}
                    <TableCell>
                      <div className="font-medium text-xs">{enquiry.locationName}</div>
                      <div className="text-[11px] text-muted-foreground">{enquiry.spaceInterest}</div>
                    </TableCell>

                    {/* Preferred Date & Time */}
                    <TableCell>
                      <div className="text-xs font-semibold text-foreground">{enquiry.preferredDate}</div>
                      <div className="text-[11px] text-muted-foreground">{enquiry.preferredTime}</div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell>
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full border ${statusColorMap[enquiry.status] || 'bg-gray-100 text-gray-700'}`}>
                        {enquiry.status}
                      </span>
                    </TableCell>

                    {/* Action */}
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenOption(enquiry)}
                        className="text-xs"
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No tour enquiries found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details & Status Update Modal */}
      {selectedEnquiry && (
        <Dialog open={Boolean(selectedEnquiry)} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Enquiry Details: {selectedEnquiry.referenceId}</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${statusColorMap[selectedEnquiry.status]}`}>
                  {selectedEnquiry.status}
                </span>
              </DialogTitle>
              <DialogDescription>
                Submitted on {format(new Date(selectedEnquiry.createdAt), 'PPP p')}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs sm:text-sm py-2">
              {/* Contact Card */}
              <div className="rounded-xl border bg-secondary/20 p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-base">{selectedEnquiry.fullName}</span>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium hover:bg-secondary"
                    >
                      <Phone className="h-3 w-3 text-accent" />
                      <span>Call</span>
                    </a>
                    <a
                      href={getWhatsAppUrl(`Hi ${selectedEnquiry.fullName}, this is 9to5 Workspace regarding your tour enquiry (${selectedEnquiry.referenceId}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-[#25D366] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#20ba5a]"
                    >
                      <WhatsAppIcon className="h-3 w-3" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground text-xs">
                  <div><strong>Phone:</strong> {selectedEnquiry.phone}</div>
                  <div><strong>Email:</strong> {selectedEnquiry.email || 'Not provided'}</div>
                  <div><strong>Location:</strong> {selectedEnquiry.locationName}</div>
                  <div><strong>Space Interest:</strong> {selectedEnquiry.spaceInterest}</div>
                  <div><strong>Preferred Date:</strong> {selectedEnquiry.preferredDate}</div>
                  <div><strong>Preferred Time:</strong> {selectedEnquiry.preferredTime}</div>
                </div>
                {selectedEnquiry.message && (
                  <div className="border-t pt-2 mt-2">
                    <p className="font-semibold text-foreground">Visitor Note / Requirements:</p>
                    <p className="text-muted-foreground mt-0.5 italic">"{selectedEnquiry.message}"</p>
                  </div>
                )}
              </div>

              {/* Status Update Control */}
              <div className="space-y-1.5">
                <label className="font-semibold text-xs text-foreground">Update Enquiry Status:</label>
                <select
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm shadow-sm"
                >
                  {allStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-2">
                <label className="font-semibold text-xs text-foreground">Internal Notes Timeline:</label>
                {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border p-2 bg-muted/20">
                    {selectedEnquiry.notes.map((note, idx) => (
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

                {/* Add Note Input */}
                <div className="space-y-1 pt-1">
                  <Input
                    placeholder="Add an internal note (e.g. called visitor, confirmed visit for 3 PM)..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setSelectedEnquiry(null)} className="text-xs">
                Cancel
              </Button>
              <Button onClick={handleSaveUpdate} disabled={savingUpdate} className="text-xs font-semibold">
                {savingUpdate ? 'Saving...' : 'Save Updates'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
