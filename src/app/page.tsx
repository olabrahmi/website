import { ViewTransition } from 'react';

import { getLogoSources } from '@/components/logos/logo-sources';
import { About, Capabilities, Contact, Faq, Hero, LogoStrip, Work } from '@/components/home';
import { logoNames } from '@/content/logos';
import { homeGraph, serializeJsonLd } from '@/utils/json-ld';

const logoSources = Object.fromEntries(logoNames.map((name) => [name, getLogoSources(name)]));

const slide = { 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' } as const;

export default function HomePage() {
  return (
    <ViewTransition enter={slide} exit={slide} default="none">
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeGraph()) }} />
        <Hero />
        <LogoStrip sources={logoSources} />
        <Work />
        <Capabilities />
        <About />
        <Faq />
        <Contact />
      </main>
    </ViewTransition>
  );
}
