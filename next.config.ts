import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for Vercel deployment
  // output: 'standalone',
  
  // Disable experimental features to avoid warnings
  experimental: {
    typedRoutes: false,
  },
  
  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression and performance
  compress: true,
  
  // PWA-ready configuration
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
