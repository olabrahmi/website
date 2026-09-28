'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Logo } from '@/components/logos';
import { Container } from '@/components/ui';
import { logoNames, logoStripLabel } from '@/content/logos';

const SLOTS = 3;
const INTERVAL = 3000;
const STAGGER = 120;

export default function LogoStrip() {
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
      reduce ? 5000 : INTERVAL,
    );

    return () => {
      clearInterval(interval);
      timers.forEach(clearTimeout);
    };
  }, [inView, pageVisible, reduce]);

  const enter = reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)', filter: 'blur(6px)' };
  const exit = reduce
    ? { opacity: 0, transition: { duration: 0.2 } }
    : {
        opacity: 0,
        transform: 'translateY(-8px)',
        filter: 'blur(6px)',
        transition: { duration: 0.32, ease: [0.4, 0, 1, 1] as const },
      };

  return (
    <Container className="border-rule border-t py-10 md:py-12">
      <div ref={ref} className="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
        <p className="text-ink-muted shrink-0 text-sm">{logoStripLabel}</p>
        <ul className="sr-only">
          {logoNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <div aria-hidden="true" className="text-ink-muted grid flex-1 grid-cols-3 gap-4">
          {cycles.map((cycle, slot) => {
            const index = (slot + SLOTS * cycle) % logoNames.length;

            return (
              <div key={slot} className="relative flex h-10 items-center">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={logoNames[index]}
                    className="max-w-full"
                    initial={enter}
                    animate={{
                      opacity: 1,
                      transform: 'translateY(0px)',
                      filter: 'blur(0px)',
                      transition: { duration: reduce ? 0.2 : 0.42, ease: [0.23, 1, 0.32, 1] as const },
                    }}
                    exit={exit}
                  >
                    <Logo name={logoNames[index]} className="max-w-full text-[0.9375rem] sm:text-xl" />
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
