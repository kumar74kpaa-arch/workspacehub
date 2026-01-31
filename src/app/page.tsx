import Link from 'next/link';
import Image from 'next/image';
import {
  Wifi,
  Coffee,
  Printer,
  Users,
  CheckCircle,
  Clock,
  BarChart,
  ChevronRight,
  MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const amenities = [
  {
    icon: Wifi,
    name: 'High-Speed WiFi',
    description: 'Blazing fast internet to keep you productive.',
  },
  {
    icon: Coffee,
    name: 'Gourmet Coffee',
    description: 'Unlimited premium coffee to fuel your day.',
  },
  {
    icon: Printer,
    name: 'Printing Services',
    description: 'On-demand printing and scanning facilities.',
  },
  {
    icon: Users,
    name: 'Meeting Rooms',
    description: 'Bookable rooms for team collaboration.',
  },
  {
    icon: MapPin,
    name: 'Prime Location',
    description: 'Centrally located with excellent connectivity and nearby amenities.',
  },
];

const membershipPlans = [
  {
    name: 'Day Pass',
    price: '₹2,000',
    period: 'per day',
    features: ['Flexible access', 'High-speed WiFi', 'Coffee & snacks'],
  },
  {
    name: 'Monthly',
    price: '₹20,000',
    period: 'per month',
    features: ['24/7 access', 'Dedicated desk option', '4 hours meeting room credit'],
    popular: true,
  },
  {
    name: 'Annual',
    price: '₹2,00,000',
    period: 'per year',
    features: ['All monthly benefits', '1 month free', 'Company mailbox service'],
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

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
                Amenities for Success
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to do your best work, all in one place.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {amenities.map((amenity) => (
                <Card key={amenity.name} className="flex flex-col items-center text-center p-6 bg-card hover:shadow-lg transition-shadow duration-300">
                  <div className="p-4 bg-accent/10 rounded-full mb-4">
                    <amenity.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{amenity.name}</h3>
                  <p className="text-muted-foreground">{amenity.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="memberships" className="w-full py-24 lg:py-32">
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
      </main>
      <Footer />
    </>
  );
}
