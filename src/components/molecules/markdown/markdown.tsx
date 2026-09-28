import MarkdownToJSX from 'markdown-to-jsx/react';

import { sanitizeMarkdown } from '@/utils/sanitize-markdown';
import { cn } from '@/utils/cn';

import Code from './components/code';
import Pre from './components/pre';
import type { MarkdownProps } from './markdown.types';

export default function Markdown({ className, content, ...props }: MarkdownProps) {
  const preparedMarkdown = sanitizeMarkdown(content) || '';

  if (!content) return null;

  return (
    <div
      className={cn(
        'prose prose-zinc prose-invert lg:prose-base relative',
        'prose-img:rounded-xl',
        'prose-img:relative prose-img:w-full prose-img:cursor-pointer prose-img:overflow-hidden prose-img:object-cover prose-video:w-full [&_iframe]:aspect-video [&_iframe]:w-full',
        'prose-img:bg-gradient-to-r prose-img:from-zinc-800/50 prose-img:via-zinc-800 prose-img:to-zinc-800/50',
        className,
      )}
    >
      <MarkdownToJSX
        {...props}
        options={{
          tagfilter: false,
          overrides: {
            code: { component: Code },
            pre: { component: Pre },
          },
        }}
      >
        {preparedMarkdown}
      </MarkdownToJSX>
    </div>
  );
}
