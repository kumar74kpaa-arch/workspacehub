'use client';

import * as React from 'react';
import { MapPin, Navigation, ArrowUpRight, CheckCircle2, ShieldCheck, Train } from 'lucide-react';
import { CONTACT_CONFIG } from '@/lib/contact-config';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Official Google "G" 4-color SVG icon
function GoogleGIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25A11.968 11.968 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

export function GoogleReviewsSection() {
  const handleDirectionsClick = (location: 'banyan' | 'olive') => {
    trackEvent('directions_click', { location });
  };

  return (
    <section className="w-full py-16 md:py-20 bg-secondary/30 border-t border-border/70">
      <div className="container px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
              <GoogleGIcon className="h-3.5 w-3.5" />
              <span>Verified Google Maps Listings</span>
            </div>
            <h2 className="text-2xl font-headline font-bold sm:text-3xl text-foreground">
              Find & Review Us on Google Maps
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              Both of our South Delhi locations are verified on Google Maps. Read real visitor feedback, check live directions, or navigate directly from Moolchand Metro Station.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/80 rounded-xl border border-border/80 px-4 py-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Transparent ratings policy: We link only to official Google listings.</span>
          </div>
        </div>

        {/* Two Locations Google Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* The Banyan Location */}
          <Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">Flagship Space</span>
                  <h3 className="text-xl font-bold font-headline text-foreground mt-0.5">
                    {CONTACT_CONFIG.locations.banyan.name}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {CONTACT_CONFIG.locations.banyan.fullAddress}
              </p>

              <div className="flex items-center gap-2 text-xs text-foreground font-medium bg-secondary/40 rounded-lg p-2.5">
                <Train className="h-4 w-4 text-accent shrink-0" />
                <span>{CONTACT_CONFIG.locations.banyan.metroStation}</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-semibold gap-1.5"
                >
                  <a
                    href={CONTACT_CONFIG.locations.banyan.googleBusinessReviewUrl || CONTACT_CONFIG.locations.banyan.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDirectionsClick('banyan')}
                  >
                    <GoogleGIcon className="h-3.5 w-3.5" />
                    <span>Read Google Reviews</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>

                <Button
                  asChild
                  className="w-full sm:w-auto text-xs font-semibold gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <a
                    href={CONTACT_CONFIG.locations.banyan.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDirectionsClick('banyan')}
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Get Directions</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* The Olive Location */}
          <Card className="p-6 border-border bg-card shadow-sm hover:shadow-md transition">
            <CardContent className="p-0 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">Collaborative Space</span>
                  <h3 className="text-xl font-bold font-headline text-foreground mt-0.5">
                    {CONTACT_CONFIG.locations.olive.name}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {CONTACT_CONFIG.locations.olive.fullAddress}
              </p>

              <div className="flex items-center gap-2 text-xs text-foreground font-medium bg-secondary/40 rounded-lg p-2.5">
                <Train className="h-4 w-4 text-accent shrink-0" />
                <span>{CONTACT_CONFIG.locations.olive.metroStation}</span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto text-xs font-semibold gap-1.5"
                >
                  <a
                    href={CONTACT_CONFIG.locations.olive.googleBusinessReviewUrl || CONTACT_CONFIG.locations.olive.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDirectionsClick('olive')}
                  >
                    <GoogleGIcon className="h-3.5 w-3.5" />
                    <span>Read Google Reviews</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </Button>

                <Button
                  asChild
                  className="w-full sm:w-auto text-xs font-semibold gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <a
                    href={CONTACT_CONFIG.locations.olive.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDirectionsClick('olive')}
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Get Directions</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
