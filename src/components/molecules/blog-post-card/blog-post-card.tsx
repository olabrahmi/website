/* eslint-disable jsx-a11y/alt-text */
import { cn } from '@/utils/cn';
import { Link } from '@/components/elements/link';
import { Image } from '@/components/elements/image';
import { formatDate } from '@/utils/format-date';
import { contentReadTime } from '@/utils/content-read-time';

import type { BlogPostCardProps } from './blog-post-card.types';

export default function BlogPostCard({ post, fullSlug, className }: BlogPostCardProps) {
  const formattedDate = formatDate(post.createdAt);
  const readTime = contentReadTime(post.content || '');

  return (
    <Link
      className={cn(
        className,
        'bg-zinc-transparent border-border hover:drop-shadow-border relative flex flex-col overflow-hidden rounded-xl border hover:bg-zinc-900',
      )}
      href={{ url: `/${fullSlug}` }}
    >
      <div className="border-b-border bg-border relative max-h-[250px] min-h-[210px] border-b">
        {post.image && <Image image={post.image} fill />}
      </div>
      <div className="flex flex-col gap-2 px-4 py-5">
        <p className="text-xs text-zinc-500">
          {formattedDate} • {readTime} min read
        </p>
        <h2 className="text-2xl">{post.title}</h2>
        <p className="line-clamp-3 text-sm text-zinc-400">{post.excerpt}</p>
      </div>
    </Link>
  );
}
