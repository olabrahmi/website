import type { CaseStudy } from '../types';

export const o1labs: CaseStudy = {
  slug: 'o1labs',
  kind: 'client',
  name: 'o1Labs',
  card: {
    summary: "Built part of a 50+ section library so o1Labs' marketers build pages without developers.",
    stats: ['50+ reusable sections', 'Instant publish'],
    tags: ['Next.js', 'Sanity', 'Vercel'],
    cta: 'Read case study',
  },
  title: "A page builder o1Labs' marketing team runs alone",
  facts: {
    client: 'o1Labs (via Bejamas)',
    role: 'Frontend developer',
    stack: ['Next.js', 'Sanity', 'Vercel'],
    live: [{ label: 'o1labs.org', href: 'https://www.o1labs.org' }],
  },
  shortVersion:
    'o1Labs builds zero-knowledge cryptography tooling. We rebuilt their site on Next.js and Sanity with a library of 50+ sections. When marketing hits publish, the change is live right away.',
  built: [
    { body: 'Part of the 50+ section library in Sanity and Next.js.' },
    { body: 'On-demand revalidation, so published content goes live immediately.' },
  ],
  howItsBuilt:
    'Marketers assemble pages from sections in Sanity. Publishing fires a revalidation request, and Next.js rebuilds only the affected pages on Vercel.',
  diagram: {
    lanes: [
      {
        label: 'Publishing',
        nodes: [
          { label: 'Marketer hits publish', human: true },
          { label: 'Sanity', note: '50+ sections' },
          { label: 'Revalidation', note: 'On demand' },
          { label: 'Next.js on Vercel', note: 'Live right away' },
        ],
      },
    ],
  },
  hardParts: [],
  results: ['Marketers publish pages and see them live right away, without asking a developer.'],
  today:
    'An agent that assembles a first-draft landing page from a brief using the existing sections, for a marketer to edit.',
  media: { hero: true, details: 2 },
  pending: [
    'Exact dates on o1Labs',
    'Which sections were yours',
    'Hard parts for this project',
    'Agency case study link (Bejamas)',
  ],
};
