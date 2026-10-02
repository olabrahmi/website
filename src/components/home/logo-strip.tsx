'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import Logo from '@/components/logos/logo';
import type { LogoSources } from '@/components/logos/logo-sources';
import { Container } from '@/components/ui';
import { logoNames, logoStripLabel } from '@/content/logos';

const SLOTS = 3;
const INTERVAL = 3000;
const REDUCED_INTERVAL = 5000;
const STAGGER = 140;

export default function LogoStrip({ sources }: { sources: Record<string, LogoSources> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [cycles, setCycles] = useState<number[]>(() => Array.from({ length: SLOTS }, () => 0));
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');

    document.addEventListener('visibilitychange', onVisibility);

    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!inView || !pageVisible) return;

    const timers = new Set<ReturnType<typeof setTimeout>>();
    const interval = setInterval(
      () => {
        for (let slot = 0; slot < SLOTS; slot++) {
          const timer = setTimeout(
            () => {
              timers.delete(timer);
              setCycles((current) => current.map((value, index) => (index === slot ? value + 1 : value)));
            },
            reduce ? 0 : slot * STAGGER,
          );

          timers.add(timer);
        }
      },
      reduce ? REDUCED_INTERVAL : INTERVAL,
    );

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, [inView, pageVisible, reduce]);

  const enter = reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(10px)', filter: 'blur(8px)' };
  const exit = reduce
    ? { opacity: 0, transition: { duration: 0.2 } }
    : {
        opacity: 0,
        transform: 'translateY(-10px)',
        filter: 'blur(8px)',
        transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
      };

  return (
    <Container className="py-4 md:py-6">
      <div ref={ref} className="flex flex-col items-start gap-6 md:items-center">
        <p className="type-eyebrow text-ink-faint">{logoStripLabel}</p>
        <ul className="sr-only">
          {logoNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="text-ink-muted flex w-full flex-nowrap items-center gap-x-6 md:grid md:grid-cols-[repeat(3,10rem)] md:justify-center md:gap-x-2"
        >
          {cycles.map((cycle, slot) => {
            const index = (slot + SLOTS * cycle) % logoNames.length;

            return (
              <motion.div
                layout
                transition={{ duration: reduce ? 0.2 : 0.45, ease: [0.23, 1, 0.32, 1] }}
                key={slot}
                className="relative flex h-11 min-w-0 items-center md:justify-center"
              >
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={logoNames[index]}
                    className="max-w-full"
                    initial={enter}
                    animate={{
                      opacity: 1,
                      transform: 'translateY(0px)',
                      filter: 'blur(0px)',
                      transition: { duration: reduce ? 0.2 : 0.45, ease: [0.23, 1, 0.32, 1] as const },
                    }}
                    exit={exit}
                  >
                    <Logo
                      name={logoNames[index]}
                      sources={sources[logoNames[index]]}
                      className="max-w-full text-[0.9375rem] sm:text-xl"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
