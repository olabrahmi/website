'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Plays a video only while it is on screen (plus a 200px margin) and pauses it otherwise. Pair it with
 * preload="none" and no autoPlay, so a clip does not download or decode until the visitor is about to see it.
 */
export function usePlayWhenVisible(ref: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const video = ref.current;

    if (!video || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: '200px' },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [ref, enabled]);
}
