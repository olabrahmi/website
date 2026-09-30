import { Reveal } from '@/components/motion';
import { Container, TextLink } from '@/components/ui';
import { getProject } from '@/content/projects';
import { capabilities } from '@/content/site';

import SectionHeading from './section-heading';

function proofLinks(slugs: string[]) {
  return slugs.map((slug, index) => {
    const project = getProject(slug);

    if (!project) throw new Error(`capabilities: unknown project slug "${slug}"`);

    return (
      <span key={slug}>
        {index > 0 && ', '}
        <TextLink href={`/work/${slug}`}>{project.name}</TextLink>
      </span>
    );
  });
}

export default function Capabilities() {
  return (
    <Container as="section" id="capabilities" aria-labelledby="capabilities-heading" className="py-14 md:py-20">
      <Reveal>
        <SectionHeading id="capabilities-heading" eyebrow={capabilities.eyebrow} intro={capabilities.intro}>
          {capabilities.heading}
        </SectionHeading>
      </Reveal>
      <Reveal index={1}>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {capabilities.items.map((item) => (
            <li key={item.title} className="border-rule bg-surface flex flex-col gap-1.5 rounded-xl border p-4">
              <h3 className="font-display text-ink text-[1.0625rem] font-bold tracking-[-0.045em]">{item.title}</h3>
              <p className="text-ink-muted text-[0.9375rem] leading-snug">{item.body}</p>
              <p className="text-ink-muted mt-1.5 text-sm">{proofLinks(item.proof)}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  );
}
