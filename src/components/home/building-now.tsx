import { Container, Tag, TextLink } from '@/components/ui';
import { buildingNow } from '@/content/projects';

import PipelineTrace from './pipeline-trace';
import SectionHeading from './section-heading';

export default function BuildingNow() {
  return (
    <Container as="section" aria-labelledby="building-now" className="py-16 md:py-24">
      <SectionHeading id="building-now">What I&apos;m building now</SectionHeading>
      <ul className="border-rule mt-10 border-t">
        {buildingNow.map((project) => (
          <li key={project.slug} className="border-rule grid gap-6 border-b py-10 lg:grid-cols-12 lg:gap-10">
            <h3 className="text-ink text-[clamp(2rem,1.4rem+2vw,3rem)] leading-none tracking-[-0.025em] lg:col-span-4">
              {project.name}
            </h3>
            <div className="flex flex-col gap-6 lg:col-span-8">
              <p className="text-ink max-w-[60ch] text-lg">{project.card.summary}</p>
              {project.slug === 'maya' && <PipelineTrace />}
              <ul className="flex flex-wrap gap-2" aria-label={`${project.name} stack`}>
                {project.card.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
              <TextLink href={`/work/${project.slug}`} arrow>
                {project.card.cta}
              </TextLink>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
