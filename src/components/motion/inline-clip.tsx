'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { usePlayWhenVisible } from '@/hooks/use-play-when-visible';

/**
 * A small looping clip that sits inline with the text around it, 1.6em tall.
 * data-wipe makes it appear as a line sweeping left to right when it scrolls into view. Unlike the other reveals it
 * repeats: leaving the viewport resets it (hidden again, video back to 0:00), so the wipe and the clip replay on the
 * next visit. data-repeat tells RevealProvider to leave it alone.
 * Decorative, so it is hidden from screen readers. It downloads and plays only while near the viewport, and never under reduced motion.
 */
export default function InlineClip({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  usePlayWhenVisible(ref, !reduce);

  useEffect(() => {
    const video = ref.current;

    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.setAttribute('data-in', '');
          video.currentTime = 0;
          if (!reduce) video.play().catch(() => {});
        } else {
          video.removeAttribute('data-in');
          video.pause();
          video.currentTime = 0;
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [reduce]);

  return (
    <video
      ref={ref}
      data-wipe=""
      data-repeat=""
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
