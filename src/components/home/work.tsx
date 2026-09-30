import { Reveal } from '@/components/motion';
import { Container } from '@/components/ui';
import { workIntro } from '@/content/site';

import AgentCards from './agent-cards';
import ClientCards from './client-cards';
import SectionHeading from './section-heading';

/**
 * One section for all the work, so the navbar "Work" link (/#work) lands on a single place:
 * AI agents first (Shaza, Maya), then client work. Groups are h3, the cards inside them h4.
 */
export default function Work() {
  return (
    <Container as="section" id="work" aria-labelledby="work-heading" className="py-14 md:py-20">
      <Reveal>
        <SectionHeading id="work-heading" eyebrow="Work" intro={workIntro}>
          Selected work
        </SectionHeading>
      </Reveal>

      <div className="mt-10">
        <Reveal>
          <p className="type-eyebrow text-accent">AI agents</p>
          <h3 className="type-h3 text-ink mt-2 text-2xl">What I&apos;m building</h3>
        </Reveal>
        <AgentCards />
      </div>

      <div className="mt-14 md:mt-16">
        <Reveal>
          <p className="type-eyebrow text-accent">Client work</p>
          <h3 className="type-h3 text-ink mt-2 text-2xl">What I&apos;ve shipped</h3>
        </Reveal>
        <ClientCards />
      </div>
    </Container>
  );
}
