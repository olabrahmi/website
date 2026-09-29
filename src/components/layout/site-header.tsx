'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';

import { nav, person } from '@/content/site';
import { useCvDownload } from '@/hooks/use-cv-download';
import { cn } from '@/utils/cn';

import HeaderBlurEffect from './header-blur-effect';
import SiteMark from './site-mark';
import ThemeToggle from './theme-toggle';

/**
 * Full width, fixed to the top, no background, no border. Roomy on all sides.
 * HeaderBlurEffect sits just below it (z-49): a stack of masked backdrop blurs, 1px up to 16px.
 */
export default function SiteHeader() {
  const [hovered, setHovered] = useState<string | null>(null);
  const cv = useCvDownload();

  return (
    <>
      <HeaderBlurEffect />
      <header style={{ viewTransitionName: 'site-header' }} className="fixed inset-x-0 top-0 z-50">
        <div className="flex w-full items-center justify-between gap-3 px-5 py-5 sm:px-10 sm:py-7">
          <Link
            href="/"
            aria-label="Oussama Labrahmi, home"
            className="text-ink flex items-center transition-opacity hover:opacity-70"
          >
            <SiteMark className="h-10 w-auto sm:h-11" />
          </Link>
          <div className="flex items-center gap-2">
            <nav aria-label="Main" className="flex items-center" onPointerLeave={() => setHovered(null)}>
              {nav.map((item) => {
                const isDownload = 'download' in item;
                const className = cn(
                  'relative isolate rounded-full px-3 py-2 text-base font-medium transition-colors duration-150 sm:px-4',
                  hovered === item.href ? 'text-accent' : 'text-ink-muted',
                  // On phones the hero already has this button.
                  isDownload && 'max-sm:hidden',
                );
                const onPointerEnter = (event: React.PointerEvent) => {
                  if (event.pointerType === 'mouse') setHovered(item.href);
                };
                const content = (
                  <>
                    {hovered === item.href && (
                      <motion.span
                        layoutId="nav-pill"
                        className="bg-accent-soft absolute inset-0 -z-10 rounded-full"
                        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                      />
                    )}
                    {isDownload && cv.blocked ? 'Email for CV' : item.label}
                  </>
                );

                return isDownload ? (
                  <a
                    key={item.href}
                    href={cv.blocked ? `mailto:${person.email}?subject=CV` : item.href}
                    {...(cv.blocked ? {} : { download: true, onClick: cv.onClick })}
                    className={className}
                    onPointerEnter={onPointerEnter}
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={item.href} href={item.href} className={className} onPointerEnter={onPointerEnter}>
                    {content}
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
    </>
  );
}
