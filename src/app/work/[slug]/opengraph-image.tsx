import { getProject } from '@/content/projects';
import { ogSize, renderOg } from '@/utils/og';

export const alt = 'Case study';
export const size = ogSize;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  return renderOg(project?.title ?? 'Case study', project ? `Case study · ${project.name}` : 'Case study');
}
