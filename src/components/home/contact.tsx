import { Reveal } from '@/components/motion';
import { ArrowRight, Button, Container } from '@/components/ui';
import { contact, person } from '@/content/site';

export default function Contact() {
  return (
    <Container as="section" id="contact" aria-labelledby="contact-heading" className="py-14 md:py-20">
      <Reveal>
        <div className="border-rule bg-surface relative overflow-hidden rounded-3xl border p-7 md:p-12 md:text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_0%,var(--aurora-a),transparent_70%),radial-gradient(50%_70%_at_10%_110%,var(--aurora-b),transparent_70%)]"
          />
          <h2 id="contact-heading" className="type-display-2 text-ink relative max-w-[16ch] md:mx-auto">
            {contact.heading}
          </h2>
          <p className="text-ink-muted relative mt-4">{contact.body}</p>
          <div className="relative mt-7 flex flex-wrap items-center gap-2.5 md:justify-center">
            <Button href={`mailto:${person.email}`}>
              Email me
              <ArrowRight className="btn-arrow" />
            </Button>
            <Button href={person.callUrl} variant="secondary">
              Book a 15-min call
            </Button>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
