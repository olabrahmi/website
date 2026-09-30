'use client';

import { useReducedMotion } from 'motion/react';
import { useRef } from 'react';

import { usePlayWhenVisible } from '@/hooks/use-play-when-visible';

interface LoopVideoProps {
  src: string;
  poster?: string;
  label: string;
}

/** Nothing downloads until the clip is near the viewport, and it pauses when it leaves. */
export default function LoopVideo({ src, poster, label }: LoopVideoProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  usePlayWhenVisible(ref, !reduce);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="none"
      controls={!!reduce}
    />
  );
}
