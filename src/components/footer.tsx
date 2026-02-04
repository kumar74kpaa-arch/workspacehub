import { Logo } from './logo';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between py-8 gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Ground, 17/109, Lower, Vikram Vihar, Lajpat Nagar 4, New Delhi, Delhi 110024</span>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-4 sm:gap-6 text-muted-foreground">
                <Link href="/spaces" className="text-sm hover:text-foreground underline-offset-4 hover:underline">Explore Spaces</Link>
                <Link href="/terms-and-conditions" className="text-sm hover:text-foreground underline-offset-4 hover:underline">Terms & Conditions</Link>
                <Link href="/privacy-policy" className="text-sm hover:text-foreground underline-offset-4 hover:underline">Privacy Policy</Link>
                <Link href="/faq" className="text-sm hover:text-foreground underline-offset-4 hover:underline">FAQs</Link>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
            &copy; {new Date().getFullYear()} Workspace Hub. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
