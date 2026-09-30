import type { Metadata, Viewport } from 'next';

import { description, person, siteUrl } from '@/content/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.name} · ${person.jobTitle}`,
    template: `%s · ${person.name}`,
  },
  description,
  applicationName: person.name,
  authors: [{ name: person.name, url: siteUrl }],
  creator: person.name,
  keywords: [
    'full-stack product engineer',
    'freelance Next.js developer',
    'senior frontend engineer',
    'backend engineer',
    'Datadog monitoring',
    'on-call',
    'AI agents',
    'Claude',
    'n8n',
    'Morocco',
    'remote',
  ],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: person.name,
    title: `${person.name} · ${person.jobTitle}`,
    description,
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
};
