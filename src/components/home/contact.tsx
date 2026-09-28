import { Button, Container } from '@/components/ui';
import { contact, person } from '@/content/site';

export default function Contact() {
  return (
    <Container as="section" id="contact" aria-labelledby="contact-heading" className="py-16 md:py-24">
      <div className="border-rule border-t pt-10">
        <h2
          id="contact-heading"
          className="text-ink max-w-[20ch] text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] leading-[1.05] tracking-[-0.025em]"
        >
          {contact.heading}
        </h2>
        <p className="text-ink-muted mt-4">{contact.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`mailto:${person.email}`}>Email me</Button>
          <Button href={person.callUrl} variant="secondary">
            Book a 15-min call
          </Button>
        </div>
      </div>
    </Container>
  );
}
