'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Star, Trash2, Edit2, Check, X, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import type { Testimonial } from '@/lib/testimonials-data';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [formAuthorName, setFormAuthorName] = useState('');
  const [formAuthorRole, setFormAuthorRole] = useState('');
  const [formCompanyName, setFormCompanyName] = useState('');
  const [formLocation, setFormLocation] = useState<'banyan' | 'olive' | 'all'>('all');
  const [formRating, setFormRating] = useState('5');
  const [formQuote, setFormQuote] = useState('');
  const [formPublished, setFormPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { toast } = useToast();

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      const data = await res.json();
      if (data.testimonials) {
        setTestimonials(data.testimonials);
      }
    } catch (err) {
      toast({
        title: 'Error loading testimonials',
        description: 'Failed to retrieve testimonials list.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormAuthorName('');
    setFormAuthorRole('');
    setFormCompanyName('');
    setFormLocation('all');
    setFormRating('5');
    setFormQuote('');
    setFormPublished(false);
    setIsAddOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormAuthorName(item.authorName);
    setFormAuthorRole(item.authorRole || '');
    setFormCompanyName(item.companyName || '');
    setFormLocation(item.location);
    setFormRating(String(item.rating || 5));
    setFormQuote(item.quote);
    setFormPublished(item.published);
    setIsAddOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthorName.trim() || !formQuote.trim()) {
      toast({
        title: 'Missing required fields',
        description: 'Author Name and Review Quote are required.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      if (editingItem) {
        // Edit existing
        const res = await fetch('/api/admin/testimonials', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            authorName: formAuthorName,
            authorRole: formAuthorRole,
            companyName: formCompanyName,
            location: formLocation,
            rating: Number(formRating),
            quote: formQuote,
            published: formPublished,
          }),
        });
        if (!res.ok) throw new Error('Failed to update testimonial');
        toast({ title: 'Testimonial updated' });
      } else {
        // Create new
        const res = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorName: formAuthorName,
            authorRole: formAuthorRole,
            companyName: formCompanyName,
            location: formLocation,
            rating: Number(formRating),
            quote: formQuote,
            published: formPublished,
          }),
        });
        if (!res.ok) throw new Error('Failed to create testimonial');
        toast({ title: 'Testimonial created' });
      }

      setIsAddOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      toast({
        title: 'Operation failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentVal: boolean) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, published: !currentVal }),
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, published: !currentVal } : t))
      );
      toast({
        title: !currentVal ? 'Testimonial Published' : 'Testimonial Unpublished',
      });
    } catch (err) {
      toast({ title: 'Error toggling publish state', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast({ title: 'Testimonial deleted' });
    } catch (err) {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage genuine customer reviews, permission status, and public visibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTestimonials} className="gap-1.5">
            <RefreshCw className={loading ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
            <span>Refresh</span>
          </Button>
          <Button size="sm" onClick={handleOpenAdd} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Genuine Testimonial</span>
          </Button>
        </div>
      </div>

      {/* Trust & Policy Callout */}
      <Card className="border-amber-200 bg-amber-50/50 p-4">
        <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-900">
          <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Trust & Verification Policy</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Never invent customer names, fake reviews, or company affiliations. Only published items with express customer consent are visible on public pages. Testimonials remain unpublished by default until verified.
            </p>
          </div>
        </div>
      </Card>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))
        ) : testimonials.length > 0 ? (
          testimonials.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between border-border shadow-sm">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{item.authorName}</h3>
                    {(item.authorRole || item.companyName) && (
                      <p className="text-xs text-muted-foreground">
                        {[item.authorRole, item.companyName].filter(Boolean).join(' • ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < (item.rating || 5)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="text-xs sm:text-sm italic text-foreground/90 border-l-2 border-accent pl-3 py-1">
                  "{item.quote}"
                </blockquote>

                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="outline" className="text-[11px] capitalize">
                    Location: {item.location === 'banyan' ? 'The Banyan' : item.location === 'olive' ? 'The Olive' : 'All Spaces'}
                  </Badge>
                  {item.verifiedMember && (
                    <Badge variant="secondary" className="text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">
                      Verified Member
                    </Badge>
                  )}
                </div>
              </div>

              {/* Card Controls */}
              <div className="border-t pt-3 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.published}
                    onCheckedChange={() => handleTogglePublish(item.id, item.published)}
                    id={`pub-${item.id}`}
                  />
                  <Label htmlFor={`pub-${item.id}`} className="text-xs cursor-pointer">
                    {item.published ? (
                      <span className="text-emerald-700 font-semibold">Published</span>
                    ) : (
                      <span className="text-muted-foreground">Unpublished (Hidden)</span>
                    )}
                  </Label>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleOpenEdit(item)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 rounded-xl border border-dashed p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <Star className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-lg">No Testimonials Recorded Yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              As per instructions, 9to5 Workspace does not display simulated customer reviews. When members share genuine feedback, add them here and toggle publish when approved.
            </p>
            <Button size="sm" onClick={handleOpenAdd} className="mt-2">
              <Plus className="h-4 w-4 mr-1.5" />
              Add First Testimonial
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Testimonial' : 'Add Customer Testimonial'}</DialogTitle>
            <DialogDescription className="text-xs">
              Record genuine feedback from verified members with explicit consent.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Customer Full Name *</Label>
              <Input
                required
                placeholder="e.g. Vikram Malhotra"
                value={formAuthorName}
                onChange={(e) => setFormAuthorName(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Role / Title (Optional)</Label>
                <Input
                  placeholder="e.g. Senior Consultant"
                  value={formAuthorRole}
                  onChange={(e) => setFormAuthorRole(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company / Firm (Optional)</Label>
                <Input
                  placeholder="e.g. Apex Legal LLP"
                  value={formCompanyName}
                  onChange={(e) => setFormCompanyName(e.target.value)}
                  className="text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Location</Label>
                <select
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value as any)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                >
                  <option value="all">All / Both Locations</option>
                  <option value="banyan">The Banyan</option>
                  <option value="olive">The Olive</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Rating (Stars)</Label>
                <select
                  value={formRating}
                  onChange={(e) => setFormRating(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Very Good)</option>
                  <option value="3">3 Stars (Good)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Testimonial Quote *</Label>
              <Textarea
                required
                rows={4}
                placeholder="Paste customer's exact words about their workspace experience..."
                value={formQuote}
                onChange={(e) => setFormQuote(e.target.value)}
                className="text-xs sm:text-sm resize-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 bg-secondary/20">
              <div>
                <Label htmlFor="pub-form-toggle" className="text-xs font-semibold cursor-pointer">
                  Publish to Public Website
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  When enabled, this review will appear on the homepage.
                </p>
              </div>
              <Switch
                id="pub-form-toggle"
                checked={formPublished}
                onCheckedChange={setFormPublished}
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="text-xs font-semibold">
                {submitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
