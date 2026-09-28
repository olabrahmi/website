import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  id?: string;
  children: ReactNode;
  intro?: string;
  className?: string;
}

export default function SectionHeading({ id, children, intro, className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-[46rem]', className)}>
      <h2 id={id} className="text-ink text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-[1.1] tracking-[-0.02em]">
        {children}
      </h2>
      {intro && <p className="text-ink-muted mt-4 max-w-[65ch]">{intro}</p>}
    </div>
  );
}
