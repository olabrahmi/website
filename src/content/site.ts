import type { SocialLink } from './types';

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://labrahmi.me';

export const person = {
  name: 'Oussama Labrahmi',
  jobTitle: 'Senior product engineer',
  location: 'Casablanca, Morocco',
  email: 'oussama@labrahmi.me',
  callUrl: 'https://cal.com/labrahmi/15min',
} as const;

export const description =
  'Oussama Labrahmi, senior product engineer building web platforms and AI agent workflows. Case studies from PAYBACK, Takeda, Descope and more.';

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/olabrahmi' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/olabrahmi/' },
];

/** Blog is hidden for now: add `{ label: 'Blog', href: '/blog' }` back with the route. */
export const nav = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/#about' },
  // Hidden on phones: the hero already has this button.
  { label: 'Email me', href: `mailto:${person.email}` },
] as const;

export const hero = {
  headline: 'I build web platforms and AI agents.',
  subline: 'Senior product engineer. Six years shipping for PAYBACK, Takeda and Descope.',
  status: 'Open to Applied AI and senior product roles · Remote, CET',
} as const;

export const about = {
  heading: 'About me',
  body: [
    "I'm Oussama. I taught myself to code at 10. Joining 1337 in Khouribga grew my skills and network.",
    "Six years building across Europe and the US. I own PAYBACK's sign-up flow and I'm stakeholder and technical advisor at Dali.",
    'I also build coding agents for fun, mostly late at night.',
  ],
  facts: ['Casablanca, Morocco', '1337 alum', '6 years', 'Advisor at Dali'],
} as const;

export const contact = {
  heading: 'Hiring for AI or product engineering?',
  body: 'I reply within a day.',
} as const;

export const notFound = {
  message: "This page doesn't exist. Try the work section.",
  button: 'See my work',
} as const;

export const workIntro = "AI agents I'm building now, and the platforms I've shipped for clients.";
