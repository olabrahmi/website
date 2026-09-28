import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    // Next 16 treats NAT64 addresses (64:ff9b::/96) as private and blocks
    // the optimizer. Storyblok is public; remotePatterns still restrict hosts.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        port: '',
        pathname: '/f/**',
      },
    ],
  },
};

export default nextConfig;
