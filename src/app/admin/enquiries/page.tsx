'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Inbox,
  Compass,
  Briefcase,
  Mail,
  ShieldAlert,
  Star,
  Search,
  Download,
  RefreshCw,
  Phone,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';

export interface EnquiryItem {
  id: string;
  collection: string;
  formType: 'tour' | 'corporate' | 'contact' | 'grievance' | 'testimonial';
  referenceId?: string;
  ticketId?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  teamSize?: string;
  location?: string;
  preferredLocation?: string;
  preferredDate?: string;
  preferredTime?: string;
  spaceInterest?: string;
  subject?: string;
  message?: string;
  description?: string;
  category?: string;
  quote?: string;
  rating?: number;
  role?: string;
  company?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  approved?: boolean;
}

export default function AdminEnquiriesPage() {
  const auth = useAuth();
  const { toast } = useToast();

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection for Detail Modal & Notes
  const [selectedItem, setSelectedItem] = useState<EnquiryItem | null>(null);
  const [noteText, setNoteText] = useState('');
  const [statusDraft, setStatusDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      let token = '';
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('type', activeTab);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (locationFilter !== 'all') params.set('location', locationFilter);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/admin/enquiries?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error('Failed to load enquiries');
      }

      const data = await res.json();
      setEnquiries(data.enquiries || []);
      setCounts(data.counts || {});
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Error loading enquiries',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
    setCurrentPage(1);
  }, [activeTab, statusFilter, locationFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
    setCurrentPage(1);
  };

  const handleOpenDetail = (item: EnquiryItem) => {
    setSelectedItem(item);
    setNoteText(item.notes || '');
    setStatusDraft(item.status || 'new');
  };

  const handleSaveDetail = async () => {
    if (!selectedItem) return;
    setIsUpdating(true);
    try {
      let token = '';
      if (auth?.currentUser) {
        token = await auth.currentUser.getIdToken();
      }

      const res = await fetch('/api/admin/enquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id: selectedItem.id,
          collection: selectedItem.collection,
          status: statusDraft,
          notes: noteText,
        }),
      });

      if (!res.ok) throw new Error('Failed to update enquiry');

      toast({ title: 'Updated', description: 'Status and internal notes saved successfully.' });
      
      // Update local state
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === selectedItem.id ? { ...e, status: statusDraft, notes: noteText } : e
        )
      );
      setSelectedItem(null);
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: err.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      toast({ title: 'No records to export' });
      return;
    }

    const headers = [
      'Reference ID',
      'Form Type',
      'Name',
      'Email',
      'Phone',
      'Location',
      'Status',
      'Created At',
      'Details / Message',
      'Internal Notes',
    ];

    const rows = enquiries.map((item) => [
      `"${item.referenceId || item.ticketId || item.id}"`,
      `"${item.formType.toUpperCase()}"`,
      `"${item.fullName || item.name || ''}"`,
      `"${item.email || ''}"`,
      `"${item.phone || ''}"`,
      `"${item.location || item.preferredLocation || ''}"`,
      `"${item.status}"`,
      `"${item.createdAt}"`,
      `"${(item.message || item.description || item.quote || '').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `9to5-enquiries-export-${format(new Date(), 'yyyyMMdd-HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Generated', description: `Exported ${enquiries.length} records to CSV.` });
  };

  // Pagination slicing
  const totalPages = Math.ceil(enquiries.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return enquiries.slice(start, start + pageSize);
  }, [enquiries, currentPage, pageSize]);

  const getFormBadge = (type: string) => {
    switch (type) {
      case 'tour':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 text-[11px]">
            <Compass className="h-3 w-3" /> Tour Booking
          </Badge>
        );
      case 'corporate':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1 text-[11px]">
            <Briefcase className="h-3 w-3" /> Corporate enquiry
          </Badge>
        );
      case 'contact':
        return (
          <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 flex items-center gap-1 text-[11px]">
            <Mail className="h-3 w-3" /> Contact message
          </Badge>
        );
      case 'grievance':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1 text-[11px]">
            <ShieldAlert className="h-3 w-3" /> Grievance (DPDP)
          </Badge>
        );
      case 'testimonial':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 text-[11px]">
            <Star className="h-3 w-3" /> Review Submission
          </Badge>
        );
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || 'new').toLowerCase();
    switch (s) {
      case 'new':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px]">New</Badge>;
      case 'contacted':
        return <Badge className="bg-sky-600 hover:bg-sky-700 text-white text-[11px]">Contacted</Badge>;
      case 'follow-up':
      case 'followup':
        return <Badge className="bg-amber-600 hover:bg-amber-700 text-white text-[11px]">Follow-up</Badge>;
      case 'converted':
        return <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[11px]">Converted</Badge>;
      case 'closed':
        return <Badge variant="outline" className="text-muted-foreground text-[11px]">Closed</Badge>;
      default:
        return <Badge variant="outline" className="text-[11px] capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Inbox className="h-7 w-7 text-primary" />
            Enquiries & Forms Inbox
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consolidated inbox for tour requests, corporate leads, contact inquiries, testimonials, and DPDP grievances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchEnquiries}
            disabled={loading}
            className="text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs bg-primary"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground shadow-xs">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Submissions</span>
          <div className="text-2xl font-bold font-mono mt-1">{counts.total ?? 0}</div>
        </div>
        <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground shadow-xs">
          <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Needs Attention</span>
          <div className="text-2xl font-bold font-mono mt-1 text-emerald-600">{counts.new ?? 0}</div>
        </div>
        <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground shadow-xs">
          <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">Tour Bookings</span>
          <div className="text-2xl font-bold font-mono mt-1">{counts.tours ?? 0}</div>
        </div>
        <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground shadow-xs">
          <span className="text-[11px] font-medium text-purple-600 uppercase tracking-wider">Corporate Leads</span>
          <div className="text-2xl font-bold font-mono mt-1">{counts.corporate ?? 0}</div>
        </div>
        <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground shadow-xs">
          <span className="text-[11px] font-medium text-cyan-600 uppercase tracking-wider">Contact Messages</span>
          <div className="text-2xl font-bold font-mono mt-1">{counts.contact ?? 0}</div>
        </div>
        <div className="p-3.5 rounded-lg border border-border bg-card text-card-foreground shadow-xs">
          <span className="text-[11px] font-medium text-red-600 uppercase tracking-wider">Grievances (DPDP)</span>
          <div className="text-2xl font-bold font-mono mt-1">{counts.grievances ?? 0}</div>
        </div>
      </div>

      {/* Filters and Navigation Tabs */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 h-auto p-1 bg-muted/60">
              <TabsTrigger value="all" className="text-xs py-1.5">All Forms</TabsTrigger>
              <TabsTrigger value="tour" className="text-xs py-1.5">Tours</TabsTrigger>
              <TabsTrigger value="corporate" className="text-xs py-1.5">Corporate</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs py-1.5">Messages</TabsTrigger>
              <TabsTrigger value="grievance" className="text-xs py-1.5">Grievances</TabsTrigger>
              <TabsTrigger value="testimonial" className="text-xs py-1.5">Testimonials</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, company, or reference ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 w-full"
              />
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] text-xs h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[140px] text-xs h-9">
                  <SelectValue placeholder="Centre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Centres</SelectItem>
                  <SelectItem value="banyan">The Banyan</SelectItem>
                  <SelectItem value="olive">The Olive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Table / Cards List */}
      <Card className="border-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-3">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span>Loading submissions...</span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Inbox className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-medium text-foreground">No submissions found</p>
            <p className="text-xs mt-1">Try clearing your search query or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paginatedItems.map((item) => {
              const displayName = item.fullName || item.name || 'Anonymous';
              const displayContact = item.email || item.phone || 'No contact provided';
              const isGrievance = item.formType === 'grievance';
              const ref = item.referenceId || item.ticketId || item.id.slice(0, 8);
              const summaryText = item.message || item.description || item.quote || item.subject || 'No message provided';

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 hover:bg-muted/30 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {getFormBadge(item.formType)}
                      {getStatusBadge(item.status)}
                      <span className="font-mono text-[11px] text-muted-foreground">
                        #{ref}
                      </span>
                      {isGrievance && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded font-medium">
                          <Lock className="h-2.5 w-2.5" /> Confidential
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {displayName}
                      </h3>
                      {item.companyName && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building className="h-3 w-3" /> {item.companyName}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                        {item.phone && <Phone className="h-3 w-3 inline text-primary/70" />}
                        {displayContact}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 pr-4">
                      {summaryText}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/80 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.createdAt ? format(new Date(item.createdAt), 'MMM d, yyyy h:mm a') : 'Recent'}
                      </span>
                      {(item.location || item.preferredLocation) && (
                        <span>• Centre: <strong className="font-medium text-foreground">{item.location || item.preferredLocation}</strong></span>
                      )}
                      {item.teamSize && (
                        <span>• Team: <strong className="font-medium text-foreground">{item.teamSize} pax</strong></span>
                      )}
                      {item.preferredDate && (
                        <span>• Tour Date: <strong className="font-medium text-foreground">{item.preferredDate} ({item.preferredTime || 'Morning'})</strong></span>
                      )}
                      {item.notes && (
                        <span className="text-primary font-medium">• Internal Note attached</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleOpenDetail(item)}
                    >
                      View & Manage
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {enquiries.length > pageSize && (
          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, enquiries.length)} of {enquiries.length} submissions
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="font-mono px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Details & Action Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {getFormBadge(selectedItem.formType)}
                <span className="font-mono text-xs text-muted-foreground">
                  Ref: {selectedItem.referenceId || selectedItem.ticketId || selectedItem.id}
                </span>
              </div>
              <DialogTitle className="text-xl font-headline">
                {selectedItem.fullName || selectedItem.name || 'Submission Details'}
              </DialogTitle>
              <DialogDescription>
                Submitted on {selectedItem.createdAt ? format(new Date(selectedItem.createdAt), 'EEEE, MMMM d, yyyy at h:mm a') : 'N/A'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              {/* Submission Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-muted/40 border border-border text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Contact Email</span>
                  <a href={`mailto:${selectedItem.email}`} className="text-primary hover:underline font-medium break-all">
                    {selectedItem.email || 'N/A'}
                  </a>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-bold">Phone Number</span>
                  <a href={`tel:${selectedItem.phone}`} className="text-primary hover:underline font-mono font-medium">
                    {selectedItem.phone || 'N/A'}
                  </a>
                </div>
                {selectedItem.companyName && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Company / Organization</span>
                    <span className="font-medium text-foreground">{selectedItem.companyName}</span>
                  </div>
                )}
                {selectedItem.teamSize && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Required Seats / Team Size</span>
                    <span className="font-medium text-foreground">{selectedItem.teamSize} Members</span>
                  </div>
                )}
                {(selectedItem.location || selectedItem.preferredLocation) && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Preferred Location</span>
                    <span className="font-medium text-foreground capitalize">{selectedItem.location || selectedItem.preferredLocation}</span>
                  </div>
                )}
                {selectedItem.preferredDate && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Preferred Tour Date & Time</span>
                    <span className="font-medium text-foreground">{selectedItem.preferredDate} ({selectedItem.preferredTime || 'Morning'})</span>
                  </div>
                )}
                {selectedItem.category && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Grievance Category</span>
                    <span className="font-medium text-foreground">{selectedItem.category}</span>
                  </div>
                )}
              </div>

              {/* Message / Content */}
              <div>
                <Label className="text-xs font-semibold uppercase text-muted-foreground">Submission Message / Content</Label>
                <div className="mt-1.5 p-3 rounded-md bg-background border border-border text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedItem.message || selectedItem.description || selectedItem.quote || 'No message provided.'}
                </div>
              </div>

              {/* Status Updater */}
              <div className="space-y-1.5">
                <Label htmlFor="statusSelect" className="text-xs font-semibold">Lead Status</Label>
                <Select value={statusDraft} onValueChange={setStatusDraft}>
                  <SelectTrigger id="statusSelect" className="h-9 text-xs">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New (Needs Outreach)</SelectItem>
                    <SelectItem value="contacted">Contacted (WhatsApp/Call/Email sent)</SelectItem>
                    <SelectItem value="followup">Follow-up Required</SelectItem>
                    <SelectItem value="converted">Converted (Booked/Joined)</SelectItem>
                    <SelectItem value="closed">Closed / Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="adminNotes" className="text-xs font-semibold">Internal Admin Notes (Private)</Label>
                <Textarea
                  id="adminNotes"
                  rows={3}
                  placeholder="Record call summary, pricing discussed, next follow-up date, or specific requirements..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="text-xs"
                />
              </div>

              {/* Grievance Privacy Caution */}
              {selectedItem.formType === 'grievance' && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-700 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    DPDP Act 2023 Confidentiality Standard
                  </div>
                  <p>
                    This grievance request is strictly protected under Indian Digital Personal Data Protection laws. Resolutions must be logged by the designated Grievance Officer within 30 days.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
                disabled={isUpdating}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveDetail}
                disabled={isUpdating}
                className="text-xs bg-primary"
              >
                {isUpdating ? 'Saving Changes...' : 'Save Notes & Status'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
