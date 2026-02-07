import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import LocationMap from '@/components/LocationMap';
import MiglanisLocationMap from '@/components/MiglanisLocationMap';

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
                        <CardTitle>The Olive</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                         <div>
                           <p className="text-muted-foreground mb-4">I-1, 2nd Floor, Lajpat Nagar Central Market, New Delhi - 24</p>
                           <MiglanisLocationMap />
                         </div>
                       </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>The Banyan</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                         <div>
                            <p className="text-muted-foreground mb-4">Ground, 17/109, Lower, Vikram Vihar, Lajpat Nagar 4, New Delhi, Delhi 110024</p>
                           <LocationMap />
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
