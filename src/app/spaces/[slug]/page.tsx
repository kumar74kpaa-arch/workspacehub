import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { spacesData } from '@/lib/spaces-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Info } from 'lucide-react';

export default function SpaceDetailPage({ params }: { params: { slug: string } }) {
  const space = spacesData.find((s) => s.slug === params.slug);

  if (!space) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24 max-w-5xl mx-auto">
          {/* Hero Section */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
                {space.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {space.details.overview}
              </p>
              <Button asChild size="lg" className="font-semibold">
                <Link href="/dashboard">Book This Space</Link>
              </Button>
            </div>
            <div className="relative h-80 w-full">
                <Image
                    src={space.imageUrl}
                    alt={space.name}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    data-ai-hint={space.imageHint}
                />
            </div>
          </section>

          {/* Amenities Section */}
          <section className="mt-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                    What's Included
                </h2>
                <p className="mt-3 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                    A complete list of amenities available at {space.name}.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {space.details.amenities.map(category => (
                    <div key={category.category} className="rounded-lg border bg-card p-6">
                        <h3 className="font-semibold text-lg mb-4">{category.category}</h3>
                        <ul className="space-y-3">
                            {category.items.map(item => (
                                <li key={item.name} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
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
          </section>

          {/* Rules & Disclaimers */}
          <section className="mt-24">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl">
                    Good to Know
                </h2>
                <p className="mt-3 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                    Important information and rules for using this space.
                </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {space.details.rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                    <Info className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <p className="text-muted-foreground text-sm">{rule}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
