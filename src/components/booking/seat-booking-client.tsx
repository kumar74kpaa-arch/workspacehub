'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import type { Booking } from '@/lib/definitions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { offices } from '@/lib/offices';
import InteractiveBooking from './interactive-booking';

export default function SeatBookingClient({ officeId }: { officeId?: string }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isCalendarOpen, setCalendarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const selectedOffice = offices.find(o => o.id === officeId);

  const fetchBookings = React.useCallback(async () => {
    if (!firestore || !date || !selectedOffice) return;
    setIsLoading(true);
    const dateStr = format(date, 'yyyy-MM-dd');
    const q = query(
        collection(firestore, 'bookings'), 
        where('date', '==', dateStr),
        where('officeId', '==', selectedOffice.id)
    );
    try {
        const snapshot = await getDocs(q);
        const bookingsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                startTime: (data.startTime as Timestamp).toDate(),
                endTime: (data.endTime as Timestamp).toDate(),
            } as Booking;
        });
        setBookings(bookingsData);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch bookings.' });
    } finally {
        setIsLoading(false);
    }
  }, [date, firestore, toast, selectedOffice]);

  React.useEffect(() => {
    if (selectedOffice && date) {
        fetchBookings();
    } else {
        setBookings([]);
        setIsLoading(false);
    }
  }, [selectedOffice, date, fetchBookings]);


  if (!selectedOffice) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Workspace Not Found</h2>
        <p className="text-muted-foreground mb-6">The workspace you're looking for doesn't seem to exist.</p>
        <Button asChild>
          <Link href="/spaces"><ArrowLeft className="mr-2" /> Back to Spaces</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserve Your Space at {selectedOffice.name}</CardTitle>
        <CardDescription>Select a date, then choose your preferred space below.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
          <div className="flex flex-col gap-2">
            <Label>Selected Office</Label>
            <Input value={selectedOffice.name} disabled className="w-[280px]"/>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Select Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant={'outline'} className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(day) => { setDate(day); setCalendarOpen(false); }} initialFocus disabled={(day) => day < startOfDay(new Date())} />
              </PopoverContent>
            </Popover>
          </div>
            <div className="items-top flex space-x-2 pt-8">
                <Checkbox id="terms-main" onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                    <label htmlFor="terms-main" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the <Link href="/terms-and-conditions" target="_blank" className="underline text-primary">Terms & Conditions</Link>.
                    </label>
                </div>
            </div>
        </div>
        
        <div className="relative w-full max-w-6xl mx-auto pt-6 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-center mb-2">Layout Plan</h3>
              <p className="text-center text-muted-foreground pb-4">Below is a static layout plan for reference.</p>
              <Image
                  src={selectedOffice.id === 'banyan' ? "/layouts/the-banyan-layout.jpeg" : "/layouts/the-olive-layout.jpeg"}
                  alt={selectedOffice.id === 'banyan' ? "The Banyan Layout" : "The Olive Layout"}
                  width={2000}
                  height={1200}
                  className="w-full h-auto object-contain rounded-lg border"
              />
            </div>

            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold text-center mb-4">Select Your Seat</h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : date ? (
                <InteractiveBooking
                  officeId={selectedOffice.id}
                  date={date}
                  bookings={bookings}
                  user={user}
                  agreedToTerms={agreedToTerms}
                  onBooking={fetchBookings}
                />
              ) : (
                <p className="text-center text-muted-foreground">Please select a date to see availability.</p>
              )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
