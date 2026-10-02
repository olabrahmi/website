import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';

import { Contact } from '@/components/home';
import { ProjectMark, hasProjectMark } from '@/components/logos';
import { MetricBand } from '@/components/motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, Button, Container, Tag, TextLink } from '@/components/ui';
import {
  ArchitectureDiagram,
  BeforeAfter,
  CaseSection,
  CaseToc,
  FactBar,
  MediaFrame,
  NextProject,
  PendingNotice,
} from '@/components/work';
import { allProjects, getNextProject, getProject, unconfirmedMetrics } from '@/content/projects';
import type { TocItem } from '@/components/work/case-toc';
import { caseStudyGraph, serializeJsonLd } from '@/utils/json-ld';
import { readMinutes } from '@/utils/read-time';

export const dynamicParams = false;

const slide = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' } as const;

export function generateStaticParams() {
  const unconfirmed = unconfirmedMetrics();

  // Runs once per build, so every deploy log lists what still needs the owner's sign-off.
  if (unconfirmed.length > 0) {
    console.warn(
      `\n[metrics] ${unconfirmed.length} unconfirmed, confirm or delete before deploying:\n  - ${unconfirmed.join('\n  - ')}\n`,
    );
  }

  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.seoDescription ?? project.shortVersion,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.seoDescription ?? project.shortVersion,
      url: `/work/${project.slug}`,
    },
  };
}

export default async function WorkPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = getNextProject(project.slug);
  const sites = project.facts.live ?? [];
  const minutes = readMinutes(project);
  const toc: TocItem[] = [
    project.context ? { id: 'context', label: 'Context' } : null,
    { id: 'built', label: project.builtTitle ?? 'What I built' },
    { id: 'architecture', label: "How it's built" },
    project.hardParts.length > 0 ? { id: 'hard-parts', label: 'Hard parts' } : null,
    project.next ? { id: 'next', label: "What's next" } : null,
  ].filter((item): item is TocItem => item !== null);
  const showToc = toc.length >= 3;

  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(caseStudyGraph(project)) }}
        />
        <Container className="pt-28 md:pt-36">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/#work"
              transitionTypes={['nav-back']}
              className="group/back text-ink-muted hover:text-ink inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="ease-out-strong size-4 transition-transform duration-150 [@media(hover:hover)]:group-hover/back:-translate-x-0.5" />
              All work
            </Link>
            <p className="text-ink-muted text-sm">
              <span className="font-mono">{minutes}</span> min read
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-5">
            {hasProjectMark(project.name) && (
              <ViewTransition name={`work-${project.slug}-logo`} share="morph" default="none">
                <ProjectMark name={project.name} className="text-ink w-fit" />
              </ViewTransition>
            )}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
              <h1 className="type-display-2 text-ink max-w-[20ch]">{project.title}</h1>
              {sites.length === 1 && (
                <Button href={sites[0].href} className="shrink-0 self-start md:self-auto">
                  Visit live site
                  <ArrowUpRight className="btn-arrow" />
                </Button>
              )}
              {sites.length > 1 && (
                <Button href="#built" className="shrink-0 self-start md:self-auto">
                  See the {sites.length} live sites
                  <ArrowRight className="btn-arrow rotate-90" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <FactBar facts={project.facts} />
          </div>

          {project.metrics.length > 0 && (
            <ViewTransition name={`work-${project.slug}-metrics`} share="morph" default="none">
              <MetricBand metrics={project.metrics} className="mt-6" />
            </ViewTransition>
          )}

          <p className="text-ink mt-8 max-w-[60ch] text-lg leading-relaxed">{project.shortVersion}</p>

          {project.media.hero && (
            <MediaFrame
              slug={project.slug}
              name="hero"
              alt={project.media.alt?.hero ?? `${project.name} screenshot`}
              className="mt-8"
              priority
            />
          )}
          {project.media.beforeAfter && (
            <div className="mt-3">
              <BeforeAfter slug={project.slug} name={project.name} />
            </div>
          )}
          <div className="mt-8">
            <PendingNotice items={project.pending} />
          </div>

          <div className={showToc ? 'mt-10 lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-14' : 'mt-10'}>
            {showToc && <CaseToc items={toc} />}

            <div className={showToc ? 'mt-8 lg:mt-0' : undefined}>
              {project.context && (
                <CaseSection id="context" title="Context">
                  <p className="max-w-[60ch]">{project.context}</p>
                </CaseSection>
              )}

              <CaseSection id="built" title={project.builtTitle ?? 'What I built'}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.built.map((item) => (
                    <li key={item.title} className="border-rule bg-surface flex flex-col gap-1.5 rounded-xl border p-4">
                      <h3 className="font-display text-ink text-[1.0625rem] font-bold tracking-[-0.045em]">
                        {item.title}
                      </h3>
                      <p className="text-ink-muted text-[0.9375rem] leading-snug">{item.body}</p>
                      {item.href && (
                        <Button href={item.href} variant="secondary" size="sm" className="mt-2.5 w-fit">
                          Visit live site
                          <ArrowUpRight className="btn-arrow" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                {project.handoff && (
                  <p className="text-ink-muted flex items-center gap-2 text-sm">
                    <span className="type-eyebrow text-accent">Docs</span>
                    {project.handoff}
                  </p>
                )}
                {project.media.details > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: project.media.details }, (_, index) => (
                      <MediaFrame
                        key={index}
                        slug={project.slug}
                        name={`detail-${index + 1}`}
                        alt={project.media.alt?.details?.[index] ?? `${project.name} detail ${index + 1}`}
                        aspect="4 / 3"
                      />
                    ))}
                  </div>
                )}
              </CaseSection>

              <CaseSection id="architecture" title="How it's built">
                <p className="max-w-[60ch]">{project.howItsBuilt}</p>
                <ArchitectureDiagram diagram={project.diagram} name={project.name} />
              </CaseSection>

              {project.hardParts.length > 0 && (
                <CaseSection id="hard-parts" title="Hard parts">
                  <ul className="flex flex-col gap-5">
                    {project.hardParts.map((part) => (
                      <li key={part.problem} className="border-accent/40 flex flex-col gap-1.5 border-l-2 pl-4">
                        <p className="text-ink font-medium">{part.problem}</p>
                        {part.call && (
                          <p className="text-ink-muted flex gap-2.5">
                            <span className="type-eyebrow text-accent mt-1.5 shrink-0">Call</span>
                            {part.call}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </CaseSection>
              )}

              {project.next && (
                <CaseSection id="next" title="What's next">
                  <p className="max-w-[60ch]">{project.next}</p>
                </CaseSection>
              )}

              <div className="border-rule flex flex-wrap gap-1.5 border-t pt-9">
                <span className="type-eyebrow text-ink-faint mr-2 self-center">Stack</span>
                {project.facts.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
          </div>

          <footer className="mt-14 flex flex-col gap-5">
            {project.links && project.links.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href} arrow>
                      {link.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            )}
            <NextProject project={next} />
          </footer>
        </Container>
        <Contact />
      </main>
    </ViewTransition>
  );
}
