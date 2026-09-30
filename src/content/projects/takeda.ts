import type { CaseStudy } from '../types';

export const takeda: CaseStudy = {
  slug: 'takeda',
  kind: 'client',
  name: 'Takeda',
  card: {
    summary: 'takeda.com, moved from PHP to Next.js with 30+ engineers.',
    tags: ['Next.js', 'Tailwind', 'Sanity', 'Vercel'],
    cta: 'Read case study',
  },
  title: 'Rebuilding takeda.com for 2M+ monthly visitors',
  updated: '2026-09-30',
  facts: {
    client: 'Takeda (via Bejamas)',
    role: 'Frontend developer',
    when: 'Mar 2023 to Jan 2025',
    team: '30+ engineers',
    stack: ['Next.js', 'Tailwind', 'Sanity', 'Vercel'],
    live: [{ label: 'takeda.com', href: 'https://www.takeda.com' }],
  },
  shortVersion:
    "Takeda's global site moved off PHP to Next.js, Tailwind and Sanity on Vercel. I was one of 30+ engineers on the rebuild.",
  builtTitle: 'What we built',
  built: [
    { title: 'Section library', body: '100+ reusable sections in Sanity that editors assemble pages from.' },
    { title: 'Frontend', body: 'Typed Next.js and Tailwind components that render each section, shipped on Vercel.' },
  ],
  howItsBuilt:
    'Editors compose pages in Sanity from typed sections. Next.js and Tailwind render them, Vercel ships them.',
  diagram: {
    lanes: [
      {
        label: 'Publishing',
        nodes: [
          { label: 'Editors', human: true },
          { label: 'Sanity', note: '100+ sections' },
          { label: 'Next.js and Tailwind', note: 'Section components' },
          { label: 'Vercel', note: 'takeda.com' },
        ],
      },
    ],
  },
  hardParts: [],
  metrics: [
    { value: '2M+', label: 'monthly visitors', up: true },
    { value: '100+', label: 'reusable sections' },
    { value: '30+', label: 'engineers on the rebuild' },
  ],
  media: { hero: true, details: 0, alt: { hero: 'Takeda global homepage with a red hero banner and a news carousel' } },
  pending: [],
};
