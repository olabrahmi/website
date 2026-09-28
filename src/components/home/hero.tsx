'use client';

import { motion } from 'motion/react';

import { Button, Container } from '@/components/ui';
import { hero, person } from '@/content/site';

import PipelineTrace from './pipeline-trace';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, transform: 'translateY(8px)' },
  visible: {
    opacity: 1,
    transform: 'translateY(0px)',
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const },
  },
};

export default function Hero() {
  const [first, second] = hero.headline.split('. ');

  return (
    <Container as="section" className="pt-32 pb-16 md:pt-44 md:pb-24">
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.h1
          variants={item}
          className="text-ink max-w-[16ch] text-[clamp(2.5rem,1.4rem+4vw,4.75rem)] leading-[1.02] tracking-[-0.025em] sm:max-w-[20ch]"
        >
          <span className="text-ink-muted">{first}.</span> {second}
        </motion.h1>
        <motion.p variants={item} className="text-ink-muted mt-6 max-w-[58ch] text-lg">
          {hero.subline}
        </motion.p>
        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
          <Button href="/#work">See my work</Button>
          <Button href={person.cvPath} download variant="secondary">
            Download CV
          </Button>
        </motion.div>
        <motion.p variants={item} className="text-ink-muted mt-6 flex max-w-[60ch] items-start gap-2.5 text-sm">
          <span aria-hidden="true" className="bg-pass mt-[0.45rem] size-2 shrink-0 rounded-full" />
          {hero.status}
        </motion.p>
        <motion.div variants={item} className="border-rule mt-14 border-t pt-8 md:mt-20">
          <PipelineTrace animate />
        </motion.div>
      </motion.div>
    </Container>
  );
}
