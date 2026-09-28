import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'icon';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

const isPlainAnchor = (href: string, download: unknown) =>
  download !== undefined || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

export default function Button(props: ButtonProps | LinkButtonProps) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props;
  const shared = { 'data-variant': variant, 'data-size': size, className: cn('btn', className) };

  if (props.href !== undefined) {
    const { href, download, ...anchorProps } = rest as Omit<LinkButtonProps, keyof BaseProps>;
    const external = href.startsWith('http');

    if (isPlainAnchor(href, download)) {
      return (
        <a
          href={href}
          download={download}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          {...anchorProps}
          {...shared}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink href={href} {...anchorProps} {...shared}>
        {children}
      </NextLink>
    );
  }

  const { type = 'button', ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} {...buttonProps} {...shared}>
      {children}
    </button>
  );
}
