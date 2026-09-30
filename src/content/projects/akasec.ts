import type { CaseStudy } from '../types';

export const akasec: CaseStudy = {
  slug: 'akasec',
  kind: 'client',
  name: 'Akasec',
  card: {
    summary: 'Tickets, QR check-in and live agenda for Cyber Odyssey.',
    tags: ['Next.js', 'GSAP', 'Neon Postgres', 'QR tickets'],
    cta: 'Read case study',
  },
  title: 'Tickets, QR check-in and a live agenda for a cybersecurity crowd',
  seoDescription:
    "Every year I build the Cyber Odyssey site for Akasec, Morocco's biggest student cybersecurity club: ticketing, QR check-in and a live agenda. Solo, full stack.",
  updated: '2026-09-30',
  facts: {
    client: 'Akasec, 1337 Khouribga',
    role: 'Solo, full stack',
    when: '2023 to Dec 2025',
    stack: ['Next.js', 'GSAP', 'Neon Postgres'],
    live: [
      { label: 'akasec.club', href: 'https://akasec.club' },
      { label: 'cyberodyssey.akasec.ma', href: 'https://cyberodyssey.akasec.ma' },
    ],
  },
  shortVersion:
    "Akasec is Morocco's leading student cybersecurity club. Every year I build the site for Cyber Odyssey, their event, from scratch. The audience is security people, so it has to hold up.",
  built: [
    {
      title: 'akasec.club',
      body: "The club's site. Next.js with GSAP animations.",
      href: 'https://akasec.club',
    },
    {
      title: 'cyberodyssey.akasec.ma',
      body: 'Event details, speakers and an agenda that updates live.',
      href: 'https://cyberodyssey.akasec.ma',
    },
    { title: 'Ticketing', body: 'Sign up, get a ticket link by email, download the QR code. Stored in Neon Postgres.' },
    {
      title: 'Check-in app',
      body: 'Volunteers scan QR codes at the door and see visitor, speaker, guest or organizer.',
    },
  ],
  howItsBuilt:
    "Sign up, get a ticket link, download the QR. At the door, volunteers scan it and see the holder's role.",
  diagram: {
    lanes: [
      {
        label: 'Ticket flow',
        nodes: [
          { label: 'Sign-up', note: 'Rate limited' },
          { label: 'Neon Postgres', note: 'Tickets' },
          { label: 'Email with ticket link' },
          { label: 'QR code ticket' },
          { label: 'Volunteer scan', note: 'Check-in app', human: true },
          { label: 'Role shown', note: 'Visitor, speaker, guest or organizer' },
        ],
      },
    ],
  },
  hardParts: [{ problem: 'Keeping sign-ups from being abused.', call: 'Rate limits on sign-up requests.' }],
  metrics: [
    { value: '3,000+', label: 'attendees across all editions', up: true },
    { value: '3', label: 'editions built, 2023 to 2025' },
  ],
  media: {
    hero: true,
    details: 2,
    alt: { hero: 'Akasec homepage with members at computers at a cybersecurity event' },
  },
  pending: [],
};
