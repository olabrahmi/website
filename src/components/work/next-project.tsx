import Link from 'next/link';

import { SpotlightCard } from '@/components/motion';
import { ArrowRight } from '@/components/ui';
import type { CaseStudy } from '@/content/types';

export default function NextProject({ project }: { project: CaseStudy }) {
  return (
    <SpotlightCard className="group/next p-5 md:p-6">
      <Link
        href={`/work/${project.slug}`}
        transitionTypes={['nav-forward']}
        className="flex flex-col gap-2 after:absolute after:inset-0 after:content-['']"
      >
        <span className="type-eyebrow text-accent">Next project</span>
        <span className="font-display text-ink flex items-center justify-between gap-4 text-xl leading-tight font-bold tracking-[-0.055em] md:text-2xl">
          {project.title}
          <ArrowRight className="text-accent ease-out-strong size-5 shrink-0 transition-transform duration-150 [@media(hover:hover)]:group-hover/next:translate-x-1" />
        </span>
      </Link>
    </SpotlightCard>
  );
}
