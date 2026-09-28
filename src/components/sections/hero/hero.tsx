'use client';

import { motion } from 'motion/react';

import { cn } from '@/utils/cn';
import { Button } from '@/components/elements/button';
import { Markdown } from '@/components/molecules/markdown';

import type { HeroProps } from './hero.types';
import { AuroraBackground } from './components/aurora-background';
import ParsedTitle from './components/parsed-title';

const transition = { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const };

const variants = {
  hidden: { filter: 'blur(10px)', transform: 'translateY(20%)', opacity: 0 },
  visible: { filter: 'blur(0)', transform: 'translateY(0)', opacity: 1 },
};

export default function Hero({ heading, description, buttons, className }: HeroProps) {
  return (
    <AuroraBackground>
      <motion.section
        className={cn(
          'container flex flex-col items-center justify-center pt-28 pb-10 md:pt-40 md:pb-56 md:text-center',
          className,
        )}
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.225 }}
      >
        <motion.h1
          className="text-5xl leading-none text-balance sm:text-6xl md:text-7xl"
          transition={transition}
          variants={variants}
        >
          <ParsedTitle>{heading}</ParsedTitle>
        </motion.h1>
        <motion.div className="mt-6 mb-8 md:max-w-xl" transition={transition} variants={variants}>
          <Markdown className="leading-none! *:text-base [&_*]:text-zinc-700!" content={description} />
        </motion.div>
        <motion.div
          className="flex w-full items-center gap-2 md:justify-center md:gap-4"
          transition={transition}
          variants={variants}
        >
          {Array.isArray(buttons) && buttons.map((button, index) => <Button key={index} {...button} />)}
        </motion.div>
      </motion.section>
    </AuroraBackground>
  );
}
