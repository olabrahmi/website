import fs from 'node:fs';
import path from 'node:path';

import Image from 'next/image';

import { cn } from '@/utils/cn';

import LoopVideo from './loop-video';

interface MediaFrameProps {
  slug: string;
  name: string;
  alt: string;
  aspect?: string;
  className?: string;
  priority?: boolean;
}

const publicPath = (slug: string, file: string) => path.join(process.cwd(), 'public', 'projects', slug, file);

export default function MediaFrame({ slug, name, alt, aspect = '16 / 10', className, priority }: MediaFrameProps) {
  const base = `/projects/${slug}/${name}`;
  const hasVideo = fs.existsSync(publicPath(slug, `${name}.webm`));
  const hasImage = fs.existsSync(publicPath(slug, `${name}.webp`));

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
          sizes="(min-width: 1200px) 1136px, 100vw"
          className="object-cover"
          priority={priority}
        />
      )}
    </div>
  );
}
