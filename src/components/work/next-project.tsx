import Link from 'next/link';

import { ArrowRight } from '@/components/ui';
import type { CaseStudy } from '@/content/types';

export default function NextProject({ project }: { project: CaseStudy }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group/next border-rule [@media(hover:hover)]:hover:bg-surface flex flex-col gap-2 rounded-xl border p-6 transition-colors duration-150"
    >
      <span className="text-ink-muted font-mono text-[0.8125rem]">Next project</span>
      <span className="font-display text-ink flex items-center justify-between gap-4 text-2xl leading-tight font-semibold tracking-[-0.02em]">
        {project.title}
        <ArrowRight className="ease-out-strong size-5 shrink-0 transition-transform duration-150 motion-reduce:transition-none [@media(hover:hover)]:group-hover/next:translate-x-0.5" />
      </span>
    </Link>
  );
}
