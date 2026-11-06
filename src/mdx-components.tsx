import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { Callout, JevonsDiagram, Stat, StatCards } from '@/components/notes';
import { cn } from '@/utils/cn';
import { slugifyHeading } from '@/utils/notes';

const measure = 'max-w-[40rem]';

function H2({ children }: { children?: ReactNode }) {
  return (
    <h2 id={slugifyHeading(String(children))} className={cn('type-h2 text-ink mt-8 md:mt-12', measure)}>
      {children}
    </h2>
  );
}

function Wrapper({ children }: { children?: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

function Anchor({ href = '', children }: ComponentProps<'a'>) {
  const className =
    'text-ink decoration-accent/50 hover:decoration-accent underline decoration-1 underline-offset-[3px] transition-[text-decoration-color] duration-150';

  if (href.startsWith('/')) {
    return (
      <Link href={href} transitionTypes={['nav-forward']} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}

const components: MDXComponents = {
  wrapper: Wrapper,
  h2: H2,
  h3: ({ children }) => <h3 className={cn('type-h3 text-ink mt-3', measure)}>{children}</h3>,
  p: ({ children }) => <p className={cn('text-ink text-[1.0625rem] leading-[1.7] md:text-lg', measure)}>{children}</p>,
  a: Anchor,
  ul: ({ children }) => (
    <ul className={cn('text-ink marker:text-accent flex list-disc flex-col gap-2 pl-5 text-lg', measure)}>
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className={cn('text-ink marker:text-accent flex list-decimal flex-col gap-2 pl-5 text-lg', measure)}>
      {children}
    </ol>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  Callout,
  JevonsDiagram,
  Stat,
  StatCards,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
