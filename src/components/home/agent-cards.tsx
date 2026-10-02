import Link from 'next/link';

import { Metric, Reveal, SpotlightCard } from '@/components/motion';
import { ArrowRight, ArrowUpRight, Tag } from '@/components/ui';
import { buildingNow } from '@/content/projects';

export default function AgentCards() {
  return (
    <>
      <ul className="mt-6 grid gap-4 md:grid-cols-12">
        {buildingNow.map((project, index) => (
          <Reveal as="li" key={project.slug} index={index} className="md:col-span-6">
            <SpotlightCard as="article" className="group/card flex h-full flex-col gap-6 p-6 md:p-7">
              {/* The whole card is the link. */}
              <Link
                href={`/work/${project.slug}`}
                transitionTypes={['nav-forward']}
                className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
              >
                <span className="sr-only">
                  {project.name}: {project.card.cta}
                </span>
              </Link>
              <span
                aria-hidden="true"
                className="cursor-label bg-ink text-paper rounded-full px-3 py-1.5 text-xs font-medium"
              >
                <span className="inline-flex items-center gap-1">
                  {project.card.cta}
                  <ArrowUpRight className="size-3.5" />
                </span>
              </span>
              <div className="flex items-center justify-between gap-4">
                <h4 className="type-h3 text-ink text-2xl">{project.name}</h4>
                <span className="type-eyebrow text-ink-faint">Agent</span>
              </div>
              <p className="text-ink max-w-[34ch] text-lg leading-snug">{project.card.summary}</p>
              {project.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <Metric key={metric.label} metric={metric} />
                  ))}
                </div>
              )}
              <div className="mt-auto flex flex-col gap-5">
                <ul className="flex flex-wrap gap-1.5" aria-label={`${project.name} stack`}>
                  {project.card.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
                {/* Phones: a visible link line. Desktop: none, the label follows the cursor instead. */}
                <span className="text-ink inline-flex w-fit items-center gap-1.5 font-medium md:hidden">
                  {project.card.cta}
                  <ArrowRight className="text-accent size-4" />
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
