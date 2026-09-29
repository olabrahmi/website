import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The CV is read from private/ at request time, so make sure it ships with the /api/cv function.
  outputFileTracingIncludes: { '/api/cv': ['./private/cv/**'] },
  async redirects() {
    return [
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      // The CV page is gone: the buttons download the PDF directly.
      { source: '/cv', destination: '/', permanent: false },
      // The blog is hidden for now. Temporary redirects, so nothing gets cached as gone.
      { source: '/blog', destination: '/', permanent: false },
      { source: '/blog/:slug', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
