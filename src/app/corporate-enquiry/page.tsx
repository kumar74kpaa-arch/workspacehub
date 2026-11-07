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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CONTACT_CONFIG, getWhatsAppUrl } from '@/lib/contact-config';
import { trackEvent } from '@/lib/analytics';
import { WhatsAppIcon } from '@/components/contact/floating-contact';
import {
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  FileCheck2,
  Phone,
  ArrowRight,
  ShieldCheck,
  Video,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function CorporateEnquiryPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    teamSize: '6-10 people',
    location: 'all',
    requirementType: 'Dedicated workstations',
    targetStartDate: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.companyName.trim()) {
      setErrorMsg('Please enter your company or organization name.');
      return;
    }
    if (!formData.contactPerson.trim()) {
      setErrorMsg('Please enter the contact person name.');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/corporate-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSubmittedRef(data.referenceId);
      trackEvent('corporate_enquiry_submit', {
        label: formData.requirementType,
        teamSize: formData.teamSize,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting form. Please reach us via WhatsApp or call.');
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
            <div className="space-y-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
                <Briefcase className="h-3.5 w-3.5" />
                Custom Solutions for Companies & Growing Teams
              </span>
              <h1 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                Corporate & Team Workspaces in South Delhi
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Whether you need dedicated desk clusters, private project offices, executive conference rooms, or multi-day training venues, 9to5 Workspace provides hassle-free solutions with GST invoicing.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Form & Value Proposition */}
        <section className="py-12 md:py-20">
          <div className="container max-w-5xl">
            {submittedRef ? (
              /* Success Confirmation */
              <Card className="mx-auto max-w-2xl border-emerald-200 bg-emerald-50/40 p-6 md:p-10 text-center shadow-lg animate-in fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold font-headline text-foreground">
                  Corporate Proposal Request Received!
                </h2>
                <div className="my-4 inline-block rounded-lg border border-emerald-300 bg-white px-4 py-2 font-mono text-sm font-semibold text-emerald-800">
                  Reference ID: {submittedRef}
                </div>
                <div className="mx-auto max-w-lg space-y-3 text-sm text-muted-foreground text-left bg-white/70 p-4 rounded-xl border border-border">
                  <p className="font-semibold text-foreground">Next Steps for Your Organization:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
                    <li>Our corporate accounts manager will review your requirement ({formData.teamSize}, {formData.requirementType}).</li>
                    <li>We will share custom pricing, floor plans, and schedule an on-site inspection for your leadership team.</li>
                    <li>For immediate quote inquiries, you can message our business WhatsApp directly.</li>
                  </ul>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppUrl(`Hi, I just submitted corporate enquiry reference ${submittedRef} for ${formData.companyName}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#20ba5a] transition w-full sm:w-auto"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>Connect on WhatsApp Now</span>
                  </a>
                  <Button asChild variant="outline" className="rounded-full w-full sm:w-auto text-xs sm:text-sm">
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Form Column */}
                <div className="lg:col-span-7">
                  <Card className="border-border shadow-md">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-bold">Request a Custom Team Proposal</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Tell us about your team size and workspace requirements. We respond within 24 hours.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && (
                          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errorMsg}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="companyName" className="text-xs font-semibold">
                              Company / Organization *
                            </Label>
                            <Input
                              id="companyName"
                              required
                              placeholder="e.g. Acme Technologies Pvt Ltd"
                              value={formData.companyName}
                              onChange={(e) => handleInputChange('companyName', e.target.value)}
                              className="text-sm"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="contactPerson" className="text-xs font-semibold">
                              Contact Person *
                            </Label>
                            <Input
                              id="contactPerson"
                              required
                              placeholder="e.g. Priya Sundaram"
                              value={formData.contactPerson}
                              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="corp-phone" className="text-xs font-semibold">
                              Mobile Number *
                            </Label>
                            <div className="flex gap-2">
                              <span className="flex items-center rounded-md border border-input bg-muted px-3 text-xs font-semibold text-muted-foreground">
                                +91
                              </span>
                              <Input
                                id="corp-phone"
                                type="tel"
                                required
                                placeholder="88003 37608"
                                maxLength={10}
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="corp-email" className="text-xs font-semibold">
                              Work Email *
                            </Label>
                            <Input
                              id="corp-email"
                              type="email"
                              required
                              placeholder="priya@acme.com"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="teamSize" className="text-xs font-semibold">
                              Team Size *
                            </Label>
                            <select
                              id="teamSize"
                              value={formData.teamSize}
                              onChange={(e) => handleInputChange('teamSize', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                            >
                              <option value="1-5 people">1–5 people</option>
                              <option value="6-10 people">6–10 people</option>
                              <option value="11-20 people">11–20 people</option>
                              <option value="20+ people">20+ people</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="corp-location" className="text-xs font-semibold">
                              Preferred Location *
                            </Label>
                            <select
                              id="corp-location"
                              value={formData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                            >
                              <option value="all">Flexible / Open to Both</option>
                              <option value="banyan">The Banyan (National Park, Lajpat Nagar)</option>
                              <option value="olive">The Olive (Vikram Vihar, Lajpat Nagar 4)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="requirementType" className="text-xs font-semibold">
                              Requirement Type *
                            </Label>
                            <select
                              id="requirementType"
                              value={formData.requirementType}
                              onChange={(e) => handleInputChange('requirementType', e.target.value)}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                            >
                              <option value="Dedicated workstations">Dedicated workstations</option>
                              <option value="Private office / Cabin">Private office / Cabin</option>
                              <option value="Meeting room (4-6 pax)">Meeting room (4-6 pax)</option>
                              <option value="Conference room (9-12 pax)">Conference room (9-12 pax)</option>
                              <option value="Training or corporate event">Training or corporate event</option>
                              <option value="Long-term custom workspace">Long-term custom workspace</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="targetStartDate" className="text-xs font-semibold">
                              Target Move-in / Date
                            </Label>
                            <Input
                              id="targetStartDate"
                              type="date"
                              value={formData.targetStartDate}
                              onChange={(e) => handleInputChange('targetStartDate', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="corp-message" className="text-xs font-semibold">
                            Specific Requirements or Timeline Details
                          </Label>
                          <Textarea
                            id="corp-message"
                            rows={3}
                            placeholder="Tell us about your work hours, IT requirements, or any specific amenities needed..."
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            className="text-sm resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-sm shadow-md"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting Corporate Request...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <span>Submit Corporate Enquiry</span>
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Corporate Benefits Column */}
                <div className="lg:col-span-5 space-y-6">
                  <Card className="border-border p-6 space-y-4">
                    <h3 className="text-base font-bold font-headline text-foreground">
                      Why Businesses Choose 9to5
                    </h3>
                    <div className="space-y-3.5 text-xs text-muted-foreground">
                      <div className="flex items-start gap-3">
                        <FileCheck2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">Tax Invoicing & GST:</strong> Transparent agreements with 100% compliant tax invoices for your finance team.
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Video className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">Conference & Video Facilities:</strong> 12-seater conference halls with display monitors, video conferencing, and whiteboards.
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">Zero Overhead:</strong> High-speed optical fiber internet, professional daily sanitization, power backup, and climate control are all inclusive.
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground">South Delhi Proximity:</strong> 5-minute walk from Moolchand Metro Station for effortless commuting by your team and clients.
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Direct Contact Card */}
                  <Card className="p-5 border-border bg-secondary/30 text-center space-y-3">
                    <p className="text-xs font-semibold text-foreground">Need an immediate proposal or customized RFP?</p>
                    <a
                      href={getWhatsAppUrl("Hi, I'd like to discuss a corporate workspace requirement for my company.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-[#20ba5a] transition"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      <span>Chat with Corporate Accounts</span>
                    </a>
                    <p className="text-[11px] text-muted-foreground">
                      Direct phone: <a href={`tel:${CONTACT_CONFIG.primaryPhone}`} className="underline font-medium text-foreground">{CONTACT_CONFIG.primaryPhoneDisplay}</a>
                    </p>
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
