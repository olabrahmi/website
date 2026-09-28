import { Button, Container } from '@/components/ui';
import { notFound } from '@/content/site';

export default function NotFound() {
  return (
    <main>
      <Container className="pt-32 pb-16 md:pt-44 md:pb-24">
        <h1 className="text-ink max-w-[18ch] text-[clamp(2.25rem,1.3rem+3.6vw,4rem)] leading-[1.05] tracking-[-0.025em]">
          {notFound.message}
        </h1>
        <div className="mt-8">
          <Button href="/#work">{notFound.button}</Button>
        </div>
      </Container>
    </main>
  );
}
