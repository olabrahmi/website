import { About, BuildingNow, Contact, Hero, HowIWork, LogoStrip, SelectedWork } from '@/components/home';
import { person, siteUrl, socials } from '@/content/site';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.jobTitle,
  url: siteUrl,
  email: `mailto:${person.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Rabat', addressCountry: 'MA' },
  sameAs: socials.map((link) => link.href),
};

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <LogoStrip />
      <BuildingNow />
      <SelectedWork />
      <HowIWork />
      <About />
      <Contact />
    </main>
  );
}
