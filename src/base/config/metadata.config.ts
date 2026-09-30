import type { Metadata, Viewport } from 'next';

import { description, person, siteUrl } from '@/content/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.name} · Senior product engineer`,
    template: `%s · ${person.name}`,
  },
  description,
  applicationName: person.name,
  authors: [{ name: person.name, url: siteUrl }],
  creator: person.name,
  keywords: [
    'senior product engineer',
    'frontend engineer',
    'Next.js',
    'React',
    'TypeScript',
    'AI agents',
    'Claude',
    'applied AI',
    'Morocco',
  ],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: person.name,
    title: `${person.name} · Senior product engineer`,
    description,
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
};
