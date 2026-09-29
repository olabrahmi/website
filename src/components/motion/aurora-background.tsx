import type { HTMLProps, ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface AuroraBackgroundProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/**
 * Hero aurora, from the v2 branch (src/components/sections/hero/components/aurora-background.tsx), rebuilt to be cheap.
 * The original animated background-position under a blur filter, a mix-blend-difference layer and a fixed
 * background, which repainted the whole hero every frame (about 700ms of main-thread work per 3 seconds).
 *
 *   container (static, masked to glow from the top right, contain: paint)
 *     └─ .aurora-layer  200% wide, gradients painted ONCE, drifts sideways with a transform animation
 *
 * A transform animation runs on the compositor: no layout, no repaint, no main thread. The bands and stripes are the
 * same gradients and colors as before (see .aurora-layer in globals.css).
 */
export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn('bg-paper relative flex min-h-[500px] flex-col items-center justify-center', className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 overflow-hidden [contain:paint]',
          showRadialGradient && '[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]',
        )}
      >
        <div className="aurora-layer absolute inset-y-0 left-0 w-[200%] opacity-50" />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
