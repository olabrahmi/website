import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export default function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'border-rule bg-surface text-ink-muted inline-flex items-center rounded-md border px-2 py-1 font-mono text-[0.8125rem] leading-none',
        className,
      )}
    >
      {children}
    </span>
  );
}
