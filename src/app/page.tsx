import { ViewTransition } from 'react';

import { getLogoSources } from '@/components/logos/logo-sources';
import { About, Contact, Hero, LogoStrip, Work } from '@/components/home';
import { logoNames } from '@/content/logos';
import { person, siteUrl, socials } from '@/content/site';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.jobTitle,
  url: siteUrl,
  email: `mailto:${person.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Casablanca', addressCountry: 'MA' },
  sameAs: socials.map((link) => link.href),
};

const logoSources = Object.fromEntries(logoNames.map((name) => [name, getLogoSources(name)]));

const slide = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' } as const;

export default function HomePage() {
  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <Hero />
        <LogoStrip sources={logoSources} />
        <Work />
        <About />
        <Contact />
      </main>
    </ViewTransition>
  );
}
