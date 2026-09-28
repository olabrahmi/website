import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/blog/:slug', destination: '/blog', permanent: false },
    ];
  },
};

export default nextConfig;
