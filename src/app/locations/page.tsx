import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LocationMap from '@/components/LocationMap';
import BanyanLocationMap from '@/components/BanyanLocationMap';
import { Separator } from '@/components/ui/separator';
import { MapPin, Train, Store } from 'lucide-react';

export default function LocationsPage() {
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
                           <Separator className="my-6" />
                           <div className="space-y-3 text-sm text-muted-foreground">
                             <div className="flex items-center gap-3">
                               <Train className="h-4 w-4" />
                               <span>Nearest Metro Station: Moolchand (3 min walk)</span>
                             </div>
                             <div className="flex items-center gap-3">
                               <Store className="h-4 w-4" />
                               <span>Marketplace: 2 min walking distance</span>
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
                           <Separator className="my-6" />
                           <div className="space-y-3 text-sm text-muted-foreground">
                             <div className="flex items-center gap-3">
                               <Train className="h-4 w-4" />
                               <span>Nearest Metro Station: Moolchand (2 min walk)</span>
                             </div>
                             <div className="flex items-center gap-3">
                               <Store className="h-4 w-4" />
                               <span>Marketplace nearby</span>
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
