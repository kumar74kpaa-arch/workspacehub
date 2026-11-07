import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { JOURNAL_ARTICLES } from '@/lib/journal-data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Calendar, ArrowRight, Compass } from 'lucide-react';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: 'The Workspace Journal | Insights on Coworking, Meetings & Focus in South Delhi | 9to5',
  description:
    'Practical advice for consultants, founders, and freelancers on choosing meeting rooms, managing workspace leases, improving productivity, and working in South Delhi.',
};

export default function JournalListingPage() {
  const featuredArticle = JOURNAL_ARTICLES[0];
  const restArticles = JOURNAL_ARTICLES.slice(1);

  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative border-b border-border/80 bg-secondary/30 py-12 md:py-16">
          <div className="container max-w-6xl">
            <div className="space-y-4 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
                <BookOpen className="h-3.5 w-3.5" />
                The Workspace Journal
              </span>
              <h1 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                Workplace Strategy, Productivity & Local Guides
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Insights for independent consultants, growing startups, and professionals navigating workspace choices, meeting dynamics, and quiet focus in South Delhi.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Article & Grid */}
        <section className="py-12 md:py-20">
          <div className="container max-w-6xl space-y-12">
            {/* Featured Hero Card */}
            {featuredArticle && (
              <div className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
                    <Image
                      src={featuredArticle.heroImage}
                      alt={featuredArticle.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold text-foreground">
                        Featured Article
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-accent">{featuredArticle.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {featuredArticle.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold font-headline text-foreground group-hover:text-accent transition-colors leading-snug">
                      <Link href={`/journal/${featuredArticle.slug}`}>
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="pt-2">
                      <Button asChild size="sm" className="rounded-full font-semibold gap-1.5 text-xs">
                        <Link href={`/journal/${featuredArticle.slug}`}>
                          <span>Read Full Article</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Other 7 Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restArticles.map((article) => (
                <Card
                  key={article.slug}
                  className="group flex flex-col justify-between overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition"
                >
                  <div className="space-y-4">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={article.heroImage}
                        alt={article.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="rounded-full bg-background/90 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <div className="px-5 pt-1 space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(article.publishedDate), 'dd MMM yyyy')}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="font-bold font-headline text-lg text-foreground group-hover:text-accent transition-colors leading-snug">
                        <Link href={`/journal/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-4 border-t mt-4 flex items-center justify-between">
                    <Link
                      href={`/journal/${article.slug}`}
                      className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <span className="text-[11px] text-muted-foreground font-medium">9to5 Editorial</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Bottom Callout Banner */}
            <div className="rounded-2xl border border-border bg-secondary/30 p-8 md:p-12 text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                Ready to Experience Quiet Productivity?
              </span>
              <h2 className="text-2xl font-bold font-headline text-foreground">
                Visit The Banyan or The Olive in South Delhi
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Take a complimentary walk through our private workstations and meeting spaces. No commitment required.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6">
                  <Link href="/book-a-tour" className="flex items-center gap-2">
                    <Compass className="h-4 w-4" />
                    <span>Book a Free Guided Tour</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/prices">Explore Membership Pricing</Link>
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
