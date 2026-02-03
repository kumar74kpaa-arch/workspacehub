import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import LocationMap from '@/components/LocationMap';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Location
              </h1>
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
