import { GlassWordmark, Reveal } from '@/components/motion';
import { ArrowRight, Button, Container } from '@/components/ui';
import { contact, person } from '@/content/site';

/**
 * Full-bleed band, no card: no border, no rounded corners. The content stays at the 1040px width; the glass word
 * runs along the bottom edge. Only the bottom is clipped (clip-path, not overflow): the 3D canvas reaches 10rem above
 * the band (`-top-40` in glass-wordmark.tsx), so the word can rise past the top edge. `-mb-10` cancels the footer's `mt-10`, so the band meets the footer.
 */
export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="group/cta relative isolate -mb-10 [clip-path:inset(-10rem_0_0_0)]"
    >
      {/* Surface and glows fade in over the top 9rem instead of starting at a hard edge. The WebGL canvas fades the same way. */}
      <div
        aria-hidden="true"
        className="bg-surface pointer-events-none absolute inset-0 -z-20 [mask-image:linear-gradient(to_bottom,transparent,black_9rem)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_0%,var(--aurora-a),transparent_70%),radial-gradient(50%_70%_at_10%_110%,var(--aurora-b),transparent_70%)] group-data-[gl=on]/cta:opacity-0 group-data-[gl=on]/cta:[transition:opacity_0ms_linear_650ms]" />
      </div>
      <Reveal>
        <Container className="relative pt-24 md:pt-36 md:text-center">
          <h2 id="contact-heading" className="type-display-2 text-ink max-w-[16ch] md:mx-auto">
            {contact.heading}
          </h2>
          <p className="text-ink-muted mt-4">{contact.body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-2.5 md:justify-center">
            <Button href={`mailto:${person.email}`}>
              Email me
              <ArrowRight className="btn-arrow" />
            </Button>
            <Button href={person.callUrl} variant="secondary">
              Book a 15-min call
            </Button>
          </div>
        </Container>
      </Reveal>
      {/* The band is capped so the word does not balloon on very wide screens; the scene caps it the same way. */}
      <GlassWordmark className="mx-auto mt-12 max-w-[1500px]" />
    </section>
  );
}
