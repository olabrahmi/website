'use client';

import { useReducedMotion } from 'motion/react';
import { useRef } from 'react';

import { usePlayWhenVisible } from '@/hooks/use-play-when-visible';

/**
 * A small looping clip that sits inline with the text around it, 1.6em tall.
 * data-wipe makes it appear as a line sweeping left to right when it scrolls into view.
 * Decorative, so it is hidden from screen readers. It downloads and plays only while near the viewport, and never under reduced motion.
 */
export default function InlineClip({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  usePlayWhenVisible(ref, !reduce);

  return (
    <video
      ref={ref}
      data-wipe=""
      src={src}
      aria-hidden="true"
      muted
      loop
      playsInline
      preload="none"
      className="mx-1 inline-block h-[1.6em] w-auto rounded-lg align-middle"
    />
  );
}
