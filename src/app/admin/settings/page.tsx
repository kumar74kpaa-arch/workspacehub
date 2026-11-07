'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Building, Phone, Mail, Shield, Save, CheckCircle2 } from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact-config';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    toast({
      title: 'Settings Saved',
      description: 'Workspace configuration and notification parameters updated.',
    });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-headline font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <Settings className="h-7 w-7 text-primary" />
          Admin & Workspace Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure business details, notification routing, and DPDP compliance parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Workspace Identity */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Workspace Identity & Brand
            </CardTitle>
            <CardDescription>
              Public brand identity displayed on quotes, receipts, and search engines.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="brandName">Business Name</Label>
                <Input id="brandName" defaultValue={CONTACT_CONFIG.businessName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brandTagline">Brand Tagline</Label>
                <Input id="brandTagline" defaultValue={CONTACT_CONFIG.tagline} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="hours">Operating Hours</Label>
                <Input id="hours" defaultValue={CONTACT_CONFIG.operatingHours} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="days">Operating Days</Label>
                <Input id="days" defaultValue={CONTACT_CONFIG.operatingDays} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Numbers & Routing */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Official Contact & WhatsApp Routing
            </CardTitle>
            <CardDescription>
              Verified contact persons and official WhatsApp routing for new enquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="primaryContact">Primary Contact Person</Label>
                <Input id="primaryContact" defaultValue={CONTACT_CONFIG.primaryContactName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="primaryPhone">Primary Phone</Label>
                <Input id="primaryPhone" defaultValue={CONTACT_CONFIG.primaryPhoneDisplay} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="secondaryContact">Secondary Contact Person</Label>
                <Input id="secondaryContact" defaultValue={CONTACT_CONFIG.secondaryContactName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                <Input id="secondaryPhone" defaultValue={CONTACT_CONFIG.secondaryPhoneDisplay} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Official Business Email</Label>
              <Input id="email" defaultValue={CONTACT_CONFIG.email} />
            </div>
          </CardContent>
        </Card>

        {/* DPDP Compliance & Grievance Officer */}
        <Card className="border-border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Data Protection & Grievance Redressal Officer
            </CardTitle>
            <CardDescription>
              Designated officer under Section 12 of the Digital Personal Data Protection Act, 2023.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="officerName">Grievance Officer Name</Label>
                <Input id="officerName" defaultValue={CONTACT_CONFIG.grievanceOfficer.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="officerDesignation">Designation</Label>
                <Input id="officerDesignation" defaultValue={CONTACT_CONFIG.grievanceOfficer.designation} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="officerEmail">Grievance Officer Email</Label>
                <Input id="officerEmail" defaultValue={CONTACT_CONFIG.grievanceOfficer.email} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="officerPhone">Grievance Officer Phone</Label>
                <Input id="officerPhone" defaultValue={CONTACT_CONFIG.grievanceOfficer.phone} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-primary text-xs">
            {saved ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
