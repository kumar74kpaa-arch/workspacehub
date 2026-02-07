import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import SeatBookingClient from '@/components/booking/seat-booking-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

function BookingPageSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                     <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-[280px]" />
                     </div>
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-10 w-[280px]" />
                     </div>
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-96 w-full" />
            </CardContent>
        </Card>
    );
}

export default function SeatBookingPage({ searchParams }: { searchParams: { office?: string } }) {
  const officeId = searchParams.office;

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-16">
            <Suspense fallback={<BookingPageSkeleton />}>
                <SeatBookingClient officeId={officeId} />
            </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
