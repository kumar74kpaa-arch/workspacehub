'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, CheckCircle2, Compass, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Testimonial } from '@/lib/testimonials-data';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data.testimonials) setTestimonials(data.testimonials);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return (
    <section className="w-full py-16 md:py-24 bg-background border-t border-border/60">
      <div className="container px-4 md:px-6 max-w-6xl">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold">
            Member Experiences
          </span>
          <h2 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl text-foreground">
            What Professionals Say About 9to5
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-sm sm:text-base">
            Genuine experiences from focused freelancers, consultants, and teams who work out of The Banyan and The Olive.
          </p>
        </div>

        {loaded && testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <Card key={item.id} className="p-6 border-border bg-card shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (item.rating || 5)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-foreground/90 leading-relaxed italic mb-4">
                  "{item.quote}"
                </blockquote>
                <div className="border-t pt-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-foreground">{item.authorName}</p>
                    {(item.authorRole || item.companyName) && (
                      <p className="text-muted-foreground">
                        {[item.authorRole, item.companyName].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-accent font-medium capitalize">
                    {item.location === 'banyan' ? 'The Banyan' : item.location === 'olive' ? 'The Olive' : 'South Delhi'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Honest, Authentic Community Invitation (No fake reviews) */
          <div className="rounded-2xl border border-border bg-secondary/30 p-8 md:p-12 text-center max-w-3xl mx-auto space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <MessageSquareQuote className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold font-headline text-foreground">
              Experience the Calm Focus in Person
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We uphold strict trust principles and only publish verified feedback with member consent. Experience our quiet work areas, ergonomic chairs, and fast fiber internet before deciding.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6">
                <Link href="/book-a-tour" className="flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  <span>Book a Free Guided Tour</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/locations">View Our 2 Locations</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
