import { notFound } from 'next/navigation';

import { getAllBlogPosts, getBlogPostBySlug, getBlogPostMetadata } from '@/services/storyblok';
import { Markdown } from '@/components/molecules/markdown';
import { BlogPostHero } from '@/components/sections/blog-post-hero';
import type { NextPageProps } from '@/base/types/next';

export default async function BlogPost({ params }: NextPageProps) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  // submit that the post was viewed to a small db

  return (
    <>
      <BlogPostHero post={post} createdAt={post.createdAt} />
      <article className="relative container my-16">
        <Markdown content={post.content} />
      </article>
    </>
  );
}

export async function generateMetadata({ params }: NextPageProps) {
  const { slug } = await params;

  return await getBlogPostMetadata(slug);
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => {
    return {
      slug: post.slug,
    };
  });
}
