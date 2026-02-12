import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Coffee, Printer, IndianRupee, Users } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const PricingTier = ({ title, price, period, popular, originalPrice, savings, children }: { title: string, price: string, period: string, popular?: boolean, originalPrice?: string, savings?: string, children: React.ReactNode }) => (
    <div className={`p-6 rounded-lg border bg-card h-full flex flex-col ${popular ? 'border-primary' : ''}`}>
        {popular && <Badge className="mb-2 self-start">Most Popular</Badge>}
        {originalPrice && <Badge variant="secondary" className="mb-2 self-start bg-accent/10 text-accent">Early Bird Offer</Badge>}
        <h3 className="text-xl font-semibold">{title}</h3>
        {originalPrice && (
            <p className="mt-2 text-lg text-muted-foreground">
                <span className="line-through">{originalPrice}</span>
            </p>
        )}
        <p className={`text-3xl font-bold ${originalPrice ? 'mt-0' : 'mt-2'}`}>
            {price}<span className="text-base font-normal text-muted-foreground">/{period}</span>
        </p>
        {savings && (
             <p className="mt-1 text-sm font-semibold text-green-600">
                {savings}
            </p>
        )}
        <div className="mt-4 text-sm text-muted-foreground flex-grow">{children}</div>
    </div>
);

const InfoCard = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-accent" />
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
)

export default function PricesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section id="prices" className="w-full py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">Flexible & Transparent Pricing</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that works for you. No hidden fees. All prices are inclusive of taxes.
              </p>
            </div>
            
            <div className="grid gap-12">
                <InfoCard title="Workstation Rates" icon={IndianRupee}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <PricingTier title="Hourly Pass" price="₹350" period="hour">
                           <ul className="space-y-2">
                               <li>High-speed WiFi</li>
                               <li>Does NOT include beverages</li>
                           </ul>
                       </PricingTier>
                       <PricingTier 
                            title="Day Pass" 
                            price="₹1000" 
                            period="day" 
                            popular
                            originalPrice="₹3000"
                            savings="You save ₹2000 (66.67% off)"
                        >
                            <ul className="space-y-2">
                               <li>9:30AM – 5:30PM access</li>
                               <li>High-speed WiFi</li>
                               <li className="font-semibold">Includes 1-2 free beverages (Tea/Coffee)</li>
                               <li>Extra hours (till 8PM): ₹200/hr</li>
                            </ul>
                       </PricingTier>
                       <PricingTier 
                            title="Month Pass" 
                            price="₹26,000" 
                            period="month"
                            originalPrice="₹45,000"
                            savings="You save ₹19,000 (42.22% off)"
                        >
                           <ul className="space-y-2">
                               <li>Access for 26 working days</li>
                               <li>All Day Pass benefits</li>
                               <li>Free beverages included</li>
                           </ul>
                       </PricingTier>
                    </div>
                </InfoCard>

                <InfoCard title="Meeting Rooms" icon={Users}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 rounded-lg border bg-card/50">
                            <Badge variant="secondary" className="mb-2 self-start bg-accent/10 text-accent">Special Launch Price</Badge>
                            <h3 className="text-lg font-semibold">Small Meeting Room (4 People)</h3>
                            <p className="mt-1 text-muted-foreground"><span className="line-through">₹1500</span></p>
                            <p className="mt-0 text-2xl font-bold">₹750 <span className="text-base font-normal text-muted-foreground">/ hour</span></p>
                            <p className="mt-1 text-sm font-semibold text-green-600">50% off</p>
                         </div>
                         <div className="p-6 rounded-lg border bg-card/50">
                            <Badge variant="secondary" className="mb-2 self-start bg-accent/10 text-accent">Special Launch Price</Badge>
                            <h3 className="text-lg font-semibold">Conference Room (9 People)</h3>
                             <p className="mt-1 text-muted-foreground"><span className="line-through">₹2000</span></p>
                            <p className="mt-0 text-2xl font-bold">₹1000 <span className="text-base font-normal text-muted-foreground">/ hour</span></p>
                            <p className="mt-1 text-sm font-semibold text-green-600">50% off</p>
                            <p className="mt-2 text-sm text-muted-foreground">Extra Participant: ₹100 per person per hour</p>
                         </div>
                     </div>
                </InfoCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <InfoCard title="Beverages" icon={Coffee}>
                        <p className="text-muted-foreground mb-4">Included with Day/Month passes. Chargeable for hourly bookings.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between"><span>Coffee</span> <strong>₹30</strong></li>
                            <li className="flex justify-between"><span>Tea</span> <strong>₹25</strong></li>
                            <li className="flex justify-between"><span>Lemonade</span> <strong>₹50</strong></li>
                        </ul>
                    </InfoCard>
                    <InfoCard title="Printing & Scanning" icon={Printer}>
                        <p className="text-muted-foreground mb-4">Available on demand.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between"><span>Black & White Print (A4)</span> <strong>₹3 / page</strong></li>
                            <li className="flex justify-between"><span>Color Print (A4)</span> <strong>₹8 / page</strong></li>
                            <li className="flex justify-between"><span>A4 Scanning</span> <strong>₹5 / page</strong></li>
                            <li className="flex justify-between"><span>Photocopy</span> <strong>₹3 / page</strong></li>
                        </ul>
                    </InfoCard>
                </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
