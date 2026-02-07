

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
      { icon: Coffee, name: 'Pantry', description: 'premium coffee, tea, and filtered water to fuel your day.' },
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

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');
  const banyanSpace = spacesData.find(s => s.slug === 'banyan');
  const oliveSpace = spacesData.find(s => s.slug === 'olive');

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

        <section id="tour" className="w-full py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Tour Our Spaces</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                We offer two unique environments, each tailored to different work styles. Click to learn more.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
              {banyanSpace && (
                <Link href={`/spaces/${banyanSpace.slug}`} className="group space-y-4">
                  <div className="overflow-hidden rounded-lg shadow-architect-hover">
                    <Image 
                      src={banyanSpace.imageUrl} 
                      alt={banyanSpace.name}
                      width={800} 
                      height={600} 
                      className="rounded-lg object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={banyanSpace.imageHint}
                    />
                  </div>
                  <h3 className="text-2xl pt-2 font-bold font-headline group-hover:text-accent transition-colors">{banyanSpace.name}</h3>
                  <p className="text-muted-foreground">{banyanSpace.description}</p>
                </Link>
              )}
              {oliveSpace && (
                <Link href={`/spaces/${oliveSpace.slug}`} className="group space-y-4">
                  <div className="overflow-hidden rounded-lg shadow-architect-hover">
                    <Image 
                      src={oliveSpace.imageUrl}
                      alt={oliveSpace.name}
                      width={800} 
                      height={600} 
                      className="rounded-lg object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={oliveSpace.imageHint}
                    />
                  </div>
                  <h3 className="text-2xl pt-2 font-bold font-headline group-hover:text-accent transition-colors">{oliveSpace.name}</h3>
                  <p className="text-muted-foreground">{oliveSpace.description}</p>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section id="amenities" className="w-full py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Amenities
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

        <section id="why-us" className="w-full py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose 9to5 Workspace?</h2>
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

        <section id="location" className="w-full py-24 lg:py-32 bg-secondary/50">
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
