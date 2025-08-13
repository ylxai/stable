/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  webpack: (config) => {
    // Prefer webpack alias from tsconfig paths too (safety)
    // Note: We already set '@' above, keeping consistent

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // CloudRun configuration
  images: {
    domains: ['localhost', 'api.qrserver.com', 'azspktldiblhrwebzmwq.supabase.co', 'bwpwwtphgute.ap-southeast-1.clawcloudrun.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Updated external packages configuration
  serverExternalPackages: ['@neondatabase/serverless'],
  // Updated Turbopack configuration
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    }
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // CloudRun optimizations
  poweredByHeader: false,
  compress: true,
  // Custom server configuration for CloudRun
  async rewrites() {
    return [
      {
        source: '/health',
        destination: '/api/test/db',
      },
    ];
  },
}

module.exports = {
  ...nextConfig,
  allowedDevOrigins: [
    // Development origins
    'localhost',
    '127.0.0.1',
    'local-origin.dev', 
    '*.local-origin.dev',
    
    // CloudRun development
    'bwpwwtphgute.ap-southeast-1.clawcloudrun.com',
    '*.ap-southeast-1.clawcloudrun.com',
    '*.clawcloudrun.com',
    
    // Vercel staging
    'hafiportrait-staging.vercel.app',
    '*.vercel.app',
    
    // Production domain
    'hafiportrait.photography',
    '*.hafiportrait.photography',
    
    // Supabase domains
    'azspktldiblhrwebzmwq.supabase.co',
    '*.supabase.co',
    
    // Cloudflare R2 domains
    'photos.hafiportrait.photography',
    '*.r2.cloudflarestorage.com',
    
    // Allow all for development flexibility
    '*'
  ],
}
