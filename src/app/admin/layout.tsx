'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Inbox,
  Calendar,
  Users,
  Building2,
  Ban,
  CreditCard,
  Star,
  ShieldAlert,
  BarChart3,
  Settings,
  PanelLeft,
  Search,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { UserNav } from '@/components/dashboard/user-nav';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface NavItem {
  href: string;
  icon: any;
  label: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { href: '/admin', icon: Home, label: 'Overview' },
      { href: '/admin/enquiries', icon: Inbox, label: 'Enquiries & Forms' },
      { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
      { href: '/admin/users', icon: Users, label: 'Members & Users' },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { href: '/admin/resources', icon: Building2, label: 'Locations & Resources' },
      { href: '/admin/blocker', icon: Ban, label: 'Availability & Blocked Slots' },
      { href: '/admin/payments', icon: CreditCard, label: 'Payments & Revenue' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
      { href: '/admin/grievances', icon: ShieldAlert, label: 'Grievances' },
      { href: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

function AdminLoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">Verifying administrator credentials...</p>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user || !firestore) {
      router.replace('/login');
      return;
    }

    const checkAdminStatus = async () => {
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.replace('/dashboard');
      } finally {
        setCheckingRole(false);
      }
    };

    checkAdminStatus();
  }, [user, authLoading, firestore, router]);

  if (authLoading || checkingRole || !isAdmin) {
    return <AdminLoadingScreen />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <Sidebar collapsible="icon" className="hidden md:flex border-r border-border/80">
          <SidebarHeader className="p-4 border-b border-border/60">
            <Logo />
            <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-1">
              Admin Portal
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-3 space-y-4">
            {navSections.map((section) => (
              <SidebarGroup key={section.title} className="p-0">
                <SidebarGroupLabel className="text-[10px] font-semibold tracking-wider text-muted-foreground/80 px-2 py-1 mb-1">
                  {section.title}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                      return (
                        <SidebarMenuItem key={item.label}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  asChild
                                  isActive={isActive}
                                  className={cn(
                                    'transition-colors font-medium text-xs',
                                    isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                                  )}
                                >
                                  <Link href={item.href}>
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    <span>{item.label}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side="right" sideOffset={10}>
                                {item.label}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-border/60">
            <SidebarMenu>
              <SidebarMenuItem>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild className="text-xs">
                        <Link href="/">
                          <ExternalLink className="h-4 w-4" />
                          <span>View Public Site</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      View Public Site
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 sm:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="md:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs p-6 overflow-y-auto">
                <div className="mb-6">
                  <Logo />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mt-1">
                    Admin Portal
                  </span>
                </div>
                <div className="space-y-6">
                  {navSections.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                        {section.title}
                      </div>
                      <nav className="grid gap-1">
                        {section.items.map((item) => {
                          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted',
                                isActive && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold'
                              )}
                            >
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Back to Public Site</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search resources, users, bookings..."
                className="w-full rounded-lg bg-background pl-8 md:w-[240px] lg:w-[320px] text-xs h-9"
              />
            </div>
            <UserNav />
          </header>

          <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
