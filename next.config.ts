import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize package imports for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      // Local Supabase storage (development)
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/palindromes/**',
      },
      // Add your Supabase project domain here once known (replace PROJECT_REF)
      {
        protocol: 'https',
        hostname: 'qpkldxruujwkzwuykzvf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/palindromes/**',
      },
    ],
  },

  // Basic security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy', 
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
