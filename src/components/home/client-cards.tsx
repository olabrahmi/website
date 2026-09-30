import Link from 'next/link';
import { ViewTransition } from 'react';

import { ProjectMark } from '@/components/logos';
import { Metric, Reveal, SpotlightCard } from '@/components/motion';
import { ArrowRight, Tag } from '@/components/ui';
import { selectedWork } from '@/content/projects';

export default function ClientCards() {
  return (
    <>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {selectedWork.map((project, index) => (
          <Reveal as="li" key={project.slug} index={index % 2}>
            <SpotlightCard
              as="article"
              className="group/card has-[a:focus-visible]:outline-focus flex h-full cursor-pointer flex-col gap-6 p-6 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2"
            >
              {/* Heading for crawlers and screen readers: the logo above is an image, not a heading. */}
              <h4 className="sr-only">{project.title}</h4>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="text-ink shrink-0">
                  <ViewTransition name={`work-${project.slug}-logo`} share="morph" default="none">
                    <ProjectMark name={project.name} />
                  </ViewTransition>
                </div>
                <ul className="flex flex-wrap gap-1.5 sm:justify-end" aria-label={`${project.name} stack`}>
                  {project.card.tags.slice(0, 4).map((tag) => (
                    <li key={tag}>
                      <Tag>{tag}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-ink min-h-[2lh] max-w-[34ch] text-[1.0625rem] leading-snug">{project.card.summary}</p>
              <ViewTransition name={`work-${project.slug}-metrics`} share="morph" default="none">
                <div className="grid grid-cols-2 gap-4">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <Metric key={metric.label} metric={metric} size="md" />
                  ))}
                </div>
              </ViewTransition>
              {/*
                The whole card is the link: a real anchor covering it, with descriptive text for crawlers and screen
                readers. It must not be the button itself: the button's hover filter would make it the containing
                block of a stretched pseudo-element and shrink the click area to the button.
              */}
              <Link
                href={`/work/${project.slug}`}
                transitionTypes={['nav-forward']}
                className="absolute inset-0 z-10 cursor-pointer rounded-[inherit]"
              >
                <span className="sr-only">
                  {project.card.cta}: {project.name}
                </span>
              </Link>
              <span
                aria-hidden="true"
                data-variant="secondary"
                data-size="md"
                className="btn mt-auto w-full transition-[filter,transform] group-active/card:scale-[0.98] [@media(hover:hover)]:group-hover/card:brightness-105"
              >
                {project.card.cta}
                <ArrowRight className="btn-arrow transition-transform [@media(hover:hover)]:group-hover/card:translate-x-0.5" />
              </span>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
