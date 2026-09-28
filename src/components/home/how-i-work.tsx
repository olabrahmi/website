import { Container } from '@/components/ui';
import { howIWork } from '@/content/site';

import SectionHeading from './section-heading';

export default function HowIWork() {
  return (
    <Container as="section" aria-labelledby="how-i-work" className="py-16 md:py-24">
      <SectionHeading id="how-i-work">How I work</SectionHeading>
      <ul className="border-rule mt-10 grid gap-x-12 gap-y-10 border-t pt-10 md:grid-cols-2">
        {howIWork.map((item) => (
          <li key={item.lead}>
            <h3 className="text-ink text-xl leading-tight tracking-[-0.01em]">{item.lead}</h3>
            <p className="text-ink-muted mt-2 max-w-[52ch]">{item.body}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
