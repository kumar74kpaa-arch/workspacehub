'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CONTACT_CONFIG, getWhatsAppUrl } from '@/lib/contact-config';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Send,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: 'banyan',
    subject: 'General Workspace Enquiry',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ referenceId: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message. Please try again.');
      }

      setSuccessResult({ referenceId: data.referenceId });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: 'banyan',
        subject: 'General Workspace Enquiry',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Header */}
        <div className="bg-muted/40 border-b border-border py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary mb-2">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
              We&apos;re Here to Help You Find Your Workspace
            </h1>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Have a question about workstations, team suites, meeting rooms, or want to schedule a visit? Reach our South Delhi workspace team directly.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Details & Office Locations */}
            <div className="lg:col-span-5 space-y-6">
              <Card className="border-border/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-headline">Direct Contact Numbers</CardTitle>
                  <CardDescription>
                    Available {CONTACT_CONFIG.operatingHours}, {CONTACT_CONFIG.operatingDays}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">{CONTACT_CONFIG.primaryContactName}</div>
                      <a href={`tel:${CONTACT_CONFIG.primaryPhone}`} className="text-primary hover:underline font-mono text-sm">
                        {CONTACT_CONFIG.primaryPhoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60">
                    <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">{CONTACT_CONFIG.secondaryContactName}</div>
                      <a href={`tel:${CONTACT_CONFIG.secondaryPhone}`} className="text-primary hover:underline font-mono text-sm">
                        {CONTACT_CONFIG.secondaryPhoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60">
                    <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">Email Inquiries</div>
                      <a href={`mailto:${CONTACT_CONFIG.email}`} className="text-primary hover:underline text-sm break-all">
                        {CONTACT_CONFIG.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/60">
                    <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-foreground">Operational Hours</div>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {CONTACT_CONFIG.operatingDays} ({CONTACT_CONFIG.operatingHours}). Closed Sundays & National Holidays.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button asChild className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white">
                      <a
                        href={getWhatsAppUrl("Hi, I'm interested in 9to5 Workspace. Could you share more information?")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp Directly
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Locations List */}
              <Card className="border-border/80 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Our Centres in Lajpat Nagar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs sm:text-sm">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-primary" />
                      {CONTACT_CONFIG.locations.banyan.name}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {CONTACT_CONFIG.locations.banyan.fullAddress}
                    </p>
                    <div className="mt-2 text-xs text-primary font-medium">
                      Metro: {CONTACT_CONFIG.locations.banyan.metroStation}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Building className="h-4 w-4 text-primary" />
                      {CONTACT_CONFIG.locations.olive.name}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {CONTACT_CONFIG.locations.olive.fullAddress}
                    </p>
                    <div className="mt-2 text-xs text-primary font-medium">
                      Metro: {CONTACT_CONFIG.locations.olive.metroStation}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7">
              <Card className="border-border/80 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below. We typically respond within 2 business hours during operating hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {successResult ? (
                    <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4">
                      <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Message Received!</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Thank you for reaching out. Your enquiry reference number is:
                        </p>
                        <div className="mt-2 inline-block px-3 py-1 font-mono font-bold text-sm bg-background border border-border rounded">
                          {successResult.referenceId}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Our workspace manager will contact you promptly at your provided phone or email.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSuccessResult(null)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {errorMessage && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            placeholder="e.g. Rahul Sharma"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="rahul@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="phone">Phone / WhatsApp Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98100 21209"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="location">Preferred Centre</Label>
                          <Select
                            value={formData.location}
                            onValueChange={(val) => setFormData({ ...formData, location: val })}
                          >
                            <SelectTrigger id="location">
                              <SelectValue placeholder="Select Centre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="banyan">The Banyan (Ring Road, Lajpat Nagar IV)</SelectItem>
                              <SelectItem value="olive">The Olive (Block B, Lajpat Nagar II)</SelectItem>
                              <SelectItem value="general">Open to either location</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="e.g. Dedicated Desk for 3 Months or Meeting Room enquiry"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message">How can we help you? *</Label>
                        <Textarea
                          id="message"
                          rows={4}
                          placeholder="Tell us about your team size, move-in timeline, desk requirements, or any questions..."
                          required
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                      </div>

                      <div className="pt-2">
                        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending Enquiry...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
