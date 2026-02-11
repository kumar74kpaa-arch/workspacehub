import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
                Have a question? We’re happy to help!
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Feel free to reach out to us anytime between 9:00 AM and 5:00 PM, Monday to Saturday.
                </p>
            </div>
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p className="flex items-center gap-3">
                            <span role="img" aria-label="email">📧</span>
                            <span>Email: info.9to5workspace@gmail.com</span>
                        </p>
                        <p className="flex items-center gap-3">
                            <span role="img" aria-label="phone">📞</span>
                            <span>Ms. Jyoti: +91-8800337608</span>
                        </p>
                        <p className="flex items-center gap-3">
                           <span role="img" aria-label="phone">📞</span>
                           <span>Ms. Sunayana: +91-9810021209</span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
