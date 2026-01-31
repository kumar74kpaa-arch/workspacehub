import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="w-full border-t">
      <div className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Logo />
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Deskify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
