import type { CaseStudy } from '../types';

export const takeda: CaseStudy = {
  slug: 'takeda',
  kind: 'client',
  name: 'Takeda',
  card: {
    summary: 'Rebuilt takeda.com from PHP to Next.js, with a team of 30+ engineers.',
    stats: ['2M+ monthly visitors', '100+ reusable sections'],
    tags: ['Next.js', 'Tailwind', 'Sanity', 'Vercel'],
    cta: 'Read case study',
  },
  title: 'Rebuilding takeda.com for 2M+ monthly visitors',
  facts: {
    client: 'Takeda (via Bejamas)',
    role: 'Frontend developer',
    team: '30+ engineers',
    stack: ['Next.js', 'Tailwind', 'Sanity', 'Vercel'],
    live: [{ label: 'takeda.com', href: 'https://www.takeda.com' }],
  },
  shortVersion:
    "Takeda's global site moved off a PHP stack to Next.js, Tailwind and Sanity on Vercel. I was one of 30+ engineers on the rebuild. I built many of the 100+ sections editors now use to assemble pages.",
  built: [
    { body: 'Reusable page sections in Sanity, part of the 100+ library editors build pages from.' },
    { body: 'Decision records for the components I built.' },
  ],
  howItsBuilt:
    'Editors compose pages in Sanity from a library of typed sections. Next.js and Tailwind render them, and Vercel ships the result.',
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
  hardParts: [
    'Working inside strict enterprise review and release rules.',
    'Designing sections flexible enough for editors but hard to break.',
  ],
  results: ['2M+ monthly visitors on the new stack, and editors assemble pages from 100+ sections.'],
  handoff: 'Decision records for the components I built.',
  today: 'An agent that checks new sections against the design system and accessibility rules before review.',
  media: { hero: true, details: 2 },
  pending: ['Exact dates on Takeda', 'Which sections and features were yours', 'Agency case study link (Bejamas)'],
};
