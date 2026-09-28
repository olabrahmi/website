import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';

export const displayFont = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
  display: 'swap',
});

export const bodyFont = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

export const monoFont = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});
