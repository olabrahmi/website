import { allNotes } from '@/content/notes';
import { allProjects } from '@/content/projects';
import { capabilities, description, faq, person, siteUrl, socials } from '@/content/site';
import type { CaseStudy, Note } from '@/content/types';

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

export function notesGraph() {
  const url = `${siteUrl}/notes`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        url,
        name: `Notes by ${person.name}`,
        author: { '@id': ids.person },
        publisher: { '@id': ids.person },
        isPartOf: { '@id': ids.website },
        inLanguage: 'en',
        blogPost: allNotes.map((note) => ({
          '@type': 'BlogPosting',
          headline: note.title,
          url: `${url}/${note.slug}`,
          datePublished: note.published,
          dateModified: note.updated,
        })),
      },
      personNode,
    ],
  };
}

export function noteGraph(note: Note, stats: { wordCount: number; minutes: number }) {
  const url = `${siteUrl}/notes/${note.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: note.title,
        description: note.description,
        abstract: note.shortAnswer,
        url,
        mainEntityOfPage: url,
        // The path without the ?hash query Next adds to og:image still returns the PNG.
        image: [`${siteUrl}${note.cover.src}`, `${url}/opengraph-image`],
        datePublished: note.published,
        dateModified: note.updated,
        author: { '@id': ids.person },
        publisher: { '@id': ids.person },
        isPartOf: { '@type': 'Blog', '@id': `${siteUrl}/notes#blog`, url: `${siteUrl}/notes` },
        articleSection: note.topic,
        keywords: note.keywords.join(', '),
        about: note.about.map((item) => ({ '@type': 'Thing', ...item })),
        citation: note.sources.map((source) => source.href),
        wordCount: stats.wordCount,
        timeRequired: `PT${stats.minutes}M`,
        inLanguage: 'en',
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#questions`,
        mainEntity: note.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Notes', item: `${siteUrl}/notes` },
          { '@type': 'ListItem', position: 3, name: note.title, item: url },
        ],
      },
      personNode,
    ],
  };
}

/** Escapes `<` so no content string can close the script tag (see the Next.js JSON-LD guide). */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');
