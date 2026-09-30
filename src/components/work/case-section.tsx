import type { ReactNode } from 'react';

import { Reveal } from '@/components/motion';
import { cn } from '@/utils/cn';

interface CaseSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/** One block of a case study. The id doubles as the anchor for CaseToc. */
export default function CaseSection({ id, title, children, className }: CaseSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('border-rule scroll-mt-36 border-t py-9 first:border-t-0 first:pt-0 lg:scroll-mt-32', className)}
    >
      <Reveal className="flex flex-col gap-5">
        <h2 id={`${id}-title`} className="type-h3 text-ink text-[1.375rem]">
          {title}
        </h2>
        {children}
      </Reveal>
    </section>
  );
}
