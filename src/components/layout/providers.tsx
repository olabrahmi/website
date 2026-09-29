'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

import { RevealProvider } from '@/components/motion';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <RevealProvider />
      {children}
    </MotionConfig>
  );
}
