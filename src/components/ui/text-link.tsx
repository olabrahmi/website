import NextLink from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import { ArrowRight } from './icons';

interface TextLinkProps {
  href: string;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}

export default function TextLink({ href, children, arrow, className }: TextLinkProps) {
  const external = href.startsWith('http') || href.startsWith('mailto:');
  const classes = cn(
    'group/link inline-flex items-center gap-1.5 font-medium text-ink underline decoration-rule decoration-1 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-accent',
    className,
  );
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRight className="ease-out-strong size-4 shrink-0 transition-transform duration-150 motion-reduce:transition-none [@media(hover:hover)]:group-hover/link:translate-x-0.5" />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes}>
      {content}
    </NextLink>
  );
}
