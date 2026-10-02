import Image from 'next/image';

import type { LogoName } from '@/content/logos';
import { cn } from '@/utils/cn';

import type { LogoSources } from './logo-sources';

const PaybackIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6 shrink-0">
    <path d="M16.1796 11.4765c-2.0161 0-3.6576-1.6401-3.6576-3.6548 0-2.0148 1.6401-3.6562 3.6576-3.6562s3.6548 1.64 3.6548 3.6562c0 2.016-1.64 3.6548-3.6548 3.6548zm-.0014 8.3595c-2.0161 0-3.6562-1.64-3.6562-3.6562 0-2.0161 1.64-3.6562 3.6562-3.6562 2.016 0 3.6562 1.6401 3.6562 3.6562 0 2.0161-1.6401 3.6562-3.6562 3.6562zm0-6.5877c-1.6168 0-2.9315 1.3148-2.9315 2.9315 0 1.6168 1.3147 2.9315 2.9315 2.9315 1.6167 0 2.9315-1.3147 2.9315-2.9315 0-1.6167-1.3148-2.9315-2.9315-2.9315zM7.8187 19.836c-2.0162 0-3.6562-1.64-3.6562-3.6562 0-2.0161 1.64-3.6562 3.6562-3.6562 2.016 0 3.6561 1.6401 3.6561 3.6562 0 2.0161-1.64 3.6562-3.6561 3.6562zm0-6.5877c-1.6168 0-2.9316 1.3148-2.9316 2.9315 0 1.6168 1.3148 2.9315 2.9316 2.9315 1.6167 0 2.9315-1.3147 2.9315-2.9315 0-1.6167-1.3148-2.9315-2.9315-2.9315zm0-1.7718c-2.0162 0-3.6562-1.6401-3.6562-3.6562 0-2.0161 1.64-3.6562 3.6562-3.6562 2.016 0 3.6561 1.64 3.6561 3.6562 0 2.0161-1.64 3.6562-3.6561 3.6562zm0-6.5877c-1.6168 0-2.9316 1.3148-2.9316 2.9315 0 1.6167 1.3148 2.9315 2.9316 2.9315 1.6167 0 2.9315-1.3148 2.9315-2.9315 0-1.6167-1.3148-2.9315-2.9315-2.9315zM3.0014 0C1.3462 0 0 1.3465 0 3.0003V21c0 1.6537 1.3462 3 3.0014 3h17.994c1.6551 0 3.003-1.3463 3.003-3V3.0002C23.9984 1.3465 22.6519 0 20.9954 0Z" />
  </svg>
);

/**
 * Real marks come from public/logos/<slug>-light.svg and <slug>-dark.svg, named by the artwork's color:
 * -light is the white logo (shown in dark mode), -dark is the dark logo (shown in light mode).
 * Both are rendered and CSS picks one from the `dark` class, so there is no flash on load.
 * One variant alone is used for both themes. No file at all falls back to the typeset name below
 * (PAYBACK keeps its built-in icon). Typeset names paint with currentColor.
 */
const wordmarks: Record<LogoName, { text: string; className: string; icon?: boolean }> = {
  PAYBACK: { text: 'PAYBACK', className: 'font-semibold tracking-[0.06em]', icon: true },
  Takeda: { text: 'Takeda', className: 'font-semibold tracking-[-0.02em]' },
  Descope: { text: 'descope', className: 'font-semibold tracking-[-0.03em]' },
  'Charm Industrial': { text: 'CHARM INDUSTRIAL', className: 'text-[0.9375rem] font-semibold tracking-[0.08em]' },
  o1Labs: { text: 'o1Labs', className: 'font-semibold tracking-[-0.01em]' },
  'Palais Shazam': { text: 'Palais Shazam', className: 'font-medium tracking-[-0.01em]' },
  Akasec: { text: 'akasec', className: 'font-extrabold tracking-[-0.02em]' },
};

/** The Palais Shazam mark is the wordmark only (no arches, no tagline), a little taller than the rest to read as big. */
const heights: Partial<Record<LogoName, string>> = { 'Palais Shazam': 'h-7 sm:h-8' };

/**
 * Each SVG's own size. next/image warns when the rendered height matches the attribute but the width does not, which
 * a shared 120x32 did for Palais Shazam at 32px tall. Real dimensions also reserve the right aspect ratio.
 */
const intrinsic: Record<LogoName, { width: number; height: number }> = {
  PAYBACK: { width: 1711, height: 384 },
  Takeda: { width: 1417, height: 476 },
  Descope: { width: 1417, height: 325 },
  'Charm Industrial': { width: 1417, height: 325 },
  o1Labs: { width: 732, height: 476 },
  'Palais Shazam': { width: 2340, height: 480 },
  Akasec: { width: 1417, height: 470 },
};

interface LogoProps {
  name: LogoName;
  /** Which files exist, from getLogoSources on the server. No files: the typeset name is used. */
  sources?: LogoSources;
  className?: string;
}

export default function Logo({ name, sources, className }: LogoProps) {
  const light = sources?.onLight ?? sources?.onDark;
  const dark = sources?.onDark ?? sources?.onLight;

  if (light || dark) {
    const size = cn('h-6 w-auto max-w-full object-contain sm:h-7', heights[name], className);

    return (
      <span className="inline-flex max-w-full items-center">
        {light && <Image src={light} alt={name} {...intrinsic[name]} unoptimized className={cn(size, 'dark:hidden')} />}
        {dark && (
          <Image src={dark} alt={name} {...intrinsic[name]} unoptimized className={cn(size, 'hidden dark:block')} />
        )}
      </span>
    );
  }

  const mark = wordmarks[name];

  return (
    <span className={cn('font-display inline-flex items-center gap-2 text-xl leading-none', className)}>
      {mark.icon && <PaybackIcon />}
      <span className={mark.className}>{mark.text}</span>
    </span>
  );
}
