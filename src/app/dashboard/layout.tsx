
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getNavLinks } from '@/lib/nav-links';
import Logo from '@/components/logo';
import ApiKeyManager from '@/components/api-key-manager';
import { Button } from '@/components/ui/button';
import { ChevronsLeft, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useApiKey } from '@/hooks/use-api-key';
import ThemeSwitcher from '@/components/theme-switcher';

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const { isOwner } = useApiKey();
  const navLinks = getNavLinks(isOwner);
  
  const handleLinkClick = () => {
    if(onLinkClick) {
        onLinkClick();
    }
  }

  return (
      <>
        <SheetHeader className="flex h-16 shrink-0 items-center border-b px-6">
            <Logo />
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
        {navLinks.map((link) => (
            <Tooltip key={link.href} delayDuration={0}>
            <TooltipTrigger asChild>
                <Link
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                    'flex items-center gap-4 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground',
                    pathname === link.href && 'bg-primary/10 text-foreground'
                )}
                >
                <link.icon className="h-5 w-5" />
                <span className='whitespace-nowrap'>
                    {link.label}
                </span>
                </Link>
            </TooltipTrigger>
            </Tooltip>
        ))}
        </nav>
    </>
  )
}

function CollapsibleSidebar({ pathname }: { pathname: string }) {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const { isOwner } = useApiKey();
    const navLinks = getNavLinks(isOwner);

    return (
         <aside
          className={cn(
            'hidden lg:flex flex-col border-r bg-background transition-all duration-300 ease-in-out sticky top-0 h-screen',
            isCollapsed ? 'w-20' : 'w-64'
          )}
        >
            <div className="flex h-16 shrink-0 items-center border-b px-6">
                <Logo isCollapsed={isCollapsed} />
            </div>
            <nav className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
            {navLinks.map((link) => (
                <Tooltip key={link.href} delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link
                    href={link.href}
                    className={cn(
                        'flex items-center gap-4 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground',
                        pathname === link.href && 'bg-primary/10 text-foreground',
                        isCollapsed && 'justify-center'
                    )}
                    >
                    <link.icon className="h-5 w-5" />
                    <span className={cn('whitespace-nowrap', isCollapsed && 'hidden')}>
                        {link.label}
                    </span>
                    </Link>
                </TooltipTrigger>
                {isCollapsed && (
                    <TooltipContent side="right">
                    {link.label}
                    </TooltipContent>
                )}
                </Tooltip>
            ))}
            </nav>
            <div className="mt-auto flex flex-col items-center gap-4 p-4 border-t">
                 <Button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    variant="outline"
                    size={isCollapsed ? 'icon' : 'default'}
                    className="h-10 w-full"
                >
                    <ChevronsLeft
                    className={cn(
                        'h-5 w-5 transition-transform duration-200',
                        isCollapsed && 'rotate-180'
                    )}
                    />
                    <span className={cn(isCollapsed && 'hidden', 'ml-2')}>Collapse</span>
                </Button>
            </div>
        </aside>
    )
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-muted/40 lg:grid lg:grid-cols-[auto_1fr]">
        <CollapsibleSidebar pathname={pathname} />
        <div className="flex flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
                 <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col p-0 w-full max-w-sm">
                        <SidebarContent onLinkClick={() => setSheetOpen(false)} />
                    </SheetContent>
                </Sheet>
                
                <div className="flex-1 hidden lg:block">
                  {/* Placeholder for breadcrumbs or page title if needed */}
                </div>
                
                <div className="flex-1 lg:hidden">
                    <Logo />
                </div>
                
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    <ApiKeyManager />
                </div>
            </header>
             <main className="flex-grow p-4 md:gap-8 md:p-8 lg:p-10">
                <div className="mx-auto w-full max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
