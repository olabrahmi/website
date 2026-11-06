import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      // The CV page is gone: the buttons download the PDF directly.
      { source: '/cv', destination: '/', permanent: false },
      // The writing lives at /notes.
      { source: '/blog', destination: '/notes', permanent: false },
      { source: '/blog/:slug', destination: '/notes', permanent: false },
    ];
  },
};

export default createMDX()(nextConfig);
