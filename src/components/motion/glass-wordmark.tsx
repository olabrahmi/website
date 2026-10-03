'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { cn } from '@/utils/cn';

import { canRunWebGLEffects, whenIdle } from './three/supports-webgl';

const QUERY = '(min-width: 48rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/**
 * The big "Say hello" at the bottom of the contact card. Rendered in WebGL as beveled glass that refracts a copy of the
 * card's background and aurora; everyone else (phones, reduced motion, weak devices) sees a pre-rendered image of it. It must sit inside a `relative isolate
 * overflow-hidden group/cta` card and returns two things for the card to lay out:
 *
 *   - a canvas that covers the whole card (so the WebGL background and the CSS one have no seam)
 *   - the band where the word sits, in flow, flush with the card's bottom edge (pass negative margins in `className`
 *     to cancel the card's padding)
 *
 * When the first frame is drawn it sets data-gl="on" on the card: the canvas fades in, then the card's CSS glows go
 * (they key off `group-data-[gl=on]/cta`). three is only ever loaded with import().
 */
export default function GlassWordmark({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const band = bandRef.current;
    const card = canvas?.parentElement;

    if (!canvas || !band || !card) return;

    const media = window.matchMedia(QUERY);
    let scene: { dispose: () => void } | null = null;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    const teardown = () => {
      scene?.dispose();
      scene = null;
      card.removeAttribute('data-gl');
    };

    const mount = async () => {
      const { createGlassWordmark } = await import('./three/glass-wordmark-scene');

      await whenIdle();
      if (cancelled || !media.matches) return;

      const created = createGlassWordmark({ canvas, band, onFail: teardown });

      scene = created;
      await created.ready;
      if (!cancelled && scene === created) card.setAttribute('data-gl', 'on');
    };

    const start = () => {
      if (scene || observer || !media.matches || !canRunWebGLEffects()) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          observer = null;
          void mount();
        },
        { rootMargin: '1200px 0px' },
      );
      observer.observe(card);
    };

    const onChange = () => {
      if (media.matches) start();
      else {
        observer?.disconnect();
        observer = null;
        teardown();
      }
    };

    media.addEventListener('change', onChange);
    start();

    return () => {
      cancelled = true;
      media.removeEventListener('change', onChange);
      observer?.disconnect();
      teardown();
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[calc(100%+10rem)] w-full [mask-image:linear-gradient(to_bottom,transparent_10rem,black_19rem)] opacity-0 transition-opacity duration-[600ms] group-data-[gl=on]/cta:opacity-100"
      />
      <div
        ref={bandRef}
        aria-hidden="true"
        className={cn('@container relative w-full overflow-hidden md:aspect-[100/17]', className)}
      >
        <div className="pointer-events-none px-5 transition-opacity duration-[600ms] select-none group-data-[gl=on]/cta:opacity-0 sm:px-8 md:absolute md:inset-x-0 md:bottom-0 md:flex md:h-full md:justify-center md:p-0">
          <Image
            src="/images/say-hello.webp"
            alt=""
            width={2172}
            height={431}
            sizes="(min-width: 1500px) 1500px, 100vw"
            className="-mb-[1.4vw] h-auto w-full md:mb-0 md:h-[108%] md:w-auto md:max-w-none md:translate-y-[8%] md:self-end"
          />
        </div>
      </div>
    </>
  );
}
