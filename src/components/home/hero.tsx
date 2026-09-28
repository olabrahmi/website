import { Button, Container } from '@/components/ui';
import { hero, person } from '@/content/site';

import PipelineTrace from './pipeline-trace';

const rise = (index: number) => ({ '--i': index }) as React.CSSProperties;

export default function Hero() {
  const [first, second] = hero.headline.split('. ');

  return (
    <Container as="section" className="pt-32 pb-16 md:pt-44 md:pb-24">
      <h1
        style={rise(0)}
        className="rise text-ink max-w-[16ch] text-[clamp(2.5rem,1.4rem+4vw,4.75rem)] leading-[1.02] tracking-[-0.025em] sm:max-w-[20ch]"
      >
        <span className="text-ink-muted">{first}.</span> {second}
      </h1>
      <p style={rise(1)} className="rise text-ink-muted mt-6 max-w-[58ch] text-lg">
        {hero.subline}
      </p>
      <div style={rise(2)} className="rise mt-8 flex flex-wrap items-center gap-3">
        <Button href="/#work">See my work</Button>
        <Button href={person.cvPath} download variant="secondary">
          Download CV
        </Button>
      </div>
      <p style={rise(3)} className="rise text-ink-muted mt-6 flex max-w-[60ch] items-start gap-2.5 text-sm">
        <span aria-hidden="true" className="bg-pass mt-[0.45rem] size-2 shrink-0 rounded-full" />
        {hero.status}
      </p>
      <div style={rise(4)} className="rise border-rule mt-14 border-t pt-8 md:mt-20">
        <PipelineTrace animate />
      </div>
    </Container>
  );
}
