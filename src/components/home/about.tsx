import { InlineClip, Reveal } from '@/components/motion';
import { Container, TextLink } from '@/components/ui';
import { cn } from '@/utils/cn';
import { about } from '@/content/site';

import SectionHeading from './section-heading';

// '{dali}' in a line becomes a link from about.links.
function renderLine(line: string) {
  return line.split(/(\{\w+\})/).map((part, index) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1] as keyof typeof about.links | undefined;
    const link = key ? about.links[key] : undefined;

    return link ? (
      <TextLink key={index} href={link.href}>
        {link.label}
      </TextLink>
    ) : (
      part
    );
  });
}

export default function About() {
  return (
    <Container as="section" id="about" aria-labelledby="about-me" className="py-14 md:py-20">
      <Reveal>
        <SectionHeading id="about-me" eyebrow="The short version" align="center">
          {about.heading}
        </SectionHeading>
      </Reveal>
      <Reveal index={1}>
        <div className="text-ink mt-8 flex flex-col gap-4 font-sans text-[clamp(1.25rem,1rem+1.2vw,1.75rem)] leading-snug font-medium tracking-[-0.045em] md:text-center">
          {about.body.map((line, index) => {
            const last = index === about.body.length - 1;

            // The last line carries the clip, so its column is wider: text and clip stay on one line.
            return (
              <p key={line} className={cn('md:mx-auto', last ? 'max-w-[60ch]' : 'max-w-[36ch]')}>
                {renderLine(line)}
                {last && (
                  <>
                    {' '}
                    <InlineClip src="/gif.webm" />
                  </>
                )}
              </p>
            );
          })}
        </div>
        <ul className="mt-6 flex flex-wrap gap-2 md:justify-center">
          {about.facts.map((fact) => (
            <li key={fact} className="bg-accent-soft text-accent rounded-full px-3 py-1.5 text-xs font-medium">
              {fact}
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  );
}
