import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: "What are the operating hours?",
    answer: "Our standard operating hours are from 8:00 AM to 8:00 PM, Monday to Saturday."
  },
  {
    question: "Is there a trial day pass?",
    answer: "Yes, you can purchase a Day Pass to experience our workspace. If you decide to upgrade to a monthly plan on the same day, we'll credit the cost of the pass towards your membership."
  },
  {
    question: "What is your policy on guests?",
    answer: "You can bring guests for meetings in a booked meeting room. However, guests are not permitted to use the open coworking areas without their own pass."
  },
  {
    question: "Can I use the space for events?",
    answer: "Yes, our event space and conference halls can be booked for private events. Please contact our community manager for rates and availability."
  },
  {
    question: "What about printing and scanning?",
    answer: "Printing and scanning services are available for a nominal fee. You can see the pricing at the printing station. Monthly members receive a complimentary credit for printing."
  },
  {
    question: "Is parking available?",
    answer: "Yes, on-site parking is available for members and visitors. Please note that parking is at your own risk, and the management is not responsible for any damage or theft."
  }
];

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about our workspace and services.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left font-semibold">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

        </div>
      </main>
      <Footer />
    </>
  );
}
