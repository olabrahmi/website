'use client';

import { animate } from 'motion/react';
import { useEffect, useRef } from 'react';

import { ArrowUp } from '@/components/ui';
import type { Metric as MetricData } from '@/content/types';
import { cn } from '@/utils/cn';
import { formatMetric, parseMetric } from '@/utils/parse-metric';

interface MetricProps {
  metric: MetricData;
  size?: 'lg' | 'md';
  className?: string;
}

/**
 * Count-up, without flashing:
 *
 *   server ──▶ final value in the HTML (SEO, no JS, screen readers)
 *   mount ───▶ already on screen?  do nothing, the final value stays
 *              below the fold?     swap the text to 0 (nobody sees it), wait for view
 *   in view ─▶ animate 0 → target once
 *
 * The number sits on top of an invisible copy of the final value, so the column never changes
 * width while counting (Cabinet Grotesk has no tabular figures).
 */
export default function Metric({ metric, size = 'lg', className }: MetricProps) {
  const live = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsed = parseMetric(metric.value);
    const node = live.current;
    const box = root.current;

    if (!parsed || !node || !box || parsed.target === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (box.getBoundingClientRect().top < window.innerHeight) return;

    node.textContent = formatMetric(parsed, 0);

    let controls: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();
        controls = animate(0, parsed.target, {
          duration: 1.1,
          ease: [0.23, 1, 0.32, 1],
          onUpdate: (amount) => {
            node.textContent = formatMetric(parsed, amount);
          },
          onComplete: () => {
            node.textContent = metric.value;
          },
        });
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(box);

    return () => {
      observer.disconnect();
      controls?.stop();
      node.textContent = metric.value;
    };
  }, [metric.value]);

  return (
    <div ref={root} className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline gap-1.5">
        <span
          aria-hidden="true"
          className={cn(
            'inline-grid',
            size === 'lg' ? 'type-metric' : 'font-mono text-2xl leading-none font-bold tracking-[-0.08em]',
            metric.up ? 'text-pass' : 'text-ink',
          )}
        >
          <span className="invisible col-start-1 row-start-1">{metric.value}</span>
          <span ref={live} className="col-start-1 row-start-1">
            {metric.value}
          </span>
        </span>
        <span className="sr-only">{metric.value}</span>
        {metric.up && <ArrowUp aria-hidden="true" className="text-pass size-4 self-center" />}
      </div>
      <p className="text-ink-muted text-sm leading-snug">
        {metric.label}
        {metric.confirm && process.env.NODE_ENV === 'development' && (
          <span className="border-accent text-accent ml-2 rounded border border-dashed px-1.5 py-0.5 text-[0.6875rem]">
            confirm
          </span>
        )}
      </p>
    </div>
  );
}
