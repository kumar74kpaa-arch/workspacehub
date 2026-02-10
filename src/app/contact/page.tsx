import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Phone, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24 max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
                Contact Us
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                We'd love to hear from you. Get in touch with us for any inquiries.
                </p>
            </div>
            <div className="max-w-md mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <div className="flex items-center gap-4">
                            <Mail className="h-5 w-5" />
                            <span>info@9to5workspace.com</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="h-5 w-5" />
                            <span>Ms. Jyoti: +91-8800337608</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="h-5 w-5" />
                            <span>Ms. Sunayana: +91-9810021209</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Clock className="h-5 w-5" />
                            <span>9AM to 5PM Monday to Saturday</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
