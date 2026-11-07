'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, ArrowRight, Compass, Building2, Calendar, FileText, BookOpen, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/logo';
import { UserNav } from './dashboard/user-nav';
import { Button } from '@/components/ui/button';
import { CONTACT_CONFIG, getWhatsAppUrl } from '@/lib/contact-config';
import { trackEvent } from '@/lib/analytics';
import { WhatsAppIcon } from '@/components/contact/floating-contact';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCallClick = () => {
    trackEvent('phone_click', {
      channel: 'header',
      label: CONTACT_CONFIG.primaryContactName,
    });
  };

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_click', {
      channel: 'header_button',
      label: 'header_general',
    });
  };

  const navLinks = [
    { href: '/locations', label: 'Locations' },
    { href: '/spaces', label: 'Spaces' },
    { href: '/prices', label: 'Prices' },
    { href: '/corporate-enquiry', label: 'Corporate' },
    { href: '/journal', label: 'Journal' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Top micro-bar for direct contact & hours */}
      <div className="hidden border-b border-border/40 bg-secondary/30 py-1 sm:block">
        <div className="container flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>South Delhi Coworking • Open {CONTACT_CONFIG.operatingHours} (Mon–Sat)</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${CONTACT_CONFIG.primaryPhone}`}
              onClick={handleCallClick}
              className="flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-accent"
            >
              <Phone className="h-3 w-3 text-accent" />
              <span>Call: {CONTACT_CONFIG.primaryPhoneDisplay}</span>
            </a>
            <span className="text-border">|</span>
            <a
              href={getWhatsAppUrl("Hi, I'm interested in 9to5 Workspace. Could you share more information?")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-[#25D366]"
            >
              <WhatsAppIcon className="h-3 w-3 text-[#25D366]" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-5 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'transition-colors py-1 hover:text-foreground',
                    isActive ? 'font-semibold text-foreground border-b-2 border-accent' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Subtle Member Login component for existing users */}
          <UserNav />

          {/* Call Us Quick Button on mobile/tablet */}
          <a
            href={`tel:${CONTACT_CONFIG.primaryPhone}`}
            onClick={handleCallClick}
            aria-label="Call 9to5 Workspace"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-secondary lg:hidden"
          >
            <Phone className="h-4 w-4" />
          </a>

          {/* Primary High-Conversion CTA: Book a Free Tour */}
          <Button
            asChild
            size="sm"
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 shadow-sm text-xs sm:text-sm"
          >
            <Link href="/book-a-tour" className="flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5" />
              <span>Book a Free Tour</span>
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground"
                aria-label="Open mobile navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 p-0 flex flex-col justify-between">
              <div className="p-6">
                <SheetHeader className="text-left pb-4 border-b">
                  <Logo />
                  <p className="text-xs text-muted-foreground pt-1">
                    Calm, focused coworking at The Banyan & The Olive
                  </p>
                </SheetHeader>

                {/* Primary Quick Tour Action */}
                <div className="py-4">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold justify-center gap-2">
                    <Link href="/book-a-tour" onClick={() => setMobileOpen(false)}>
                      <Compass className="h-4 w-4" />
                      <span>Book a Free Tour</span>
                    </Link>
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    <span>Home</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/locations"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    <span>Locations (The Banyan & The Olive)</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/spaces"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    <span>Seat & Room Booking</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/prices"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    <span>Plans & Transparent Pricing</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/corporate-enquiry"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    <span>Corporate & Team Enquiries</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/journal"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    <span>The Workspace Journal</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary"
                  >
                    <span>Contact & Location Maps</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/privacy-and-data-protection"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <span>Privacy & Data Protection</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </nav>
              </div>

              {/* Mobile Drawer Footer with One-Tap Call and WhatsApp */}
              <div className="border-t bg-secondary/30 p-6 space-y-3">
                <a
                  href={`tel:${CONTACT_CONFIG.primaryPhone}`}
                  onClick={handleCallClick}
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-border bg-card py-2.5 text-xs font-semibold text-foreground shadow-sm hover:bg-secondary"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  <span>Call {CONTACT_CONFIG.primaryContactName}: {CONTACT_CONFIG.primaryPhoneDisplay}</span>
                </a>
                <a
                  href={getWhatsAppUrl("Hi, I'd like to schedule a free tour of 9to5 Workspace.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-[#25D366] py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20ba5a]"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
