// apps/web/src/components/ui/header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- NEW: Import usePathname
import { useScroll } from '@/lib/hooks/use-scroll';
import { cn } from '@/lib/utils';

export const Header = () => {
  const scrolled = useScroll();
  const pathname = usePathname(); // <-- NEW: Get the current URL path

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b border-transparent transition-all',
        {
          'border-border bg-background/80 backdrop-blur-sm': scrolled,
        }
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">City Pulse</h1>
          </Link>
          <nav className="flex space-x-6">
            {/* ================================================================= */}
            {/* ========= NEW: Conditionally render the Home link =========== */}
            {pathname !== '/' && (
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
              >
                Home
              </Link>
            )}
            {/* ================================================================= */}
          </nav>
        </div>
      </div>
    </header>
  );
};