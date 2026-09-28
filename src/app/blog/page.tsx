import type { Metadata } from 'next';

import { Container } from '@/components/ui';
import { blog } from '@/content/site';

export const metadata: Metadata = {
  title: blog.heading,
  description: blog.empty,
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  return (
    <main>
      <Container className="pt-32 pb-16 md:pt-44 md:pb-24">
        <h1 className="text-ink text-[clamp(2.25rem,1.3rem+3.6vw,4rem)] leading-[1.05] tracking-[-0.025em]">
          {blog.heading}
        </h1>
        <p className="text-ink-muted mt-6 max-w-[52ch] text-lg">{blog.empty}</p>
      </Container>
    </main>
  );
}
