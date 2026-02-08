import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LocationMap from '@/components/LocationMap';
import BanyanLocationMap from '@/components/BanyanLocationMap';
import { Separator } from '@/components/ui/separator';
import { MapPin, Train, Store, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LocationsPage() {
  const banyanDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Miglanis+%26+Associates+Private+Limited,+86,+National+Park,+Lajpat+Nagar,+New+Delhi,+Delhi+110024";
  const oliveDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Development+Solutions,+17/109,+Vikram+Vihar,+Lajpat+Nagar+4,+New+Delhi,+Delhi+110024";

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
                Our Locations
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                Find our workspaces conveniently located in the city.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <Card>
                    <CardHeader>
                        <CardTitle>The Banyan</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                         <div>
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                                <p className="text-muted-foreground">Lower Ground Floor, 86, National Park, Lajpat Nagar, New Delhi, Delhi 110024</p>
                            </div>
                           <BanyanLocationMap />
                            <div className="mt-4">
                                <Button asChild className="w-full">
                                    <Link href={banyanDirectionsUrl} target="_blank" rel="noopener noreferrer">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Get Directions
                                    </Link>
                                </Button>
                            </div>
                           <Separator className="my-6" />
                           <div className="space-y-3 text-sm text-muted-foreground">
                             <div className="flex items-center gap-3">
                               <Train className="h-4 w-4" />
                               <span>Nearest Metro Station: Moolchand, 5 minute walking distance</span>
                             </div>
                             <div className="flex items-center gap-3">
                               <Store className="h-4 w-4" />
                               <span>Marketplace : 3 minute walking distance</span>
                             </div>
                           </div>
                         </div>
                       </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>The Olive</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                         <div>
                            <div className="flex items-start gap-3 mb-4">
                                <MapPin className="h-5 w-5 mt-1 text-muted-foreground flex-shrink-0" />
                                <p className="text-muted-foreground">Lower Ground, 17/109, Vikram Vihar, Lajpat Nagar 4, New Delhi, Delhi 110024</p>
                            </div>
                           <LocationMap />
                           <div className="mt-4">
                                <Button asChild className="w-full">
                                    <Link href={oliveDirectionsUrl} target="_blank" rel="noopener noreferrer">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Get Directions
                                    </Link>
                                </Button>
                            </div>
                           <Separator className="my-6" />
                           <div className="space-y-3 text-sm text-muted-foreground">
                             <div className="flex items-center gap-3">
                               <Train className="h-4 w-4" />
                               <span>Nearest Metro Station: Moolchand, 5 minute walking distance</span>
                             </div>
                             <div className="flex items-center gap-3">
                               <Store className="h-4 w-4" />
                               <span>Marketplace: Just across the road</span>
                             </div>
                           </div>
                         </div>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
