import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getArticleBySlug, JOURNAL_ARTICLES } from '@/lib/journal-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  Clock,
  Calendar,
  Compass,
  ArrowRight,
  ArrowLeft,
  Share2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return JOURNAL_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found | 9to5 Workspace' };
  }

  return {
    title: `${article.title} | The Workspace Journal`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | 9to5 Workspace`,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedDate,
      modifiedTime: article.updatedDate,
      authors: [article.author],
    },
  };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = article.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter(Boolean) as typeof JOURNAL_ARTICLES;

  // JSON-LD structured data for Google Search SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: {
      '@type': 'Organization',
      name: '9to5 Workspace',
      url: 'https://www.9to5workspace.com',
    },
    publisher: {
      '@type': 'Organization',
      name: '9to5 Workspace',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.9to5workspace.com/layouts/5.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.9to5workspace.com/journal/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-background">
        {/* Article Header & Breadcrumbs */}
        <section className="border-b border-border/80 bg-secondary/30 py-8 md:py-12">
          <div className="container max-w-4xl space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/journal" className="hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                <span>The Workspace Journal</span>
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">{article.category}</span>
            </div>

            <h1 className="text-3xl font-headline font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground leading-tight">
              {article.title}
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {article.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground border-t border-border/60">
              <span className="font-semibold text-foreground">{article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Published {format(new Date(article.publishedDate), 'dd MMMM yyyy')}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <div className="container max-w-4xl py-6">
          <div className="relative h-64 sm:h-96 md:h-[450px] w-full rounded-2xl overflow-hidden border border-border shadow-md">
            <Image
              src={article.heroImage}
              alt={article.imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Article Body */}
        <article className="container max-w-3xl py-6 pb-16 space-y-8">
          {/* Quick Table of Contents */}
          <div className="rounded-xl border border-border bg-secondary/20 p-5 space-y-2.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              In this article:
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
              {article.headings.map((h, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-accent font-mono text-xs">{i + 1}.</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Intro Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed">
            {article.content.intro.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Body Sections */}
          <div className="space-y-10 pt-4">
            {article.content.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3.5">
                <h2 className="text-xl sm:text-2xl font-headline font-bold text-foreground">
                  {sec.heading}
                </h2>
                <div className="space-y-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
                {sec.keyTakeaway && (
                  <div className="rounded-xl border-l-4 border-accent bg-accent/5 p-4 my-3 text-xs sm:text-sm text-foreground">
                    <strong>Key Takeaway:</strong> {sec.keyTakeaway}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Conclusion */}
          <div className="border-t pt-8 space-y-4 text-sm sm:text-base text-foreground/90 leading-relaxed">
            <h2 className="text-xl font-headline font-bold text-foreground">Conclusion & Next Steps</h2>
            {article.content.conclusion.map((c, i) => (
              <p key={i}>{c}</p>
            ))}
          </div>

          {/* In-Article Contextual CTA Box */}
          <Card className="border-accent/40 bg-accent/5 p-6 sm:p-8 rounded-2xl shadow-sm text-center space-y-3">
            <h3 className="text-xl font-bold font-headline text-foreground">
              {article.content.cta.title}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              {article.content.cta.description}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6">
                <Link href={article.content.cta.buttonLink}>
                  {article.content.cta.buttonText}
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/locations">View South Delhi Locations</Link>
              </Button>
            </div>
          </Card>

          {/* Internal Quick Links Matrix */}
          <div className="border-t pt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Explore 9to5 Workspace Facilities:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <Link href="/spaces/banyan" className="p-2.5 rounded-lg border hover:bg-secondary transition text-center font-medium">
                The Banyan Space
              </Link>
              <Link href="/spaces/olive" className="p-2.5 rounded-lg border hover:bg-secondary transition text-center font-medium">
                The Olive Space
              </Link>
              <Link href="/prices" className="p-2.5 rounded-lg border hover:bg-secondary transition text-center font-medium">
                Meeting Room Pricing
              </Link>
              <Link href="/corporate-enquiry" className="p-2.5 rounded-lg border hover:bg-secondary transition text-center font-medium">
                Corporate Enquiries
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-border/80 bg-secondary/20 py-12 md:py-16">
            <div className="container max-w-6xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-foreground">Related Articles</h2>
                  <p className="text-xs text-muted-foreground">Continue reading from The Workspace Journal</p>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/journal">View all guides →</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Card key={rel.slug} className="group overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition">
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={rel.heroImage}
                        alt={rel.imageAlt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <span className="text-[11px] font-semibold text-accent">{rel.category}</span>
                      <h3 className="font-bold font-headline text-sm text-foreground group-hover:text-accent transition-colors leading-snug">
                        <Link href={`/journal/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{rel.excerpt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
