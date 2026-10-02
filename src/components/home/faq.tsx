import { Reveal } from '@/components/motion';
import { Container } from '@/components/ui';
import { faq } from '@/content/site';

import SectionHeading from './section-heading';

export default function Faq() {
  return (
    <Container as="section" id="faq" aria-labelledby="faq-heading" className="pt-14 pb-8 md:pt-20 md:pb-12">
      <Reveal>
        <SectionHeading id="faq-heading" eyebrow={faq.eyebrow} align="center">
          {faq.heading}
        </SectionHeading>
      </Reveal>
      <Reveal index={1}>
        {/* Native details: every answer is in the HTML even when closed, and it needs no JavaScript. */}
        <div className="mt-8 flex max-w-[40rem] flex-col gap-2 md:mx-auto">
          {faq.items.map((item, index) => (
            <details
              key={item.question}
              open={index === 0}
              className="faq-item border-rule bg-surface group rounded-xl border"
            >
              <summary className="text-ink flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
                <h3 className="type-h3 text-lg">{item.question}</h3>
                <span
                  aria-hidden="true"
                  className="text-accent text-xl leading-none transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="text-ink-muted px-4 pb-4 leading-snug">{item.answer}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </Container>
  );
}
