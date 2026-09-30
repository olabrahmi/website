import { AuroraBackground } from '@/components/motion';
import { ArrowDown, Button, Container } from '@/components/ui';
import { EmailIcon } from '@/components/ui/social-icons';
import { hero, person } from '@/content/site';

const step = (index: number) => ({ '--i': index }) as React.CSSProperties;

export default function Hero() {
  const words = hero.headline.split(' ');
  const [role, terms] = hero.status.split(' · ');

  return (
    <AuroraBackground className="pt-28 pb-8 md:pt-40 md:pb-10">
      <Container as="section" className="flex flex-col items-start text-left md:items-center md:text-center">
        <p
          style={step(0)}
          className="rise border-rule bg-surface text-ink-muted mb-6 hidden items-center gap-2.5 rounded-full border py-1 pr-3 pl-2.5 text-left text-[0.8125rem] leading-snug font-medium sm:inline-flex"
        >
          <span aria-hidden="true" className="relative flex size-2">
            <span className="bg-pass absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none" />
            <span className="bg-pass relative size-2 rounded-full" />
          </span>
          {/* Hidden on phones. From sm up: one line with a dot between. */}
          <span className="flex gap-1.5">
            <span>{role}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{terms}</span>
          </span>
        </p>
        <h1 className="type-display-1 text-ink max-w-[14ch]">
          {words.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span style={step(index + 1)} className="rise-word">
                {word}
              </span>
              {index < words.length - 1 && ' '}
            </span>
          ))}
        </h1>
        <p style={step(words.length + 1)} className="rise text-ink-muted mt-6 max-w-[46ch] text-lg">
          {hero.subline}
        </p>
        <div style={step(words.length + 2)} className="rise mt-7 flex flex-wrap items-center gap-2.5 md:justify-center">
          <Button href="/#work">
            See my work
            <ArrowDown className="btn-arrow btn-arrow-down" />
          </Button>
          <Button href={`mailto:${person.email}`} variant="secondary">
            Email me
            <EmailIcon className="size-4" />
          </Button>
        </div>
      </Container>
    </AuroraBackground>
  );
}
