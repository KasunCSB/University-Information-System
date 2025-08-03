import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone for Vercel deployment
  // output: 'standalone', // Only needed for Docker
  
  // Disable experimental features to avoid warnings
  experimental: {
    typedRoutes: false,
  },
  
  // Image optimization settings
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Compression and performance
  compress: true,
  
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
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
