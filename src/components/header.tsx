import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Home
            </Link>
            <Link href="/#memberships" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Memberships
            </Link>
            <Link href="/#tour" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Tour
            </Link>
             <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Workspace
            </Link>
          </nav>
        </div>
        {/* Mobile header can be added here */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search can go here */}
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
