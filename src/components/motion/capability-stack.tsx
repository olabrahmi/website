'use client';

import { type ReactNode, type PointerEvent as ReactPointerEvent, useEffect, useRef } from 'react';

import Reveal from './reveal';
import type { CapabilityStack as StackScene, CapabilityStackOptions } from './three/capability-stack-scene';
import { canRunWebGLEffects, whenIdle } from './three/supports-webgl';

/** Height taken by the header above the pinned content and the breathing room below it (pt-24 and pb-6, below). */
const PIN_TOP = 96;
const PIN_BOTTOM = 24;
const MIN_FIT = 0.6;

const QUERY = '(min-width: 48rem) and (min-height: 46rem) and (prefers-reduced-motion: no-preference)';

interface CapabilityStackProps {
  /** The section heading, rendered on the server. */
  heading: ReactNode;
  /** The list, rendered on the server: one <li> per slab, top slab first. */
  children: ReactNode;
  data: { title: string; proof: string[] }[];
}

/**
 * "What I do" as a pinned 3D stack. Everyone who does not qualify (phones, short windows, reduced motion, no WebGL2,
 * a section already on screen when the scene is ready) keeps the 2x2 grid and never downloads three.
 *
 *   data-stack="off"  grid (the server HTML)          data-stack="on"  pinned section, canvas beside the list
 *
 * three is only ever loaded with import() from the effect below. The scene writes data-active, data-dim and data-lit
 * on the list items and data-locked on the section itself: no React state per frame.
 */
export default function CapabilityStack({ heading, children, data }: CapabilityStackProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<(_index: number | null) => void>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const list = listRef.current;
    const column = columnRef.current;

    if (!section || !canvas || !list || !column) return;

    const media = window.matchMedia(QUERY);
    let scene: { dispose: () => void } | null = null;
    let observer: IntersectionObserver | null = null;
    let waiter: IntersectionObserver | null = null;
    let cancelled = false;

    // The pinned view is one screen tall, so the list must fit it whatever the window height: zoom the left column
    // down (never below MIN_FIT) until it does. Re-measured from full size on every resize.
    const fit = () => {
      const pin = section.firstElementChild as HTMLElement;
      const available = pin.offsetHeight - PIN_TOP - PIN_BOTTOM;
      let zoom = 1;

      column.style.zoom = '1';
      for (let pass = 0; pass < 3; pass++) {
        const height = column.getBoundingClientRect().height;

        if (height <= available || zoom <= MIN_FIT) break;
        zoom = Math.max(MIN_FIT, (zoom * available) / height);
        column.style.zoom = String(zoom);
      }
    };
    let fitFrame = 0;
    const onResize = () => {
      cancelAnimationFrame(fitFrame);
      fitFrame = requestAnimationFrame(fit);
    };

    const teardown = () => {
      window.removeEventListener('resize', onResize);
      column.style.zoom = '';
      scene?.dispose();
      scene = null;
      hoverRef.current = null;
      canvas.removeAttribute('data-ready');
      section.setAttribute('data-stack', 'off');
    };

    const activate = async (create: (_options: CapabilityStackOptions) => StackScene) => {
      await whenIdle();
      if (cancelled || !media.matches) return;

      // Switching the layout changes the section's height. If it is above the viewport, keep what the visitor is
      // looking at where it is: measure the next block before and after, and scroll by the difference.
      // Below the viewport nothing visible moves, so only compensate when the section is above it.
      const above = section.getBoundingClientRect().bottom <= 0;
      const next = section.nextElementSibling;
      const before = next?.getBoundingClientRect().top ?? 0;

      section.setAttribute('data-stack', 'on');
      fit();
      window.addEventListener('resize', onResize);

      const shift = (next?.getBoundingClientRect().top ?? 0) - before;

      if (above && shift) window.scrollBy({ top: shift, behavior: 'instant' });

      const created = create({
        canvas,
        section,
        items: Array.from(list.querySelectorAll<HTMLElement>('[data-cap]')),
        data,
        onFail: teardown,
      });

      scene = created;
      hoverRef.current = created.setHover;
      await created.ready;
      if (!cancelled && scene === created) canvas.setAttribute('data-ready', '');
    };

    const mount = async () => {
      const { createCapabilityStack } = await import('./three/capability-stack-scene');

      if (cancelled || !media.matches) return;

      // Never switch in front of the visitor: wait until the section is fully off screen, above or below.
      waiter = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) return;
        waiter?.disconnect();
        waiter = null;
        void activate(createCapabilityStack);
      });
      waiter.observe(section);
    };

    const start = () => {
      if (scene || observer || waiter || !media.matches || !canRunWebGLEffects()) return;

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          observer = null;
          void mount();
        },
        { rootMargin: '1000px 0px' },
      );
      observer.observe(section);
    };

    const onChange = () => {
      if (media.matches) start();
      else {
        observer?.disconnect();
        observer = null;
        waiter?.disconnect();
        waiter = null;
        teardown();
      }
    };

    media.addEventListener('change', onChange);
    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(fitFrame);
      window.removeEventListener('resize', onResize);
      column.style.zoom = '';
      media.removeEventListener('change', onChange);
      observer?.disconnect();
      waiter?.disconnect();
      scene?.dispose();
      scene = null;
      hoverRef.current = null;
      section.setAttribute('data-stack', 'off');
    };
  }, [data]);

  const itemIndex = (event: ReactPointerEvent | React.FocusEvent) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[data-cap]');

    return item ? Number(item.dataset.cap) : null;
  };

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-labelledby="capabilities-heading"
      data-stack="off"
      className="group/caps relative [--pin:min(100svh,60rem)] data-[stack=on]:h-[calc(var(--pin)*2.4)]"
    >
      <div className="group-data-[stack=on]/caps:sticky group-data-[stack=on]/caps:top-[calc((100svh-var(--pin))/2)] group-data-[stack=on]/caps:flex group-data-[stack=on]/caps:h-[var(--pin)] group-data-[stack=on]/caps:items-center">
        <div className="mx-auto w-full max-w-[1040px] px-5 py-14 group-data-[stack=on]/caps:pt-24 group-data-[stack=on]/caps:pb-6 sm:px-8 md:py-20">
          <div className="group-data-[stack=on]/caps:grid group-data-[stack=on]/caps:grid-cols-12 group-data-[stack=on]/caps:items-center group-data-[stack=on]/caps:gap-10">
            <div ref={columnRef} className="group-data-[stack=on]/caps:col-span-5">
              <Reveal>{heading}</Reveal>
              <Reveal index={1}>
                <div
                  ref={listRef}
                  onPointerOver={(event) => {
                    if (event.pointerType === 'mouse') hoverRef.current?.(itemIndex(event));
                  }}
                  onPointerLeave={() => hoverRef.current?.(null)}
                  onFocus={(event) => hoverRef.current?.(itemIndex(event))}
                  onBlur={() => hoverRef.current?.(null)}
                >
                  {children}
                </div>
              </Reveal>
            </div>
            <div
              aria-hidden="true"
              className="hidden group-data-[stack=on]/caps:col-span-7 group-data-[stack=on]/caps:block"
            >
              <canvas
                ref={canvasRef}
                className="aspect-square max-h-[calc(var(--pin)-9rem)] w-full opacity-0 transition-opacity duration-500 data-[ready]:opacity-100"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
