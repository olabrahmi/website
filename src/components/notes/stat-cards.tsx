import type { ReactNode } from 'react';

import { Reveal } from '@/components/motion';
import { cn } from '@/utils/cn';

interface StatProps {
  value: string;
  label: string;
  source: string;
  href: string;
  /** A real gain: green, like the metrics on a case study. */
  up?: boolean;
}

export function Stat({ value, label, source, href, up }: StatProps) {
  return (
    <li className="border-rule bg-surface flex flex-col gap-3 rounded-xl border p-4 sm:p-5">
      <p className={cn('type-metric', up ? 'text-pass' : 'text-ink')}>{value}</p>
      <p className="text-ink text-[0.9375rem] leading-snug">{label}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="text-ink-muted decoration-rule hover:text-ink mt-auto text-[0.8125rem] leading-snug underline underline-offset-2 transition-colors duration-150"
      >
        {source}
      </a>
    </li>
  );
}

export function StatCards({ children }: { children: ReactNode }) {
  return (
    <Reveal>
      <ul className="my-2 grid gap-3 sm:grid-cols-3">{children}</ul>
    </Reveal>
  );
}
