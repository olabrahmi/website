'use client';

import { useReducedMotion } from 'motion/react';

interface LoopVideoProps {
  src: string;
  poster?: string;
  label: string;
}

export default function LoopVideo({ src, poster, label }: LoopVideoProps) {
  const reduce = useReducedMotion();

  return (
    <video
      className="absolute inset-0 size-full object-cover"
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      autoPlay={!reduce}
      controls={!!reduce}
    />
  );
}
