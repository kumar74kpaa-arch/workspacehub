import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase/provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { FloatingContact } from '@/components/contact/floating-contact';

import Script from 'next/script';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeadline = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: '9to5 Workspace - A Calm Space to Work and Think in South Delhi',
  description:
    'Thoughtfully designed coworking and meeting spaces for focused professionals, legal consultants, and growing teams in Lajpat Nagar.',
};

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
        {gaMeasurementId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script
              id="google-analytics-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', fontSans.variable, fontHeadline.variable)}>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-3xl bg-secondary/40 blur-3xl animate-floatSlow" />
          <div className="absolute bottom-20 right-20 w-72 h-72 rounded-3xl bg-muted/30 blur-3xl animate-floatSlowDelay" />
        </div>
        <FirebaseProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster />
          <FirebaseErrorListener />
          <FloatingContact />
        </FirebaseProvider>
      </body>
    </html>
  );
}
