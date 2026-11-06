'use client';

import { useEffect, useRef, useState } from 'react';

import { Check } from '@/components/ui';
import { LinkedInIcon } from '@/components/ui/social-icons';
import { cn } from '@/utils/cn';

const buttonClass = cn(
  'border-rule bg-surface text-ink relative grid size-10 cursor-pointer place-items-center rounded-full border',
  'transition-[background-color,transform] duration-150 active:scale-[0.96] motion-reduce:transition-none',
  '[@media(hover:hover)]:hover:bg-surface-2',
);

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.2 2.25h3.32l-7.25 8.28 8.53 11.22h-6.68l-5.23-6.84-5.99 6.84H1.58l7.75-8.86-8.18-10.64h6.85l4.73 6.25 5.47-6.25Zm-1.16 17.52h1.84L7.02 4.12H5.05l11.99 15.65Z" />
    </svg>
  );
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
    </svg>
  );
}

export default function NoteShare({ url, title, className }: { url: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const encodedUrl = encodeURIComponent(url);
  const swap = 'absolute size-4 transition-[opacity,scale,filter] duration-200 ease-out motion-reduce:transition-none';

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Link copied' : 'Copy link'}
        title={copied ? 'Link copied' : 'Copy link'}
        className={buttonClass}
      >
        <LinkIcon className={cn(swap, copied ? 'scale-25 opacity-0 blur-[4px]' : 'blur-0 scale-100 opacity-100')} />
        <Check
          className={cn(swap, 'text-pass', copied ? 'blur-0 scale-100 opacity-100' : 'scale-25 opacity-0 blur-[4px]')}
        />
      </button>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
        className={buttonClass}
      >
        <LinkedInIcon className="size-4" />
      </a>
      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        title="Share on X"
        className={buttonClass}
      >
        <XIcon className="size-3.5" />
      </a>
    </div>
  );
}
