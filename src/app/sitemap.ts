import type { MetadataRoute } from 'next';

import { allProjects } from '@/content/projects';
import { siteUrl } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ['', '/blog', '/cv'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.6,
  }));
  const work = allProjects.map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  return [...pages, ...work];
}
