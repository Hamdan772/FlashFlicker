
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className, isCollapsed }: { className?: string, isCollapsed?: boolean }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2.5 text-xl font-bold font-headline',
        className
      )}
    >
      <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
        <GraduationCap className="h-5 w-5" />
      </div>
      <span className={cn('whitespace-nowrap transition-opacity', isCollapsed ? 'opacity-0 hidden' : 'opacity-100')}>FlashFlicker</span>
    </Link>
  );
}
