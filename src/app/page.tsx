import Link from 'next/link';
import Image from 'next/image';
import {
  Wifi,
  Printer,
  Users,
  CheckCircle,
  Clock,
  BarChart,
  ChevronRight,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Briefcase,
  HeartHandshake,
  Sparkles,
  Network,
  Video,
  Coffee,
  Car,
  Wind,
  Shield,
  UserCheck,
  Dice5,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LocationMap from '@/components/LocationMap';
import { spacesData } from '@/lib/spaces-data';
import { SpaceCard } from '@/components/spaces/space-card';

const amenitiesByCategory = [
  {
    category: 'Technology',
    icon: Network,
    items: [
      { icon: Wifi, name: 'High-Speed Internet', description: 'Blazing fast fiber internet to keep you productive.' },
      { icon: Printer, name: 'Printing Services', description: 'On-demand B&W and color printing (paid service).' },
      { icon: Video, name: 'Video Conferencing', description: 'Rooms equipped for seamless video conferences.' },
    ]
  },
  {
    category: 'Professional',
    icon: Briefcase,
    items: [
      { icon: Users, name: 'Meeting & Conference Rooms', description: 'A range of rooms for team collaboration and client meetings.' },
      { icon: UserCheck, name: 'Onsite Staff', description: 'Our team is here to help you with any needs from 9 AM to 6 PM.' },
    ]
  },
  {
    category: 'Lifestyle',
    icon: HeartHandshake,
    items: [
      { icon: Coffee, name: 'Gourmet Pantry', description: 'Unlimited premium coffee, tea, and filtered water to fuel your day.' },
      { icon: Sparkles, name: 'Breakout Room', description: 'A space to relax, network, or have an informal discussion.' },
      { icon: Dice5, name: 'Games', description: 'Challenge a colleague to a game of Carrom (free to use).' },
      { icon: Car, name: 'Parking', description: 'Convenient on-site parking is available (at own risk).' },
    ]
  },
  {
    category: 'Health & Safety',
    icon: ShieldCheck,
    items: [
      { icon: Wind, name: 'Air Conditioning', description: 'Fully air-conditioned workspace for your comfort.' },
      { icon: Shield, name: '24/7 Security', description: 'Secure access and surveillance to ensure your safety.' },
      { icon: Sparkles, name: 'Professional Cleaning', description: 'Regular cleaning and sanitization of all areas.' },
    ]
  },
];

const whyChooseUs = [
    {
        icon: MapPin,
        title: "Prime Location",
        description: "Situated in a key business district for easy access and great connectivity."
    },
    {
        icon: ShieldCheck,
        title: "Healthcare & Hygiene",
        description: "Regularly sanitized spaces and focus on health protocols for a safe environment."
    },
    {
        icon: Briefcase,
        title: "Professional Environment",
        description: "A space designed for focus and productivity, free from cafe-style distractions."
    }
]

const membershipPlans = [
  {
    name: 'Day Pass',
    price: '₹599',
    period: 'per day',
    features: ['Flexible access', 'High-speed WiFi', 'Tea & Coffee'],
  },
  {
    name: 'Quarterly',
    price: '₹14,999',
    period: 'per quarter',
    features: ['Dedicated desk option', '12 hours meeting room credit'],
    popular: true,
  },
  {
    name: 'Annual',
    price: '₹65,999',
    period: 'per year',
    features: ['All quarterly benefits', '1 month free', 'Company mailbox service'],
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
  const tourImages = PlaceHolderImages.filter((img) => img.id.startsWith('tour-image'));

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative w-full py-24 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl text-primary">
                A Calm Space to Work and Think
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Thoughtfully designed coworking for focused professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/login">Reserve Workspace</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="font-semibold">
                  <Link href="#memberships">View Memberships</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
             {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  className="rounded-lg object-cover aspect-[3/2] hover:shadow-lg transition-shadow"
                  data-ai-hint={heroImage.imageHint}
                />
             )}
            </div>
          </div>
        </section>

        <section id="amenities" className="w-full py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
                World-Class Amenities
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We are committed to providing a healthy and comfortable workspace for everyone.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {amenitiesByCategory.map((category) => (
                  <AccordionItem value={category.category} key={category.category}>
                    <AccordionTrigger className="text-xl font-semibold">
                        <div className="flex items-center gap-4">
                            <category.icon className="h-6 w-6 text-accent" />
                            {category.category}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pl-14">
                        {category.items.map((amenity) => (
                          <div key={amenity.name} className="flex items-start gap-3">
                             <amenity.icon className="h-5 w-5 text-accent/80 mt-0.5" />
                            <div>
                               <h4 className="font-medium">{amenity.name}</h4>
                               <p className="text-sm text-muted-foreground">{amenity.description}</p>
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

        <section id="why-us" className="w-full py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Workspace Hub?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                An environment designed for deep work and professional growth.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item) => (
                <Card key={item.title} className="p-6 text-center flex flex-col items-center">
                    <div className="p-3 bg-accent/10 rounded-full mb-4">
                        <item.icon className="h-7 w-7 text-accent" />
                    </div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="memberships" className="w-full py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Flexible Memberships for Everyone
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the membership that fits your work style. No hidden fees, no long-term commitments.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {membershipPlans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-accent' : ''}`}>
                  {plan.popular && <Badge className="absolute -top-3 right-4 bg-accent text-accent-foreground">Popular</Badge>}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-primary">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-accent" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full font-semibold" variant={plan.popular ? 'default' : 'outline'}>
                      <Link href="/login">Reserve Workspace</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="tour" className="w-full py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Tour the Space
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Get a feel for our vibrant and inspiring environment.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tourImages.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-lg group">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={400}
                    className="h-full w-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="availability" className="w-full py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                  Real-Time Availability
                </h2>
                <p className="mt-4 text-muted-foreground md:text-lg">
                  Check our live occupancy to find the perfect time to come in. Workspace Hub helps you plan your day for maximum productivity.
                </p>
                <Button asChild className="mt-6 font-semibold">
                  <Link href="/dashboard">
                    Explore Spaces <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6">
                  <CardHeader className="p-0 flex-row items-center justify-between">
                    <CardTitle className="text-lg">Hot Desks</CardTitle>
                    <Users className="h-6 w-6 text-accent" />
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <p className="text-4xl font-bold">12/30</p>
                    <p className="text-sm text-muted-foreground">Available Now</p>
                  </CardContent>
                </Card>
                <Card className="p-6">
                  <CardHeader className="p-0 flex-row items-center justify-between">
                    <CardTitle className="text-lg">Meeting Rooms</CardTitle>
                    <Clock className="h-6 w-6 text-accent" />
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <p className="text-4xl font-bold">3/5</p>
                    <p className="text-sm text-muted-foreground">Available Today</p>
                  </CardContent>
                </Card>
                <Card className="p-6 col-span-2">
                  <CardHeader className="p-0 flex-row items-center justify-between">
                    <CardTitle className="text-lg">Today's Peak Time</CardTitle>
                    <BarChart className="h-6 w-6 text-accent" />
                  </CardHeader>
                  <CardContent className="p-0 pt-4">
                    <p className="text-3xl font-bold">2:00 PM - 4:00 PM</p>
                    <p className="text-sm text-muted-foreground">Based on historical data</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="location" className="w-full py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Location
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We're conveniently located in Lajpat Nagar. Find us using the map below or get directions.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <LocationMap />
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                  <a
                    href="https://maps.google.com/?q=Development+Solutions+Delhi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold"
                  >
                    Get Directions <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
