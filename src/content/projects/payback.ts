import type { CaseStudy } from '../types';

export const payback: CaseStudy = {
  slug: 'payback',
  kind: 'client',
  name: 'PAYBACK',
  card: {
    summary: "The sign-up flow for Germany's biggest loyalty program, used at American Express, dm and Aral.",
    tags: ['Next.js', 'MUI', 'NX', 'PayloadCMS', 'Playwright'],
    cta: 'Read case study',
  },
  title: "Owning the frontend of PAYBACK's sign-up flow",
  seoDescription:
    "I own the frontend of PAYBACK's sign-up flow in Next.js: 122k sign-ups a month, 1.1M+ monthly visitors, Datadog SLOs and 24/7 on-call.",
  updated: '2026-10-02',
  facts: {
    client: 'PAYBACK (via iMedia24)',
    role: 'Senior Frontend Developer, frontend owner of enrollment',
    when: 'Aug 2025 to now',
    team: '20 people in Germany, Poland and Morocco',
    stack: ['Next.js', 'MUI', 'NX', 'PayloadCMS', 'GCP', 'Terraform', 'Playwright', 'Vitest', 'Datadog'],
    live: [{ label: 'payback.de', href: 'https://www.payback.de' }],
  },
  shortVersion:
    "Sign-up is how 122k people a month join PAYBACK, Germany's biggest loyalty program. American Express, dm, EDEKA and Aral depend on it. I helped design it, built it from scratch and own its frontend.",
  context:
    'Micro-frontends: each team owns its slice in its own NX monorepo. Content in PayloadCMS, infra on GCP with Terraform.',
  builtTitle: 'What I helped build',
  built: [
    {
      title: 'Enrollment, from scratch',
      body: 'Designed and coded with the team in Next.js and MUI. I own the frontend.',
    },
    {
      title: 'Card and partner picker',
      body: 'Members pick their card and the partners they want.',
    },
    {
      title: 'Email and address checks',
      body: "Emails are validated against other teams' services, addresses before anything is sent.",
    },
    {
      title: 'Submit and survive failure',
      body: "The request goes to my team's backend. Errors are handled, and circuit breakers stop a failing service from taking sign-up down.",
    },
    {
      title: 'SLOs and tests',
      body: 'Datadog SLOs and synthetic checks on login and sign-up. Playwright on every path, Vitest for logic.',
    },
    {
      title: 'On-call and coaching',
      body: 'One week a month, 24/7. Backend teammates now ship frontend changes too.',
    },
  ],
  howItsBuilt:
    'Enrollment is one slice of a micro-frontend site. Every step is checked before the request reaches the backend, and Datadog watches the live flow.',
  diagram: {
    lanes: [
      {
        label: 'Enrollment flow',
        nodes: [
          { label: 'Pick card and partners' },
          { label: 'Email check', note: "Other teams' services" },
          { label: 'Address check' },
          { label: 'Submit', note: "My team's backend" },
          { label: 'Errors and circuit breakers', note: 'Failures stay contained' },
        ],
      },
      {
        label: 'Quality',
        nodes: [
          { label: 'Vitest', note: 'Logic' },
          { label: 'Playwright', note: 'Every path' },
          { label: 'Datadog', note: 'SLOs, synthetic checks' },
          { label: 'On-call', note: 'One week a month', human: true },
        ],
      },
    ],
  },
  hardParts: [],
  metrics: [
    { value: '122k', label: 'sign-ups a month', up: true },
    { value: '1.1M+', label: 'monthly visitors', up: true },
  ],
  media: { hero: true, details: 0, alt: { hero: 'PAYBACK sign-up step where members pick a card and partners' } },
  pending: [],
};
