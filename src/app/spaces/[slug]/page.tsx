import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CheckCircle, Info } from 'lucide-react';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { spacesData } from '@/lib/spaces-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const space = spacesData.find((s) => s.slug === params.slug);
  if (!space) {
    return {
      title: 'Space Not Found',
    };
  }

  return {
    title: `${space.name} | 9to5 Workspace`,
    description: space.details.overview,
  };
}

export default function SpaceDetailPage({ params }: { params: { slug: string } }) {
  const space = spacesData.find((s) => s.slug === params.slug);

  if (!space) {
    notFound();
  }

  const themeClass = space.slug === 'banyan' ? 'theme-banyan' : 'theme-olive';
  const ctaButtonClass = space.slug === 'banyan' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-lime-600 hover:bg-lime-700 text-white';

  const gridCols: { [key: number]: string } = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  const galleryCount = space.details.gallery.length;
  const gridClass = gridCols[galleryCount] || 'grid-cols-2';


  return (
    <div className={cn(themeClass)}>
      <Header />
      <main className="flex-1 bg-background/80">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40">
            <div className="absolute inset-0">
                <Image
                    src={space.imageUrl}
                    alt={space.name}
                    fill
                    className="object-cover"
                    data-ai-hint={space.imageHint}
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="container relative px-4 md:px-6 text-center text-white space-y-6">
                <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl md:text-6xl">
                    {space.name}
                </h1>
                <p className="max-w-3xl mx-auto md:text-xl">
                    {space.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" variant="outline" className="font-semibold bg-transparent text-white border-white hover:bg-white hover:text-black">
                        <Link href="#gallery">View Gallery</Link>
                    </Button>
                </div>
            </div>
        </section>

        {/* About Section */}
        <section className="py-24 lg:py-32">
            <div className="container px-4 md:px-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl font-headline font-bold tracking-tight">About {space.name}</h2>
                    <p className="text-muted-foreground text-lg">
                        {space.details.overview}
                    </p>
                </div>
                <Card className="p-6">
                    <CardHeader className="p-0 pb-4">
                        <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                         <ul className="space-y-3">
                            {space.keyAmenities.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-accent" />
                                <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>

        {/* Amenities Section */}
        <section className="py-24 lg:py-32 bg-secondary/30">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                        What's Included
                    </h2>
                    <p className="mt-3 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                        A complete list of amenities available at {space.name}.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {space.details.amenities.map(category => (
                        <div key={category.category} className="space-y-4">
                            <h3 className="font-semibold text-xl mb-4">{category.category}</h3>
                            <ul className="space-y-4">
                                {category.items.map(item => (
                                    <li key={item.name} className="flex items-start gap-4">
                                        <CheckCircle className="h-5 w-5 text-accent mt-1 shrink-0" />
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* Gallery Section */}
        <section id="gallery" className="py-24 lg:py-32">
             <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                        Gallery
                    </h2>
                    <p className="mt-3 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                        A glimpse into the {space.name} workspace.
                    </p>
                </div>
                <Tabs defaultValue={space.details.gallery[0].id} className="max-w-4xl mx-auto">
                    <TabsList className={cn('grid w-full', gridClass)}>
                        {space.details.gallery.map(item => (
                            <TabsTrigger key={item.id} value={item.id}>{item.title}</TabsTrigger>
                        ))}
                    </TabsList>
                    {space.details.gallery.map(item => (
                         <TabsContent key={item.id} value={item.id} className="mt-6">
                             <Carousel className="w-full">
                                <CarouselContent>
                                    {item.imageUrls.map((url, index) => (
                                        <CarouselItem key={index}>
                                            <Card>
                                                <CardContent className="p-0">
                                                    <Image 
                                                        src={url}
                                                        alt={`${item.title} - Image ${index + 1}`}
                                                        width={1200}
                                                        height={800}
                                                        className="aspect-[3/2] object-cover rounded-lg"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {item.imageUrls.length > 1 && (
                                    <>
                                        <CarouselPrevious className="hidden sm:flex" />
                                        <CarouselNext className="hidden sm:flex" />
                                    </>
                                )}
                            </Carousel>
                        </TabsContent>
                    ))}
                </Tabs>
             </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 bg-secondary/30">
            <div className="container px-4 md:px-6 text-center">
                 <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                    Ready to Join?
                </h2>
                <p className="mt-3 text-muted-foreground md:text-lg max-w-2xl mx-auto mb-8">
                    Reserve your spot at {space.name} today and elevate your workday.
                </p>
                <Button asChild size="lg" className={cn('font-semibold', ctaButtonClass)}>
                    <Link href={`/seat-booking?office=${space.slug}`}>Reserve Your Seat at {space.name}</Link>
                </Button>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
