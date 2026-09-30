'use client';

import type { ElementType, PointerEvent, ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface SpotlightCardProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Card whose accent edge follows the pointer. Writes CSS variables straight to the node: no state, no re-render. */
export default function SpotlightCard({ as: Component = 'div', className, children }: SpotlightCardProps) {
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;

    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();

    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <Component onPointerMove={onPointerMove} className={cn('spot', className)}>
      {children}
    </Component>
  );
}
