import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24 max-w-4xl mx-auto">
          <div className="prose lg:prose-lg">
            <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl mb-8">
              Terms & Conditions
            </h1>
            <p>
              Welcome to 9to5 Workspace. By accessing our premises or using our services, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
            </p>

            <h2>1. Use of Facility</h2>
            <p>
              The workspace is intended for professional use only. We strive to maintain a focused and productive environment. Activities such as loud conversations, gossip, or general "café-like" gatherings that may disturb others are strictly prohibited.
            </p>

            <h2>2. Bookings and Payments</h2>
            <ul>
              <li>All bookings must be made through our official platform.</li>
              <li>Making a booking implies your full agreement to all our terms and conditions.</li>
              <li>Payments for all services must be completed in advance.</li>
              <li>Extended hours (6 PM - 8 PM) are subject to additional charges.</li>
            </ul>

            <h2>3. Services and Charges</h2>
            <ul>
              <li><strong>Printing & Scanning:</strong> These services are not included in the standard membership or day pass fees and will be charged separately based on usage.</li>
              <li><strong>Extra Seating:</strong> Additional seating in meeting rooms beyond the standard capacity will incur extra charges.</li>
            </ul>

            <h2>4. Conduct and Responsibility</h2>
            <ul>
              <li><strong>Parking:</strong> On-site parking is available but is entirely at the vehicle owner's risk. 9to5 Workspace is not liable for any theft, damage, or loss.</li>
              <li><strong>Personal Belongings:</strong> You are responsible for your own belongings. We are not responsible for any lost or stolen items.</li>
            </ul>

            <h2>5. Cancellations and Refunds</h2>
            <ul>
              <li>Cancellation policies vary by booking type. Please refer to your booking confirmation for details.</li>
              <li>In the event of a government-mandated shutdown or other force majeure event, we will refund any pre-paid bookings for the affected period. Such refunds will be processed without any interest.</li>
            </ul>
            
            <p>
              We reserve the right to modify these terms at any time. Your continued use of our services constitutes acceptance of the revised terms.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
