import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { spacesData } from '@/lib/spaces-data';
import { SpaceCard } from '@/components/spaces/space-card';

export default function SpacesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
              Explore Spaces
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Explore our network of unique co-working environments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spacesData.map((space) => (
              <SpaceCard key={space.slug} space={space} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
