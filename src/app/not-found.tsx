import { AuroraBackground } from '@/components/motion';
import { ArrowRight, Button, Container } from '@/components/ui';
import { notFound } from '@/content/site';

export default function NotFound() {
  return (
    <main>
      <AuroraBackground className="items-stretch justify-start pt-32 pb-14 md:pt-44 md:pb-20">
        <Container>
          <p className="type-eyebrow text-accent">404</p>
          <h1 className="type-display-2 text-ink mt-4 max-w-[18ch]">{notFound.message}</h1>
          <div className="mt-7">
            <Button href="/#work">
              {notFound.button}
              <ArrowRight className="btn-arrow" />
            </Button>
          </div>
        </Container>
      </AuroraBackground>
    </main>
  );
}
