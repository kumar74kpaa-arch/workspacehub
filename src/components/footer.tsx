import { Logo } from './logo';
import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Logo />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Ground, 17/109, Lower, Vikram Vihar, Lajpat Nagar 4, New Delhi, Delhi 110024</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center md:text-right">
          &copy; {new Date().getFullYear()} Workspace Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
