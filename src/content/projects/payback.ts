import type { CaseStudy } from '../types';

export const payback: CaseStudy = {
  slug: 'payback',
  kind: 'client',
  name: 'PAYBACK',
  card: {
    summary: "The sign-up flow for Germany's biggest loyalty program. Partners like dm, EDEKA and Aral depend on it.",
    stats: ['1.1M+ monthly visitors', 'Priority 1 feature'],
    tags: ['Next.js', 'MUI', 'NX', 'PayloadCMS', 'GCP', 'Playwright'],
    cta: 'Read case study',
  },
  title: "Owning the frontend of PAYBACK's sign-up flow",
  facts: {
    client: 'PAYBACK (via iMedia24)',
    role: 'Senior Frontend Developer, frontend owner of enrollment',
    when: 'Aug 2025 to now',
    team: 'Across Germany, Poland and Morocco',
    stack: ['Next.js', 'MUI', 'NX', 'PayloadCMS', 'GCP', 'Terraform', 'Playwright', 'Vitest', 'Datadog'],
    live: [{ label: 'payback.de', href: 'https://www.payback.de' }],
  },
  shortVersion:
    "Enrollment is how new members join PAYBACK, and partners across Germany rely on it. I own the frontend while teammates own the backend. It's a priority 1 feature, so the bar for testing and review is high.",
  context:
    "It's a micro-frontend setup: each team owns its slice of the site in its own NX monorepo. Content comes from PayloadCMS. Infra runs on GCP, managed with Terraform.",
  built: [
    { body: 'The full frontend of the enrollment flow in Next.js and MUI.' },
    { body: 'Playwright end-to-end tests for every path, and Vitest for logic.' },
    { body: 'Datadog SLOs and synthetic checks on login and sign-up.' },
    { body: 'Coaching for backend teammates, so they can ship frontend changes too.' },
    {
      body: '24/7 on-call one week every month, fixing production incidents at any hour to hold 99.9% uptime.',
    },
  ],
  howItsBuilt:
    'Enrollment is one slice of a micro-frontend site. Content comes from PayloadCMS, the UI is Next.js and MUI inside an NX monorepo, and everything runs on GCP through Terraform. Playwright and Vitest gate every change, and Datadog watches the live flow.',
  diagram: {
    lanes: [
      {
        label: 'Request path',
        nodes: [
          { label: 'PayloadCMS', note: 'Content' },
          { label: 'Next.js and MUI', note: 'Enrollment slice' },
          { label: 'NX monorepo', note: 'One per team' },
          { label: 'GCP', note: 'Managed with Terraform' },
        ],
      },
      {
        label: 'Quality',
        nodes: [
          { label: 'Vitest', note: 'Logic' },
          { label: 'Playwright', note: 'Every path' },
          { label: 'Datadog', note: 'SLOs and synthetic checks' },
          { label: 'On-call', note: 'One week a month', human: true },
        ],
      },
    ],
  },
  hardParts: [
    'Shipping in a flow where a bug means lost sign-ups for partners like dm, Netto, EDEKA, Decathlon and Aral.',
    "Keeping a micro-frontend consistent with other teams' pieces.",
  ],
  results: ['1.1M+ monthly visitors.'],
  today:
    'An agent that drafts Playwright tests from a ticket, with a human reviewing each one. Synthetic checks that flag which step of sign-up broke, not just that it broke.',
  media: { hero: false, details: 0 },
  pending: ['Approval to share more numbers than 1.1M+ monthly visitors, if you want them here'],
};
