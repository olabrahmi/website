import { allProjects } from '@/content/projects';
import { capabilities, description, faq, person, siteUrl, socials } from '@/content/site';
import type { CaseStudy } from '@/content/types';

export const ids = {
  person: `${siteUrl}/#person`,
  website: `${siteUrl}/#website`,
};

const personNode = {
  '@type': 'Person',
  '@id': ids.person,
  name: person.name,
  givenName: 'Oussama',
  familyName: 'Labrahmi',
  jobTitle: person.jobTitle,
  description,
  url: siteUrl,
  email: `mailto:${person.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Casablanca', addressCountry: 'MA' },
  alumniOf: { '@type': 'EducationalOrganization', name: '1337', url: 'https://1337.ma' },
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Drizzle ORM',
    'Datadog',
    'Service level objectives',
    'On-call',
    'Terraform',
    'Google Cloud Platform',
    'Playwright',
    'Vitest',
    'AI agents',
    'Claude',
    'Claude Code',
    'n8n',
    'Headless CMS',
  ],
  sameAs: socials.map((link) => link.href),
  makesOffer: capabilities.items.map((item) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: item.title, description: item.body },
  })),
};

const websiteNode = {
  '@type': 'WebSite',
  '@id': ids.website,
  url: siteUrl,
  name: person.name,
  publisher: { '@id': ids.person },
  inLanguage: 'en',
};

export function homeGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      websiteNode,
      personNode,
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#profile`,
        url: siteUrl,
        mainEntity: { '@id': ids.person },
        isPartOf: { '@id': ids.website },
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${siteUrl}/#work`,
        itemListElement: allProjects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${siteUrl}/work/${project.slug}`,
          name: project.title,
        })),
      },
    ],
  };
}

export function caseStudyGraph(project: CaseStudy) {
  const url = `${siteUrl}/work/${project.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: project.title,
        description: project.seoDescription ?? project.shortVersion,
        url,
        // The path without the ?hash query Next adds to og:image still returns the PNG.
        image: `${url}/opengraph-image`,
        dateModified: project.updated,
        author: { '@id': ids.person },
        publisher: { '@id': ids.person },
        isPartOf: { '@id': ids.website },
        about: project.facts.client,
        keywords: project.facts.stack.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${siteUrl}/#work` },
          { '@type': 'ListItem', position: 3, name: project.name, item: url },
        ],
      },
      personNode,
    ],
  };
}

/** Escapes `<` so no content string can close the script tag (see the Next.js JSON-LD guide). */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
