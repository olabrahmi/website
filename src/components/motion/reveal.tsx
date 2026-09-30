import type { CSSProperties, ElementType, ReactNode } from 'react';

interface RevealProps {
  as?: ElementType;
  /** Stagger position inside a group: each step waits 60ms more. */
  index?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Marks a below-the-fold wrapper for the scroll reveal (see RevealProvider).
 * Wrap cards, never style the card itself: the reveal owns this element's transition.
 * Never use above the fold.
 */
export default function Reveal({ as: Component = 'div', index = 0, className, children }: RevealProps) {
  return (
    <Component data-reveal="" style={{ '--i': index } as CSSProperties} className={className}>
      {children}
    </Component>
  );
}
