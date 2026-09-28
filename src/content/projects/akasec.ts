import type { CaseStudy } from '../types';

export const akasec: CaseStudy = {
  slug: 'akasec',
  kind: 'client',
  name: 'Akasec',
  card: {
    summary:
      "I rebuild the site for Cyber Odyssey, Morocco's biggest cybersecurity event, every year. Ticketing and QR check-in included.",
    stats: ['Built yearly since 2023', 'Ticketing and check-in built in-house'],
    tags: ['Next.js', 'GSAP', 'QR tickets'],
    cta: 'Read case study',
  },
  title: 'Tickets, QR check-in and a live agenda for a cybersecurity crowd',
  facts: {
    client: 'Akasec, 1337 Khouribga',
    role: 'Solo, full stack',
    when: '2023 to Dec 2025',
    stack: ['Next.js', 'GSAP'],
    live: [
      { label: 'akasec.club', href: 'https://akasec.club' },
      { label: 'cyberodyssey.akasec.ma', href: 'https://cyberodyssey.akasec.ma' },
    ],
  },
  shortVersion:
    "Akasec is Morocco's leading student cybersecurity club, with alumni at companies like Attijariwafa bank and DataProtect. Every year I build the site for their event, Cyber Odyssey, from scratch. The audience is security people, so it has to hold up to being poked at.",
  built: [
    {
      title: 'akasec.club',
      body: "The club's site: history, team, values and contact. Next.js with GSAP animations.",
      href: 'https://akasec.club',
    },
    {
      title: 'cyberodyssey.akasec.ma',
      body: 'Event details, speakers and a live agenda that updates during the event.',
      href: 'https://cyberodyssey.akasec.ma',
    },
    { title: 'Ticketing', body: 'Sign up, get an email with your ticket link, download it as a QR code.' },
    {
      title: 'Check-in app',
      body: 'Volunteers scan QR codes at the door and see if the person is a visitor, speaker, guest or organizer.',
    },
  ],
  howItsBuilt:
    "A visitor signs up and gets an email with a ticket link. The ticket is a QR code. At the door, volunteers scan it in the check-in app, which shows the ticket holder's role.",
  diagram: {
    lanes: [
      {
        label: 'Ticket flow',
        nodes: [
          { label: 'Sign-up' },
          { label: 'Email with ticket link' },
          { label: 'QR code ticket' },
          { label: 'Volunteer scan', note: 'Check-in app', human: true },
          { label: 'Role shown', note: 'Visitor, speaker, guest or organizer' },
        ],
      },
    ],
  },
  hardParts: [
    'Forged or shared tickets.',
    'Rate limiting sign-ups.',
    'Keeping check-in fast with a queue at the door.',
  ],
  results: ['Rebuilt every year since 2023, with ticketing and check-in run in-house.'],
  today: "An agent that answers attendee questions about the agenda and logistics from the event's own content.",
  media: { hero: true, details: 2 },
  pending: [
    'Backend, database and email provider for the fact bar',
    'The specific security measures you took (forged tickets, rate limiting, check-in speed). This is the point of the project',
  ],
};
