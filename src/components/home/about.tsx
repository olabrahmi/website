import { Container } from '@/components/ui';
import { about } from '@/content/site';

import SectionHeading from './section-heading';

export default function About() {
  return (
    <Container as="section" id="about" aria-labelledby="about-me" className="py-16 md:py-24">
      <SectionHeading id="about-me">{about.heading}</SectionHeading>
      <div className="border-rule mt-10 grid gap-10 border-t pt-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex max-w-[62ch] flex-col gap-5 lg:col-span-7">
          {about.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 self-start font-mono text-[0.8125rem] lg:col-span-5">
          {about.facts.map(([term, value]) => (
            <div key={term} className="contents">
              <dt className="text-ink-muted">{term}</dt>
              <dd className="text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Container>
  );
}
