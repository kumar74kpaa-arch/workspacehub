import Link from 'next/link';
import { Logo } from './logo';
import { CONTACT_CONFIG, getWhatsAppUrl } from '@/lib/contact-config';
import { WhatsAppIcon } from './contact/floating-contact';
import { Phone, Mail, MapPin, Compass, ArrowUpRight, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary/20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Introduction */}
          <div className="lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Thoughtfully designed, distraction-free coworking spaces in South Delhi. Dedicated to focused professionals, consultants, and growing teams.
            </p>
            <div className="space-y-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <span><strong>The Banyan:</strong> {CONTACT_CONFIG.locations.banyan.fullAddress}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <span><strong>The Olive:</strong> {CONTACT_CONFIG.locations.olive.fullAddress}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-3">
              <a
                href={`tel:${CONTACT_CONFIG.primaryPhone}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition"
              >
                <Phone className="h-3.5 w-3.5 text-accent" />
                <span>{CONTACT_CONFIG.primaryPhoneDisplay}</span>
              </a>
              <a
                href={getWhatsAppUrl("Hi, I'm interested in 9to5 Workspace. Could you share more information?")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#20ba5a] transition"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Column 1: Explore & Book */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/book-a-tour" className="hover:text-foreground transition flex items-center gap-1 font-medium text-accent">
                  <span>Book a Free Tour</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-foreground transition">Our Locations</Link>
              </li>
              <li>
                <Link href="/spaces/banyan" className="hover:text-foreground transition">The Banyan Space</Link>
              </li>
              <li>
                <Link href="/spaces/olive" className="hover:text-foreground transition">The Olive Space</Link>
              </li>
              <li>
                <Link href="/spaces" className="hover:text-foreground transition">Seat & Room Booking</Link>
              </li>
              <li>
                <Link href="/prices" className="hover:text-foreground transition">Flexible Pricing</Link>
              </li>
              <li>
                <Link href="/corporate-enquiry" className="hover:text-foreground transition">Corporate Enquiries</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources & Journal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/journal" className="hover:text-foreground transition font-medium">The Workspace Journal</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition">Contact Information</Link>
              </li>
              <li>
                <a 
                  href={CONTACT_CONFIG.locations.banyan.directionsUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition flex items-center gap-1"
                >
                  <span>Google Maps: The Banyan</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a 
                  href={CONTACT_CONFIG.locations.olive.directionsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition flex items-center gap-1"
                >
                  <span>Google Maps: The Olive</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Privacy */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Trust & Privacy</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy-and-data-protection" className="hover:text-foreground transition flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Privacy & DPDP Centre</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-and-data-protection#grievance-form" className="hover:text-foreground transition">Grievance Submission</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-foreground transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition">Member Portal Sign In</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="mt-12 border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p>
              &copy; {new Date().getFullYear()} {CONTACT_CONFIG.businessName}. All rights reserved. Operating in Lajpat Nagar, South Delhi.
            </p>
            <span className="hidden sm:inline text-muted-foreground/40">•</span>
            <Link 
              href="/login" 
              className="text-foreground/75 hover:text-foreground font-medium underline-offset-4 hover:underline transition"
            >
              Login / Sign Up
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy-and-data-protection" className="hover:underline">Data Protection Policy</Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:underline">Terms of Service</Link>
            <span>•</span>
            <Link href="/contact" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
