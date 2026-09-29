'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Scroll reveal, one observer for the whole site.
 *
 *   server HTML ──▶ [data-reveal]            visible (no JS, or JS not ready)
 *   head script ──▶ html.js                  CSS now hides [data-reveal]:not([data-in])
 *   this effect ──▶ enters viewport ──▶ data-in ──▶ CSS transition plays, once
 *   2.5s failsafe ─▶ CSS shows anything still hidden, but only until this effect adds html.reveal-ready
 *                    (slow or broken JS). After that, elements wait for their scroll.
 *
 * The layout survives client navigations, so the scan re-runs on every pathname change.
 * [data-wipe] works the same way but plays a left-to-right clip instead of the fade (see globals.css).
 * Elements already on screen or above it at scan time (deep links, back navigation) show at once.
 */
export default function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    // From here on the CSS failsafe stands down: hidden elements wait for their scroll.
    document.documentElement.classList.add('reveal-ready');

    const pending = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in]), [data-wipe]:not([data-in])'),
    );

    if (pending.length === 0) return;

    const show = (element: Element) => element.setAttribute('data-in', '');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
            show(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    for (const element of pending) {
      if (element.getBoundingClientRect().top < window.innerHeight) show(element);
      else observer.observe(element);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
