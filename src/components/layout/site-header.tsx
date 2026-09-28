'use client';

import Link from 'next/link';

import { nav } from '@/content/site';
import { useScroll } from '@/hooks/use-scroll';
import { cn } from '@/utils/cn';

import SiteMark from './site-mark';
import ThemeToggle from './theme-toggle';

const hideOnSmall = new Set(['About', 'CV']);

export default function SiteHeader() {
  const { isScrolled } = useScroll({ threshold: 20 });

  return (
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4">
      <div
        className={cn(
          'ease-out-strong flex w-full max-w-[1200px] items-center justify-between gap-2 rounded-full border border-transparent py-1.5 pr-1.5 pl-4 transition-[max-width,background-color,border-color] duration-300 motion-reduce:transition-none',
          isScrolled && 'border-rule bg-paper/80 max-w-[760px] backdrop-blur-md',
        )}
      >
        <Link href="/" aria-label="Oussama Labrahmi, home" className="text-ink flex items-center hover:opacity-70">
          <SiteMark className="h-7 w-auto" />
        </Link>
        <nav aria-label="Main" className="flex items-center">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-ink-muted hover:text-ink rounded-full px-2.5 py-2 text-[0.9375rem] transition-colors sm:px-3.5',
                hideOnSmall.has(item.label) && 'max-sm:hidden',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
