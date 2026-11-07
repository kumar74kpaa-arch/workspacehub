'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CONTACT_CONFIG, getWhatsAppUrl } from '@/lib/contact-config';
import { trackEvent } from '@/lib/analytics';
import { WhatsAppIcon } from '@/components/contact/floating-contact';
import {
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Coffee,
  Wifi,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function BookTourPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: 'banyan', // banyan | olive | flexible
    preferredDate: '',
    preferredTime: 'Morning (10:00 AM – 12:00 PM)',
    spaceInterest: 'Workstation',
    message: '',
    marketingConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Calculate minimum date: today
  const todayStr = new Date().toISOString().split('T')[0];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.preferredDate) {
      setErrorMsg('Please select your preferred visit date.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/tour-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSubmittedRef(data.referenceId);
      trackEvent('free_tour_submit', {
        location: formData.location as any,
        label: formData.spaceInterest,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again or chat via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Banner */}
        <section className="relative border-b border-border/80 bg-secondary/30 py-12 md:py-16">
          <div className="container max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="space-y-3 text-center md:text-left max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
                  <Compass className="h-3.5 w-3.5" />
                  No Commitment • 100% Free Guided Walkthrough
                </span>
                <h1 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                  Book a Free Tour of 9to5 Workspace
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Experience our calm, quiet work environment in South Delhi before deciding. Inspect ergonomic desks, private meeting rooms, conference technology, and high-speed internet in person.
                </p>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm text-center shrink-0 w-full sm:w-auto">
                <p className="text-xs text-muted-foreground mb-2">Want to visit today within an hour?</p>
                <a
                  href={getWhatsAppUrl("Hi, I'd like to do a quick walk-in tour of 9to5 Workspace today.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20ba5a] transition"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Instant WhatsApp Tour Request</span>
                </a>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Or call: <a href={`tel:${CONTACT_CONFIG.primaryPhone}`} className="underline font-medium text-foreground">{CONTACT_CONFIG.primaryPhoneDisplay}</a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form and Details Grid */}
        <section className="py-12 md:py-20">
          <div className="container max-w-5xl">
            {submittedRef ? (
              /* Success Confirmation Card */
              <Card className="mx-auto max-w-2xl border-emerald-200 bg-emerald-50/40 p-6 md:p-10 text-center shadow-lg animate-in fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold font-headline text-foreground">
                  Tour Enquiry Received!
                </h2>
                <div className="my-4 inline-block rounded-lg border border-emerald-300 bg-white px-4 py-2 font-mono text-sm font-semibold text-emerald-800">
                  Enquiry Reference: {submittedRef}
                </div>
                <div className="mx-auto max-w-lg space-y-3 text-sm text-muted-foreground text-left bg-white/70 p-4 rounded-xl border border-border">
                  <p className="font-semibold text-foreground">What happens next?</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>
                      <strong>Staff Confirmation:</strong> A community manager will contact you via WhatsApp or phone ({formData.phone}) to confirm the exact visit time and share directions.
                    </li>
                    <li>
                      <strong>Please note:</strong> Your tour is not confirmed until a staff member has verified availability for your slot.
                    </li>
                    <li>
                      <strong>Arrival:</strong> Reception staff will welcome you, show you the workspace amenities, and answer any pricing questions.
                    </li>
                  </ul>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppUrl(`Hi, I just submitted tour enquiry reference ${submittedRef}. Could we confirm the time?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#20ba5a] transition w-full sm:w-auto"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>Confirm via WhatsApp Now</span>
                  </a>
                  <Button asChild variant="outline" className="rounded-full w-full sm:w-auto text-xs sm:text-sm">
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              /* Two-Column Form & What to Expect */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Form Column */}
                <div className="lg:col-span-7">
                  <Card className="border-border shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold">Schedule Your Visit</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Fill in your details below. We do not require registration or credit card details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {errorMsg && (
                          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errorMsg}</span>
                          </div>
                        )}

                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <Label htmlFor="fullName" className="text-xs font-semibold">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-xs font-semibold">
                            Mobile Number (WhatsApp Enabled) <span className="text-destructive">*</span>
                          </Label>
                          <div className="flex gap-2">
                            <span className="flex items-center rounded-md border border-input bg-muted px-3 text-xs font-semibold text-muted-foreground">
                              +91
                            </span>
                            <Input
                              id="phone"
                              type="tel"
                              required
                              placeholder="98100 21209"
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            We use this only to coordinate your tour and share location directions.
                          </p>
                        </div>

                        {/* Email (Optional) */}
                        <div className="space-y-1.5">
                          <Label htmlFor="email" className="text-xs font-semibold">
                            Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="rahul@company.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        {/* Preferred Location */}
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold">
                            Preferred Location <span className="text-destructive">*</span>
                          </Label>
                          <RadioGroup
                            value={formData.location}
                            onValueChange={(val) => handleInputChange('location', val)}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                          >
                            <label
                              htmlFor="loc-banyan"
                              className={`flex flex-col p-3 rounded-xl border text-left cursor-pointer transition ${
                                formData.location === 'banyan'
                                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                                  : 'border-border hover:bg-secondary/40'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm">The Banyan</span>
                                <RadioGroupItem value="banyan" id="loc-banyan" />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                86, National Park, Lajpat Nagar (Near Moolchand)
                              </span>
                            </label>

                            <label
                              htmlFor="loc-olive"
                              className={`flex flex-col p-3 rounded-xl border text-left cursor-pointer transition ${
                                formData.location === 'olive'
                                  ? 'border-accent bg-accent/5 ring-1 ring-accent'
                                  : 'border-border hover:bg-secondary/40'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm">The Olive</span>
                                <RadioGroupItem value="olive" id="loc-olive" />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                17/109, Vikram Vihar, Lajpat Nagar 4
                              </span>
                            </label>
                          </RadioGroup>
                        </div>

                        {/* Preferred Date & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="preferredDate" className="text-xs font-semibold">
                              Preferred Visit Date <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="preferredDate"
                              type="date"
                              min={todayStr}
                              required
                              value={formData.preferredDate}
                              onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                              className="text-sm"
                            />
                            <p className="text-[11px] text-muted-foreground">Operating Mon–Sat</p>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="preferredTime" className="text-xs font-semibold">
                              Preferred Time Window <span className="text-destructive">*</span>
                            </Label>
                            <select
                              id="preferredTime"
                              value={formData.preferredTime}
                              onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
                            >
                              <option value="Morning (10:00 AM – 12:00 PM)">Morning (10:00 AM – 12:00 PM)</option>
                              <option value="Afternoon (12:00 PM – 3:00 PM)">Afternoon (12:00 PM – 3:00 PM)</option>
                              <option value="Evening (3:00 PM – 6:00 PM)">Evening (3:00 PM – 6:00 PM)</option>
                              <option value="Late Evening (6:00 PM – 7:30 PM)">Late Evening (6:00 PM – 7:30 PM)</option>
                            </select>
                          </div>
                        </div>

                        {/* Space Interest */}
                        <div className="space-y-1.5">
                          <Label htmlFor="spaceInterest" className="text-xs font-semibold">
                            Primary Space of Interest
                          </Label>
                          <select
                            id="spaceInterest"
                            value={formData.spaceInterest}
                            onChange={(e) => handleInputChange('spaceInterest', e.target.value)}
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-accent"
                          >
                            <option value="Workstation (Day / Month Pass)">Workstation (Day / Month Pass)</option>
                            <option value="Small Meeting Room (4-6 People)">Small Meeting Room (4-6 People)</option>
                            <option value="Conference Room (9-12 People)">Conference Room (9-12 People)</option>
                            <option value="Team Office Setup">Team Office Setup</option>
                            <option value="General Exploration">General Exploration</option>
                          </select>
                        </div>

                        {/* Optional Message */}
                        <div className="space-y-1.5">
                          <Label htmlFor="message" className="text-xs font-semibold">
                            Questions or Requirements <span className="text-muted-foreground font-normal">(Optional)</span>
                          </Label>
                          <Textarea
                            id="message"
                            rows={3}
                            placeholder="Tell us about your team size, work hours, or any specific amenities you need..."
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="text-sm resize-none"
                          />
                        </div>

                        {/* Separate Optional Marketing Consent */}
                        <div className="flex items-start gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="marketingConsent"
                            checked={formData.marketingConsent}
                            onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                            className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-accent focus:ring-accent"
                          />
                          <Label htmlFor="marketingConsent" className="text-[11px] text-muted-foreground font-normal leading-tight">
                            (Optional) Keep me informed about special launch discounts, monthly membership offers, and workspace events.
                          </Label>
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-sm shadow-md transition"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting Tour Request...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span>Request Free Tour</span>
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          )}
                        </Button>

                        <p className="text-[11px] text-center text-muted-foreground">
                          By submitting, you agree to our{' '}
                          <Link href="/privacy-and-data-protection" className="underline hover:text-foreground">
                            Privacy Policy
                          </Link>
                          . We never sell your contact details.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Column: What to Expect & Location Details */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Real Layout Photography Card */}
                  <Card className="overflow-hidden border-border">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/layouts/5.jpg"
                        alt="The Banyan Workspace Interior"
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 text-white">
                        <p className="text-xs uppercase tracking-wider text-accent font-semibold">Real Workspace Photos</p>
                        <p className="text-base font-bold font-headline">Distraction-Free Environment</p>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span><strong>100% Focused Atmosphere:</strong> Professional coworking free from noisy cafe chatter or random interruptions.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Wifi className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span><strong>High-Speed Fiber WiFi:</strong> Test internet speeds on your own laptop during your tour.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Coffee className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span><strong>Pantry & Refreshments:</strong> Premium tea, coffee, and RO filtered water.</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span><strong>Transparent Pricing:</strong> Clear day pass and monthly rates with no hidden fees or contracts.</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Locations Summary */}
                  <Card className="p-4 border-border space-y-4">
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground">
                      Our South Delhi Locations
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="rounded-lg border border-border/70 p-3 bg-secondary/20">
                        <p className="font-semibold text-foreground">The Banyan</p>
                        <p className="text-muted-foreground mt-0.5">{CONTACT_CONFIG.locations.banyan.fullAddress}</p>
                        <p className="text-accent font-medium mt-1">🚇 {CONTACT_CONFIG.locations.banyan.metroStation}</p>
                      </div>
                      <div className="rounded-lg border border-border/70 p-3 bg-secondary/20">
                        <p className="font-semibold text-foreground">The Olive</p>
                        <p className="text-muted-foreground mt-0.5">{CONTACT_CONFIG.locations.olive.fullAddress}</p>
                        <p className="text-accent font-medium mt-1">🚇 {CONTACT_CONFIG.locations.olive.metroStation}</p>
                      </div>
                    </div>
                    <div className="pt-1">
                      <a
                        href={`tel:${CONTACT_CONFIG.primaryPhone}`}
                        className="flex items-center justify-center gap-2 w-full rounded-lg border border-border py-2 text-xs font-semibold text-foreground hover:bg-secondary transition"
                      >
                        <Phone className="h-3.5 w-3.5 text-accent" />
                        <span>Questions? Call {CONTACT_CONFIG.primaryContactName}: {CONTACT_CONFIG.primaryPhoneDisplay}</span>
                      </a>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
