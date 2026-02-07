import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LocationMap from '@/components/LocationMap';
import MiglanisLocationMap from '@/components/MiglanisLocationMap';
import { Mail, Phone } from 'lucide-react';

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Send us a message</CardTitle>
                            <CardDescription>Fill out the form and we'll get back to you shortly.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="Inquiry about..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea id="message" placeholder="Your message here..." />
                            </div>
                            <Button className="w-full">Send Message</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-muted-foreground">
                            <div className="flex items-center gap-4">
                                <Mail className="h-5 w-5" />
                                <span>contact@9to5workspace.com</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="h-5 w-5" />
                                <span>+91 987 654 3210</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Our Locations</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                             <div>
                               <h3 className="font-semibold mb-2">The Banyan</h3>
                               <LocationMap />
                             </div>
                             <div>
                               <h3 className="font-semibold mb-2">The Olive</h3>
                               <MiglanisLocationMap />
                             </div>
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
