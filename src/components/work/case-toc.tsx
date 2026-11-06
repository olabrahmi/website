'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

export interface TocItem {
  id: string;
  label: string;
}

/**
 * Where you are in the case study, one component, two layouts:
 *
 *   sections ──▶ IntersectionObserver ──▶ active id ──▶ sliding pill
 *                                                    └▶ (phones) chip scrolls to center
 *
 *   lg and up: a sticky rail beside the text.   Below lg: a floating island under the header.
 */
export default function CaseToc({
  items,
  footer,
  className,
}: {
  items: TocItem[];
  /** Under the list, on the rail only. */
  footer?: ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Anything above the line 30% down the screen counts as passed. The last one passed is the one being read, so
    // this works for whole sections and for bare headings.
    const passed = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) passed.add(entry.target.id);
          else passed.delete(entry.target.id);
        }

        const current = items.findLast((item) => passed.has(item.id));

        if (current) setActive(current.id);
      },
      { rootMargin: '1000000px 0px -70% 0px' },
    );

    for (const item of items) {
      const section = document.getElementById(item.id);

      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const container = list.current;
    const chip = container?.querySelector<HTMLElement>(`[data-toc="${active}"]`);

    if (!container || !chip || container.scrollWidth <= container.clientWidth) return;

    container.scrollTo({ left: chip.offsetLeft - (container.clientWidth - chip.clientWidth) / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <nav
      aria-label="On this page"
      className={cn(
        // Phones and tablets: a floating island under the header, above its blur (z-49) and the header (z-50).
        // lg and up: a plain sticky rail in the left column.
        'bg-paper/80 border-rule sticky top-[4.75rem] z-[51] mx-auto w-fit max-w-full rounded-full border p-1 shadow-[0_10px_30px_-12px_oklch(0%_0_0/0.45)] backdrop-blur-md lg:top-32 lg:z-auto lg:mx-0 lg:w-auto lg:self-start lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none',
        className,
      )}
    >
      <ul
        ref={list}
        className="flex [scrollbar-width:none] gap-1 overflow-x-auto lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              data-toc={item.id}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn(
                'relative isolate block rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition-colors duration-150 lg:rounded-xl lg:leading-snug lg:whitespace-normal',
                active === item.id ? 'text-accent' : 'text-ink-muted hover:text-ink',
              )}
            >
              {active === item.id && (
                <motion.span
                  layoutId="toc-pill"
                  className="bg-accent-soft absolute inset-0 -z-10 rounded-full lg:rounded-xl"
                  transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
                />
              )}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {footer && <div className="mt-4 hidden lg:block">{footer}</div>}
    </nav>
  );
}
