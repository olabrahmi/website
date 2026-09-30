import type { HTMLProps, ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface AuroraBackgroundProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/**
 * Hero aurora. The v2 original drew its look with background-position animation, a blur filter and a
 * mix-blend-difference layer, which repainted the hero every frame (about 700ms of main-thread work per 3 seconds).
 * This keeps the feel with layers that cost nothing per frame:
 *
 *   container (static, masked to glow from the top right, contain: paint)
 *     ├─ .aurora-glow           soft blue, indigo and violet glows, breathing slowly
 *     ├─ .aurora-curtain-a      diagonal bands drifting left
 *     └─ .aurora-curtain-b      finer bands at another angle and speed, drifting right
 *
 * The two curtains slide through each other, which is what makes it shimmer. All transform animations: compositor only.
 * See .aurora-* in globals.css.
 *
 * AuroraLayers is the effect on its own (the footer uses it, flipped so the glow sits at the bottom).
 */
export const AuroraLayers = ({
  className,
  flip = false,
  showRadialGradient = true,
}: {
  className?: string;
  /** Mirrors the effect vertically, so the glow that starts at the top right starts at the bottom right. */
  flip?: boolean;
  showRadialGradient?: boolean;
}) => (
  <div
    aria-hidden="true"
    className={cn(
      'pointer-events-none absolute inset-0 overflow-hidden [contain:paint]',
      showRadialGradient && '[mask-image:radial-gradient(ellipse_90%_100%_at_75%_0%,black_20%,transparent_80%)]',
      flip && '-scale-y-100',
      className,
    )}
  >
    <div className="aurora-glow" />
    <div className="aurora-curtain aurora-curtain-a" />
    <div className="aurora-curtain aurora-curtain-b" />
  </div>
);

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
      <AuroraLayers showRadialGradient={showRadialGradient} />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
