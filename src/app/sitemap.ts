import type { MetadataRoute } from 'next';

import { allNotes } from '@/content/notes';
import { allProjects } from '@/content/projects';
import { siteUrl } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = new Date(
    allProjects
      .map((project) => project.updated)
      .sort()
      .at(-1) ?? Date.now(),
  );
  const pages = [''].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: latest,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.6,
  }));
  const work = allProjects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: new Date(project.updated),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  const notes = [
    {
      url: `${siteUrl}/notes`,
      lastModified: new Date(allNotes[0].updated),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...allNotes.map((note) => ({
      url: `${siteUrl}/notes/${note.slug}`,
      lastModified: new Date(note.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  return [...pages, ...notes, ...work];
}
