import Image from 'next/image';

import { cn } from '@/utils/cn';
import { publicFileExists } from '@/utils/public-files';

import LoopVideo from './loop-video';

interface MediaFrameProps {
  slug: string;
  name: string;
  alt: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Shows public/projects/<slug>-<name>.webp or .webm, e.g. payback-hero.webp. A clip wins over an image, and the
 * image becomes its poster. Missing file: a dashed placeholder in development, nothing in production.
 */
export default function MediaFrame({ slug, name, alt, aspect = '16 / 10', className, priority }: MediaFrameProps) {
  const base = `/projects/${slug}-${name}`;
  const hasVideo = publicFileExists(`${base.slice(1)}.webm`);
  const hasImage = publicFileExists(`${base.slice(1)}.webp`);

  if (!hasVideo && !hasImage) {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
      <div
        style={{ aspectRatio: aspect }}
        className={cn(
          'border-rule bg-surface text-ink-muted grid place-items-center rounded-xl border border-dashed p-4 text-center font-mono text-[0.8125rem]',
          className,
        )}
      >
        public{base}.webp or .webm
      </div>
    );
  }

  return (
    <div
      style={{ aspectRatio: aspect }}
      className={cn('img-outline bg-surface relative overflow-hidden rounded-xl', className)}
    >
      {hasVideo ? (
        <LoopVideo src={`${base}.webm`} poster={hasImage ? `${base}.webp` : undefined} label={alt} />
      ) : (
        <Image
          src={`${base}.webp`}
          alt={alt}
          fill
          sizes="(min-width: 1040px) 976px, 100vw"
          className="object-cover"
          priority={priority}
        />
      )}
    </div>
  );
}
