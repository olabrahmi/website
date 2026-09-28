import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container, Tag, TextLink } from '@/components/ui';
import {
  ArchitectureDiagram,
  BeforeAfter,
  CaseSection,
  FactBar,
  MediaFrame,
  NextProject,
  PendingNotice,
} from '@/components/work';
import { allProjects, getNextProject, getProject } from '@/content/projects';

export const dynamicParams = false;

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.shortVersion,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { title: project.title, description: project.shortVersion, url: `/work/${project.slug}` },
  };
}

export default async function WorkPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const next = getNextProject(project.slug);
  const titled = project.built.some((item) => item.title);
  const hasResults = !!project.results?.length;

  return (
    <main>
      <Container className="pt-32 md:pt-40">
        <TextLink href="/#work">All work</TextLink>
        <h1 className="text-ink mt-8 max-w-[22ch] text-[clamp(2.25rem,1.3rem+3.6vw,4rem)] leading-[1.05] tracking-[-0.025em]">
          {project.title}
        </h1>
        <div className="mt-10">
          <FactBar facts={project.facts} />
        </div>
        <p className="text-ink mt-10 max-w-[62ch] text-lg">{project.shortVersion}</p>
        {project.media.hero && (
          <MediaFrame slug={project.slug} name="hero" alt={`${project.name} screenshot`} className="mt-10" priority />
        )}
        {project.media.beforeAfter && (
          <div className="mt-6">
            <BeforeAfter slug={project.slug} name={project.name} />
          </div>
        )}
        <div className="mt-10">
          <PendingNotice items={project.pending} />
        </div>

        <div className="mt-6">
          {project.context && (
            <CaseSection id="context" title="Context">
              <p className="max-w-[62ch]">{project.context}</p>
            </CaseSection>
          )}

          <CaseSection id="built" title="What I built">
            {titled ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {project.built.map((item) => (
                  <li key={item.title ?? item.body} className="border-rule flex flex-col gap-2 rounded-xl border p-5">
                    {item.title &&
                      (item.href ? (
                        <TextLink href={item.href} className="w-fit font-mono text-[0.9375rem]">
                          {item.title}
                        </TextLink>
                      ) : (
                        <h3 className="text-ink font-mono text-[0.9375rem] font-medium">{item.title}</h3>
                      ))}
                    <p className="text-ink-muted">{item.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="marker:text-ink-muted flex max-w-[62ch] list-disc flex-col gap-3 pl-5">
                {project.built.map((item) => (
                  <li key={item.body}>{item.body}</li>
                ))}
              </ul>
            )}
            {project.media.details > 0 && (
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: project.media.details }, (_, index) => (
                  <MediaFrame
                    key={index}
                    slug={project.slug}
                    name={`detail-${index + 1}`}
                    alt={`${project.name} detail ${index + 1}`}
                    aspect="4 / 3"
                  />
                ))}
              </div>
            )}
          </CaseSection>

          <CaseSection id="architecture" title="How it's built">
            <p className="max-w-[62ch]">{project.howItsBuilt}</p>
            <ArchitectureDiagram diagram={project.diagram} name={project.name} />
          </CaseSection>

          {project.hardParts.length > 0 && (
            <CaseSection id="hard-parts" title="Hard parts">
              <ul className="marker:text-ink-muted flex max-w-[62ch] list-disc flex-col gap-3 pl-5">
                {project.hardParts.map((part) => (
                  <li key={part}>{part}</li>
                ))}
              </ul>
            </CaseSection>
          )}

          {(hasResults || project.measuring) && (
            <CaseSection id="results" title={hasResults ? 'Results' : 'Measuring now'}>
              {hasResults && (
                <ul className="marker:text-ink-muted flex max-w-[62ch] list-disc flex-col gap-3 pl-5">
                  {project.results?.map((result) => (
                    <li key={result}>{result}</li>
                  ))}
                </ul>
              )}
              {project.measuring && (
                <div className="flex max-w-[62ch] flex-col gap-3">
                  <p>{project.measuring.intro}</p>
                  <ul className="flex flex-wrap gap-2">
                    {project.measuring.items.map((item) => (
                      <li key={item}>
                        <Tag>{item}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CaseSection>
          )}

          {project.handoff && (
            <CaseSection id="handoff" title="Docs and handoff">
              <p className="max-w-[62ch]">{project.handoff}</p>
            </CaseSection>
          )}

          {(project.today || project.next) && (
            <CaseSection id="today" title={project.today ? 'If I built it today' : "What's next"}>
              <p className="max-w-[62ch]">{project.today ?? project.next}</p>
            </CaseSection>
          )}
        </div>

        <footer className="border-rule flex flex-col gap-6 border-t pt-12">
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
    </main>
  );
}
