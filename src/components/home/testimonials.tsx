import { Reveal } from '@/components/motion';
import { Container } from '@/components/ui';
import { cn } from '@/utils/cn';
import { testimonials } from '@/content/site';

import SectionHeading from './section-heading';

export default function Testimonials() {
  if (testimonials.items.length === 0) return null;

  return (
    <Container as="section" id="testimonials" aria-labelledby="testimonials-heading" className="py-14 md:py-20">
      <Reveal>
        <SectionHeading id="testimonials-heading" eyebrow={testimonials.eyebrow}>
          {testimonials.heading}
        </SectionHeading>
      </Reveal>
      <Reveal index={1}>
        <ul className={cn('mt-8 grid gap-3', testimonials.items.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3')}>
          {testimonials.items.map((item) => (
            <li key={item.name} className="border-rule bg-surface rounded-xl border p-4">
              <figure className="flex h-full flex-col gap-4">
                <blockquote className="text-ink leading-snug">{item.quote}</blockquote>
                <figcaption className="text-ink-muted mt-auto text-sm">
                  <span className="text-ink font-medium">{item.name}</span>, {item.role}, {item.company}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>
    </Container>
  );
}
