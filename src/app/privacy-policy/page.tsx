import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container py-12 md:py-24 max-w-4xl mx-auto">
          <div className="prose lg:prose-lg">
            <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl mb-8">
              Privacy Policy
            </h1>
            <p>
              Your privacy is important to us. It is 9to5's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. This includes information for booking, account creation, and payment processing, such as your name, email, phone number, and payment details.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our services</li>
              <li>Process your bookings and payments</li>
              <li>Communicate with you, including for customer service and support</li>
              <li>Send you updates and promotional materials (with your consent)</li>
              <li>Improve and personalize our services</li>
              <li>Prevent fraudulent activities</li>
            </ul>
            
            <h2>3. Security</h2>
            <p>
              We are committed to protecting your data. We use commercially acceptable means to protect your personal information, but remember that no method of transmission over the internet or electronic storage is 100% secure.
            </p>

            <h2>4. Your Rights</h2>
            <p>
              You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services. You have the right to access, update, or delete the information we have on you.
            </p>

            <p>This policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
