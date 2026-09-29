import type { CaseStudy } from '../types';

export const o1labs: CaseStudy = {
  slug: 'o1labs',
  kind: 'client',
  name: 'o1Labs',
  card: {
    summary: 'A page builder marketers run with no developer needed.',
    tags: ['Next.js', 'Sanity', 'Algolia', 'Vercel'],
    cta: 'Read case study',
  },
  title: "A page builder o1Labs' marketing team runs alone",
  facts: {
    client: 'o1Labs (via Bejamas)',
    role: 'Frontend developer',
    when: 'Feb 2024 to Apr 2025',
    stack: ['Next.js', 'Sanity', 'Algolia', 'Vercel'],
    live: [{ label: 'o1labs.org', href: 'https://www.o1labs.org' }],
  },
  shortVersion:
    'o1Labs builds zero-knowledge tooling. Their site felt outdated and marketing needed a developer for every new page. We rebuilt it as a page builder marketing runs alone.',
  context:
    'The old site buried the products, and the blog lived on Medium, away from the site. Adding a page meant asking a developer.',
  builtTitle: 'What we built',
  built: [
    {
      title: 'Page builder',
      body: 'Sanity CMS with live preview and a library of 50+ reusable sections. Marketers compose pages themselves.',
    },
    { title: 'Product pages', body: 'A dedicated page for each o1Labs product.' },
    { title: 'Blog, in the site', body: 'Moved off Medium into the site, with Algolia search.' },
    { title: 'Instant publish', body: 'On-demand revalidation. Hit publish and the page is live.' },
  ],
  howItsBuilt:
    'Marketers assemble pages from sections in Sanity. Publishing triggers revalidation, Vercel serves the new page.',
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
  metrics: [
    { value: '50+', label: 'reusable sections' },
    { value: 'Instant', label: 'publish, via on-demand revalidation' },
    { value: '0', label: 'dev tickets to publish a page', up: true },
  ],
  media: { hero: true, details: 2 },
  pending: [],
};
