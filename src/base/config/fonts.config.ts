import { DM_Sans, Geist, JetBrains_Mono } from 'next/font/google';

/** Every title and heading, hero included. */
export const displayFont = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

/** All other text: body, labels, badges, buttons. */
export const bodyFont = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

/** Numbers in projects: metrics, dates, read time. */
export const monoFont = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});
