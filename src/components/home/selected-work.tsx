import Link from 'next/link';

import { Logo } from '@/components/logos';
import { ArrowRight, Container, Tag } from '@/components/ui';
import type { LogoName } from '@/content/logos';
import { selectedWork } from '@/content/projects';
import { workIntro } from '@/content/site';

import SectionHeading from './section-heading';

export default function SelectedWork() {
  return (
    <Container as="section" id="work" aria-labelledby="selected-work" className="py-16 md:py-24">
      <SectionHeading id="selected-work" intro={workIntro}>
        Selected work
      </SectionHeading>
      <ul className="border-rule mt-10 border-t">
        {selectedWork.map((project) => (
          <li key={project.slug} className="border-rule border-b">
            <article className="group/row [@media(hover:hover)]:hover:bg-surface relative grid gap-5 px-0 py-8 transition-colors duration-150 lg:grid-cols-12 lg:gap-8 lg:px-4">
              <div className="lg:col-span-3">
                {project.name === 'Akasec' ? (
                  <span className="font-display text-xl font-semibold tracking-[-0.01em]">Akasec</span>
                ) : (
                  <Logo name={project.name as LogoName} />
                )}
              </div>
              <div className="flex flex-col gap-4 lg:col-span-5">
                <p className="text-ink max-w-[52ch]">{project.card.summary}</p>
                <ul className="flex flex-wrap gap-2" aria-label={`${project.name} stack`}>
                  {project.card.tags.map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="text-ink-muted flex flex-col gap-1 font-mono text-[0.8125rem] tabular-nums lg:col-span-2">
                {project.card.stats.map((stat) => (
                  <li key={stat}>{stat}</li>
                ))}
              </ul>
              <div className="lg:col-span-2 lg:justify-self-end">
                <Link
                  href={`/work/${project.slug}`}
                  className="text-ink inline-flex items-center gap-1.5 font-medium after:absolute after:inset-0 after:content-['']"
                >
                  {project.card.cta}
                  <ArrowRight className="ease-out-strong size-4 transition-transform duration-150 motion-reduce:transition-none [@media(hover:hover)]:group-hover/row:translate-x-0.5" />
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Container>
  );
}
