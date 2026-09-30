import type { MetadataRoute } from 'next';

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

  return [...pages, ...work];
}
