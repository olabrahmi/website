'use client';

import { motion, useReducedMotion } from 'motion/react';

import { Check } from '@/components/ui';
import { cn } from '@/utils/cn';

const steps = ['Linear ticket', 'Own branch', 'Lint', 'Tests', 'Pull request'] as const;
const ease = [0.23, 1, 0.32, 1] as const;

interface PipelineTraceProps {
  animate?: boolean;
  className?: string;
}

export default function PipelineTrace({ animate = false, className }: PipelineTraceProps) {
  const reduce = useReducedMotion();
  const play = animate && !reduce;

  return (
    <ol
      aria-label="How Maya works: Linear ticket, own branch, lint, tests, pull request, then my review"
      className={cn('flex flex-col font-mono text-[0.8125rem] md:flex-row md:items-center', className)}
    >
      {steps.map((label, index) => (
        <li key={label} className="flex items-center gap-3 md:flex-1">
          <span className="border-pass bg-pass/15 text-pass relative grid size-5 shrink-0 place-items-center rounded-full border">
            <motion.span
              className="grid place-items-center"
              initial={play ? { opacity: 0, transform: 'scale(0.25)', filter: 'blur(4px)' } : false}
              animate={{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }}
              transition={{ duration: 0.3, ease, delay: play ? 0.5 + index * 0.09 : 0 }}
            >
              <Check className="size-3" />
            </motion.span>
          </span>
          <span className="text-ink">{label}</span>
          <span aria-hidden="true" className="bg-rule hidden h-px min-w-6 flex-1 md:block" />
        </li>
      ))}
      <li className="flex items-center gap-3">
        <span className="border-accent grid size-5 shrink-0 place-items-center rounded-full border-2" />
        <span className="text-ink">
          My review <span className="text-ink-muted">waiting on me</span>
        </span>
      </li>
    </ol>
  );
}
