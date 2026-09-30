import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

export default function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'bg-accent-soft text-accent inline-flex items-center rounded-full px-2.5 py-1 font-sans text-xs leading-none font-medium',
        className,
      )}
    >
      {children}
    </span>
  );
}
