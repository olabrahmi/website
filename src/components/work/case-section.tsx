import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface CaseSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function CaseSection({ id, title, children, className }: CaseSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className={cn('border-rule grid gap-6 border-t py-12 lg:grid-cols-12 lg:gap-10', className)}
    >
      <h2
        id={id}
        className="text-ink text-[clamp(1.375rem,1.1rem+0.8vw,1.75rem)] leading-tight tracking-[-0.015em] lg:col-span-4"
      >
        {title}
      </h2>
      <div className="flex flex-col gap-5 lg:col-span-8">{children}</div>
    </section>
  );
}
