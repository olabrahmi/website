import { logoNames } from '@/content/logos';
import { cn } from '@/utils/cn';

import Logo from './logo';
import { getLogoSources } from './logo-sources';

const known = new Set<string>([...logoNames, 'Akasec']);

export const hasProjectMark = (name: string) => known.has(name);

/**
 * The client's wordmark, or the project name set in the display font (Maya, Shaza).
 * Server only: it reads the disk, so client components must import Logo directly, not through the barrel.
 */
export default function ProjectMark({ name, className }: { name: string; className?: string }) {
  if (known.has(name)) {
    return (
      <Logo name={name as Parameters<typeof Logo>[0]['name']} sources={getLogoSources(name)} className={className} />
    );
  }

  return (
    <span className={cn('font-display text-xl leading-none font-extrabold tracking-[-0.03em]', className)}>{name}</span>
  );
}
