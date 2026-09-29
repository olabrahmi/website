import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  id?: string;
  /** '01 / Now': the section index, in the accent color. */
  eyebrow: string;
  children: ReactNode;
  intro?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  id,
  eyebrow,
  children,
  intro,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-[40rem]', align === 'center' && 'md:mx-auto md:text-center', className)}>
      <p className="type-eyebrow text-accent">{eyebrow}</p>
      <h2 id={id} className="type-h2 text-ink mt-3">
        {children}
      </h2>
      {intro && <p className="text-ink-muted mt-3">{intro}</p>}
    </div>
  );
}
