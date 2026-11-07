'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  FileText,
  Lock,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  HelpCircle,
  Scale,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function PrivacyDataProtectionPage() {
  const [grievanceForm, setGrievanceForm] = useState({
    fullName: '',
    contactInfo: '',
    bookingRef: '',
    natureOfComplaint: 'Data Privacy Request / Consent Withdrawal',
    description: '',
    preferredChannel: 'Email & WhatsApp',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!grievanceForm.fullName.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!grievanceForm.contactInfo.trim()) {
      setErrorMsg('Please provide a mobile number or email address for our response.');
      return;
    }
    if (grievanceForm.description.trim().length < 10) {
      setErrorMsg('Please provide a detailed description (minimum 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grievanceForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record grievance.');

      setSubmittedRef(data.referenceId);
      trackEvent('grievance_submit', {
        label: grievanceForm.natureOfComplaint,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Error submitting request. Please email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative border-b border-border/80 bg-secondary/30 py-12 md:py-16">
          <div className="container max-w-5xl">
            <div className="space-y-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Data Protection & Privacy Centre
              </span>
              <h1 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                Privacy, Transparency & Grievance Redressal
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                9to5 Workspace is committed to protecting the privacy of members, visitors, and corporate clients in accordance with applicable requirements under India's Digital Personal Data Protection Act, 2023 (DPDP) and relevant IT rules.
              </p>
            </div>
          </div>
        </section>

        {/* Content & Grievance Form */}
        <section className="py-12 md:py-20">
          <div className="container max-w-5xl">
            {/* Legal Advisory Notice */}
            <Card className="border-amber-200 bg-amber-50/50 p-4 mb-10">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-amber-900">
                <Scale className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Legal Notice & Ongoing Compliance</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This document outlines our operational data practices and grievance channels. As India's Digital Personal Data Protection Act rules are notified and operationalized, this policy will be periodically reviewed and updated by qualified legal counsel.
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Privacy Articles Column */}
              <div className="lg:col-span-7 space-y-8 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {/* 1. What Data We Collect */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold font-headline text-foreground flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-accent" />
                    <span>1. Information Collected Through Forms</span>
                  </h2>
                  <p className="text-muted-foreground">
                    We collect only the personal information strictly necessary to service your enquiries and bookings:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                    <li><strong>Tour Requests:</strong> Full name, mobile number (for WhatsApp/call coordination), preferred date/time, and space interest.</li>
                    <li><strong>Corporate Enquiries:</strong> Company name, contact person, work email, phone number, team size, and facility requirements.</li>
                    <li><strong>Seat Bookings:</strong> User account credentials (via Firebase Auth), workspace choice, date/slot, and transaction references via Razorpay.</li>
                    <li><strong>Grievance Records:</strong> Contact details, nature of concern, and communication logs.</li>
                  </ul>
                  <p className="text-muted-foreground">
                    We do <em>not</em> collect sensitive biometric data, banking PINs, or unnecessary background information.
                  </p>
                </div>

                {/* 2. Purpose of Collection */}
                <div className="space-y-3 border-t pt-6">
                  <h2 className="text-xl font-bold font-headline text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    <span>2. Purpose & Lawful Processing</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Your personal information is processed exclusively for:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Scheduling and conducting guided tours at The Banyan or The Olive.</li>
                    <li>Generating commercial proposals and GST tax invoices for corporate clients.</li>
                    <li>Managing active desk and conference room reservations.</li>
                    <li>Communicating critical operational updates (e.g. holiday hours, facility notices).</li>
                  </ul>
                  <p className="text-muted-foreground">
                    Optional marketing updates require separate explicit consent and can be opted out of at any time without affecting your workspace access.
                  </p>
                </div>

                {/* 3. Data Retention & Deletion */}
                <div className="space-y-3 border-t pt-6">
                  <h2 className="text-xl font-bold font-headline text-foreground flex items-center gap-2">
                    <Lock className="h-5 w-5 text-accent" />
                    <span>3. Data Retention & Your Rights</span>
                  </h2>
                  <p className="text-muted-foreground">
                    In compliance with fair processing principles:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li><strong>Right to Access & Rectification:</strong> You may request a summary of the data we hold or ask to correct inaccurate details.</li>
                    <li><strong>Right to Erasure:</strong> Prospective visitors who do not proceed to a membership may request prompt deletion of their contact details.</li>
                    <li><strong>Financial Records:</strong> Transaction logs and tax invoices are retained for the statutory period mandated under Indian tax law.</li>
                    <li><strong>Consent Withdrawal:</strong> You may withdraw consent for promotional messages at any time using the grievance form below or by replying "STOP" on WhatsApp.</li>
                  </ul>
                </div>

                {/* 4. Grievance Redressal Matrix */}
                <div className="space-y-3 border-t pt-6">
                  <h2 className="text-xl font-bold font-headline text-foreground flex items-center gap-2">
                    <Scale className="h-5 w-5 text-accent" />
                    <span>4. Grievance Officer & Contact Matrix</span>
                  </h2>
                  <p className="text-muted-foreground">
                    If you have concerns regarding data handling, consent, or service standards, you may contact our designated grievance desk:
                  </p>
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2 text-xs">
                    <p><strong>Designation:</strong> {CONTACT_CONFIG.grievanceOfficer.name}</p>
                    <p><strong>Role:</strong> {CONTACT_CONFIG.grievanceOfficer.designation}</p>
                    <p><strong>Email:</strong> {CONTACT_CONFIG.grievanceOfficer.email}</p>
                    <p><strong>Phone:</strong> {CONTACT_CONFIG.grievanceOfficer.phone}</p>
                    <p><strong>Registered Facility:</strong> {CONTACT_CONFIG.grievanceOfficer.address}</p>
                    <p className="text-muted-foreground pt-1">
                      Our team acknowledges grievances within 48 business hours and works toward resolution in accordance with statutory guidelines.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grievance Submission Form Column */}
              <div id="grievance-form" className="lg:col-span-5">
                <Card className="border-border shadow-md sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold">Privacy & Grievance Redressal Form</CardTitle>
                    <CardDescription className="text-xs">
                      Submit a formal request for data correction, erasure, consent withdrawal, or service grievance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submittedRef ? (
                      <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-6 text-center space-y-3">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                        <h3 className="font-bold text-base text-foreground">Grievance Registered</h3>
                        <p className="font-mono text-xs font-semibold bg-white px-3 py-1.5 rounded border inline-block text-emerald-800">
                          Tracking ID: {submittedRef}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your submission has been securely logged with our grievance desk. Our officer will review the matter and respond via your preferred contact channel.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSubmittedRef(null);
                            setGrievanceForm({
                              fullName: '',
                              contactInfo: '',
                              bookingRef: '',
                              natureOfComplaint: 'Data Privacy Request / Consent Withdrawal',
                              description: '',
                              preferredChannel: 'Email & WhatsApp',
                            });
                          }}
                          className="text-xs mt-2"
                        >
                          Submit Another Request
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && (
                          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{errorMsg}</span>
                          </div>
                        )}

                        <div className="space-y-1">
                          <Label htmlFor="grv-name" className="text-xs font-semibold">
                            Full Name *
                          </Label>
                          <Input
                            id="grv-name"
                            required
                            placeholder="Your full legal name"
                            value={grievanceForm.fullName}
                            onChange={(e) =>
                              setGrievanceForm((prev) => ({ ...prev, fullName: e.target.value }))
                            }
                            className="text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="grv-contact" className="text-xs font-semibold">
                            Registered Phone or Email *
                          </Label>
                          <Input
                            id="grv-contact"
                            required
                            placeholder="e.g. 9810021209 or user@email.com"
                            value={grievanceForm.contactInfo}
                            onChange={(e) =>
                              setGrievanceForm((prev) => ({ ...prev, contactInfo: e.target.value }))
                            }
                            className="text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="grv-nature" className="text-xs font-semibold">
                            Nature of Request *
                          </Label>
                          <select
                            id="grv-nature"
                            value={grievanceForm.natureOfComplaint}
                            onChange={(e) =>
                              setGrievanceForm((prev) => ({ ...prev, natureOfComplaint: e.target.value }))
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                          >
                            <option value="Data Privacy Request / Consent Withdrawal">Data Privacy / Consent Withdrawal</option>
                            <option value="Data Correction or Deletion Request">Data Correction or Deletion Request</option>
                            <option value="Booking & Payment Issue">Booking & Payment Issue</option>
                            <option value="Space, Facility or Amenity Concern">Space, Facility or Amenity Concern</option>
                            <option value="General Grievance">General Grievance</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="grv-ref" className="text-xs font-semibold">
                            Booking / Tour Reference (Optional)
                          </Label>
                          <Input
                            id="grv-ref"
                            placeholder="e.g. TOUR-20261104-XXXX"
                            value={grievanceForm.bookingRef}
                            onChange={(e) =>
                              setGrievanceForm((prev) => ({ ...prev, bookingRef: e.target.value }))
                            }
                            className="text-xs sm:text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="grv-desc" className="text-xs font-semibold">
                            Description of Grievance *
                          </Label>
                          <Textarea
                            id="grv-desc"
                            required
                            rows={4}
                            placeholder="Please describe the issue, specific dates, or specific data to be corrected/erased..."
                            value={grievanceForm.description}
                            onChange={(e) =>
                              setGrievanceForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className="text-xs sm:text-sm resize-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="grv-channel" className="text-xs font-semibold">
                            Preferred Response Method
                          </Label>
                          <select
                            id="grv-channel"
                            value={grievanceForm.preferredChannel}
                            onChange={(e) =>
                              setGrievanceForm((prev) => ({ ...prev, preferredChannel: e.target.value }))
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                          >
                            <option value="Email & WhatsApp">Email & WhatsApp</option>
                            <option value="Phone Call Only">Phone Call Only</option>
                            <option value="Email Only">Email Only</option>
                          </select>
                        </div>

                        <Button
                          type="submit"
                          disabled={submitting}
                          className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-5 text-xs sm:text-sm shadow"
                        >
                          {submitting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Recording Grievance...
                            </span>
                          ) : (
                            <span>Submit Formal Grievance</span>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
