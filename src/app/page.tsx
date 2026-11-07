import Link from 'next/link';
import Image from 'next/image';
import {
  Wifi,
  Printer,
  Users,
  Clock,
  BarChart,
  ChevronRight,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  HeartHandshake,
  Sparkles,
  Network,
  Video,
  Coffee,
  Car,
  Wind,
  UserCheck,
  Dice5,
  Camera,
  BriefcaseMedical,
  ShieldAlert,
  Compass,
  Phone,
  BookOpen,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { spacesData } from '@/lib/spaces-data';
import { HeroSlideshow } from '@/components/hero-slideshow';
import { GoogleReviewsSection } from '@/components/trust/google-reviews-section';
import { TestimonialsSection } from '@/components/trust/testimonials-section';
import { JOURNAL_ARTICLES } from '@/lib/journal-data';
import { CONTACT_CONFIG, getWhatsAppUrl } from '@/lib/contact-config';
import { WhatsAppIcon } from '@/components/contact/floating-contact';
import { format } from 'date-fns';

const amenitiesByCategory = [
  {
    category: 'Technology',
    icon: Network,
    items: [
      { icon: Wifi, name: 'High-Speed Fiber Internet', description: 'Fast, stable fiber connectivity tested for deep work.' },
      { icon: Printer, name: 'Print, Scan & Photocopy', description: 'On-demand B&W and color document printing.' },
      { icon: Video, name: 'Video Conferencing', description: 'Meeting rooms equipped for Zoom, Teams, and Google Meet.' },
    ],
  },
  {
    category: 'Professional Facilities',
    icon: Briefcase,
    items: [
      { icon: Users, name: 'Meeting & Conference Rooms', description: '4-seater meeting rooms to 12-seater executive conference halls.' },
      { icon: Briefcase, name: 'Ergonomic Workstations', description: 'Spacious desks paired with high-quality lumbar support chairs.' },
    ],
  },
  {
    category: 'Lifestyle & Hospitality',
    icon: HeartHandshake,
    items: [
      { icon: Coffee, name: 'Pantry & Beverages', description: 'Complimentary tea, premium coffee, and filtered RO water.' },
      { icon: Sparkles, name: 'Quiet Breakout Zone', description: 'A relaxing space to take a break without distracting coworkers.' },
      { icon: Car, name: 'On-Site Parking', description: 'Convenient parking space available at vehicle owner’s risk.' },
      { icon: UserCheck, name: 'On-Site Staff', description: 'Friendly community management available Mon–Sat 8AM–8PM.' },
      { icon: Dice5, name: 'Board Games with Carrom', description: 'Unwind during breaks with colleagues.' },
    ],
  },
  {
    category: 'Health & Security',
    icon: ShieldCheck,
    items: [
      { icon: Wind, name: 'Full Climate Control', description: 'Clean, fully air-conditioned spaces for all-day focus.' },
      { icon: Sparkles, name: 'Daily Sanitization', description: 'Continuous professional cleaning of all shared areas.' },
      { icon: Camera, name: 'CCTV Surveillance', description: 'Round-the-clock monitoring for your safety and security.' },
      { icon: BriefcaseMedical, name: 'First Aid Kit', description: 'Available at reception for immediate assistance.' },
      { icon: ShieldAlert, name: 'Fire Safety Equipment', description: 'Extinguishers and safety exits regularly inspected.' },
    ],
  },
];

const whyChooseUs = [
  {
    icon: MapPin,
    title: 'Prime South Delhi Location',
    description: 'Situated in Lajpat Nagar, just 5 minutes walk from Moolchand Metro Station on the Violet Line.',
  },
  {
    icon: ShieldCheck,
    title: 'Acoustic Calm & True Focus',
    description: 'Zero cafe-style chatter or loud disruptions. Designed specifically for deep, billable work.',
  },
  {
    icon: Briefcase,
    title: 'Zero Capital Lock-In',
    description: 'No 3-year commercial leases or heavy security deposits. Flexible day passes and monthly plans.',
  },
];

export default function Home() {
  const banyanSpace = spacesData.find((s) => s.slug === 'banyan');
  const oliveSpace = spacesData.find((s) => s.slug === 'olive');
  const latestArticles = JOURNAL_ARTICLES.slice(0, 3);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[80vh] min-h-[550px] md:h-[85vh] flex items-center text-white">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 z-10" />
          <div className="relative z-20 container px-4 md:px-6">
            <div className="flex items-center max-w-4xl">
              <div className="w-1.5 md:w-2 h-36 md:h-44 bg-accent mr-5 md:mr-8 shrink-0" />
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-neutral-200 backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>South Delhi’s Dedicated Coworking Spaces • Open Mon–Sat 8AM–8PM</span>
                </div>

                <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl text-white leading-tight">
                  A Calm Space to Work and Think
                </h1>

                <p className="max-w-[620px] text-base md:text-xl text-neutral-200 leading-relaxed">
                  Thoughtfully designed coworking for focused professionals, legal consultants, and growing teams in Lajpat Nagar, South Delhi.
                </p>

                {/* Primary High-Conversion CTA Group */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="font-semibold bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-7 py-6 text-sm sm:text-base shadow-lg transition"
                  >
                    <Link href="/book-a-tour" className="flex items-center gap-2">
                      <Compass className="h-4 w-4" />
                      <span>Book a Free Guided Tour</span>
                    </Link>
                  </Button>

                  <a
                    href={getWhatsAppUrl("Hi, I'm interested in 9to5 Workspace. Could you share more information?")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-[#20ba5a] transition"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>WhatsApp Chat</span>
                  </a>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-black font-semibold text-sm sm:text-base px-6 py-6"
                  >
                    <Link href="/spaces">View Workspaces</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Micro Value Proposition Bar */}
        <section className="border-b border-border bg-secondary/40 py-4">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>Free Guided Tour:</strong> Try before you decide</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span><strong>5 Min Walk:</strong> Moolchand Metro Station</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Wifi className="h-4 w-4 text-accent shrink-0" />
                <span><strong>High-Speed Fiber:</strong> Enterprise backup</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Clock className="h-4 w-4 text-accent shrink-0" />
                <span><strong>Flexible Hours:</strong> Mon–Sat 8AM–8PM</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tour Our Spaces Section */}
        <section id="tour" className="w-full py-20 lg:py-28 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Our Work Environments
              </span>
              <h2 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl">
                Tour Our Two Unique Spaces
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base">
                Both located in Lajpat Nagar, tailored to different work styles and team sizes. Click each space for detailed amenities and floor plans.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
              {/* The Banyan Space */}
              {banyanSpace && (
                <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="overflow-hidden relative h-64 sm:h-72 w-full">
                    <Image
                      src={banyanSpace.imageUrl}
                      alt={banyanSpace.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold text-accent">
                        Executive Flagship
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold font-headline text-foreground group-hover:text-accent transition-colors">
                      <Link href={`/spaces/${banyanSpace.slug}`}>{banyanSpace.name}</Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {banyanSpace.description}
                    </p>
                    <div className="space-y-1.5 pt-2 text-xs text-muted-foreground">
                      <p>📍 Lower Ground Floor, 86, National Park, Lajpat Nagar</p>
                      <p>🚇 5 minutes walk from Moolchand Metro Station</p>
                    </div>
                    <div className="pt-4 flex flex-wrap items-center gap-2">
                      <Button asChild size="sm" className="rounded-full text-xs font-semibold">
                        <Link href={`/spaces/${banyanSpace.slug}`}>Explore The Banyan</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                        <Link href="/book-a-tour">Book a Tour Here</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* The Olive Space */}
              {oliveSpace && (
                <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="overflow-hidden relative h-64 sm:h-72 w-full">
                    <Image
                      src={oliveSpace.imageUrl}
                      alt={oliveSpace.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold text-accent">
                        Vibrant & Collaborative
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold font-headline text-foreground group-hover:text-accent transition-colors">
                      <Link href={`/spaces/${oliveSpace.slug}`}>{oliveSpace.name}</Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {oliveSpace.description}
                    </p>
                    <div className="space-y-1.5 pt-2 text-xs text-muted-foreground">
                      <p>📍 Lower Ground, 17/109, Vikram Vihar, Lajpat Nagar 4</p>
                      <p>🚇 5 minutes walk from Moolchand Metro Station</p>
                    </div>
                    <div className="pt-4 flex flex-wrap items-center gap-2">
                      <Button asChild size="sm" className="rounded-full text-xs font-semibold">
                        <Link href={`/spaces/${oliveSpace.slug}`}>Explore The Olive</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                        <Link href="/book-a-tour">Book a Tour Here</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Corporate Enquiries Callout Banner */}
        <section className="w-full py-12 bg-secondary/30 border-y border-border">
          <div className="container px-4 md:px-6 max-w-5xl">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                  <Briefcase className="h-3.5 w-3.5" />
                  Corporate & Startup Solutions
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
                  Need a dedicated team desk cluster or private cabin?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                  We create tailored workspace packages with GST billing, multi-seat conference bookings, and zero long-term lease lock-ins.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
                <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs sm:text-sm px-6">
                  <Link href="/corporate-enquiry">Request Team Proposal</Link>
                </Button>
                <a
                  href={getWhatsAppUrl("Hi, I'd like to discuss a corporate workspace requirement for my team.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Google Reviews and Maps Social Proof Section */}
        <GoogleReviewsSection />

        {/* Genuine Customer Testimonials Section */}
        <TestimonialsSection />

        {/* Latest from The Workspace Journal */}
        <section className="w-full py-20 lg:py-28 bg-background border-t border-border/70">
          <div className="container px-4 md:px-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                  The Workspace Journal
                </span>
                <h2 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl text-foreground">
                  Latest Insights & Local Guides
                </h2>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Expert guidance on meeting etiquette, choosing flexible office plans, and working in South Delhi.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-semibold">
                <Link href="/journal">View All 8 Articles →</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestArticles.map((article) => (
                <Card
                  key={article.slug}
                  className="group overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={article.heroImage}
                        alt={article.imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="rounded-full bg-background/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-foreground">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="px-5 pt-1 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{format(new Date(article.publishedDate), 'dd MMM yyyy')}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h3 className="font-bold font-headline text-base text-foreground group-hover:text-accent transition-colors leading-snug">
                        <Link href={`/journal/${article.slug}`}>{article.title}</Link>
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t mt-3 flex items-center justify-between">
                    <Link
                      href={`/journal/${article.slug}`}
                      className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:underline"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section id="amenities" className="w-full py-20 lg:py-28 bg-secondary/20 border-t border-border/70">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Complete Facilities
              </span>
              <h2 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl">
                Amenities Built for Focus
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base">
                Everything required for a productive, distraction-free workday in South Delhi.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible defaultValue="Technology" className="w-full space-y-2">
                {amenitiesByCategory.map((category) => (
                  <AccordionItem 
                    value={category.category} 
                    key={category.category}
                    className="border border-border/80 bg-card rounded-xl px-4 shadow-2xs overflow-hidden"
                  >
                    <AccordionTrigger className="text-base sm:text-lg font-semibold py-4 hover:no-underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent/50 rounded-lg">
                      <div className="flex items-center gap-3 text-foreground">
                        <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                          <category.icon className="h-5 w-5 text-accent" />
                        </div>
                        <span>{category.category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pl-8">
                        {category.items.map((amenity) => (
                          <div key={amenity.name} className="flex items-start gap-3">
                            <amenity.icon className="h-4 w-4 text-accent/80 mt-1 shrink-0" />
                            <div>
                              <h4 className="font-semibold text-xs sm:text-sm text-foreground">{amenity.name}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">{amenity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us" className="w-full py-20 lg:py-28 bg-background border-t border-border">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-14">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                Our Values
              </span>
              <h2 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl">
                Why Professionals Choose 9to5
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-sm sm:text-base">
                A calm, distraction-free environment designed for sustained concentration.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {whyChooseUs.map((item) => (
                <Card key={item.title} className="p-6 text-center flex flex-col items-center border-border shadow-sm">
                  <div className="p-3.5 bg-accent/10 rounded-full mb-4">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg font-headline font-bold mb-2">{item.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
