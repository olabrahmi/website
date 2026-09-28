import type { Metadata } from 'next';

import { Button, Container } from '@/components/ui';
import { allProjects } from '@/content/projects';
import { hero, person } from '@/content/site';

export const metadata: Metadata = {
  title: 'CV',
  description: `${person.name}, ${person.jobTitle.toLowerCase()}. Work history and projects.`,
  alternates: { canonical: '/cv' },
};

export default function CvPage() {
  return (
    <main>
      <Container className="pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-ink text-[clamp(2.25rem,1.3rem+3.6vw,4rem)] leading-[1.05] tracking-[-0.025em]">
              {person.name}
            </h1>
            <p className="text-ink-muted mt-3 text-lg">
              {person.jobTitle} &middot; {person.location}
            </p>
          </div>
          <Button href={person.cvPath} download>
            Download PDF
          </Button>
        </div>

        <p className="mt-10 max-w-[62ch] text-lg">{hero.subline}</p>

        <section aria-labelledby="cv-work" className="border-rule mt-14 border-t pt-10">
          <h2 id="cv-work" className="text-ink text-2xl tracking-[-0.015em]">
            Work and projects
          </h2>
          <ul className="divide-rule mt-6 divide-y">
            {allProjects.map((project) => (
              <li key={project.slug} className="grid gap-2 py-6 lg:grid-cols-12 lg:gap-8">
                <div className="text-ink-muted font-mono text-[0.8125rem] lg:col-span-3">{project.facts.when}</div>
                <div className="flex flex-col gap-1 lg:col-span-9">
                  <h3 className="text-ink text-lg font-semibold">
                    {project.facts.client} &middot; {project.facts.role}
                  </h3>
                  <p className="text-ink-muted max-w-[62ch]">{project.card.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cv-contact" className="border-rule mt-14 border-t pt-10">
          <h2 id="cv-contact" className="text-ink text-2xl tracking-[-0.015em]">
            Contact
          </h2>
          <p className="mt-4">
            <a
              className="decoration-rule hover:decoration-accent underline underline-offset-4"
              href={`mailto:${person.email}`}
            >
              {person.email}
            </a>
          </p>
        </section>
      </Container>
    </main>
  );
}
