import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: "Day Pass",
    price: "₹599",
    period: "per day",
    features: ["Flexible access", "High-speed WiFi", "Tea & Coffee"],
    cta: "Reserve Workspace",
    href: "/seat-booking"
  },
  {
    name: "Quarterly",
    price: "₹14,999",
    period: "per quarter",
    features: ["Dedicated desk option", "12 hours meeting room credit", "All Day Pass benefits"],
    cta: "Contact Us",
    href: "/contact",
    popular: true
  },
  {
    name: "Annual",
    price: "₹65,999",
    period: "per year",
    features: ["All quarterly benefits", "1 month free", "Company mailbox service"],
    cta: "Contact Us",
    href: "/contact"
  }
];

export default function PricesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section id="prices" className="w-full py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">Flexible Memberships for Everyone</h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the membership that fits your work style. No hidden fees, no long-term commitments.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
              {plans.map((plan) => (
                <Card key={plan.name} className={plan.popular ? 'border-primary relative' : ''}>
                  {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1 text-sm font-bold rounded-full">POPULAR</div>}
                  <CardHeader className="text-center pt-12">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-4xl font-bold">{plan.price}</CardDescription>
                    <p className="text-muted-foreground">{plan.period}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                        <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
