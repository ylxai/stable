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
  swcMinify: true,
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
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
    turbo: {
      resolveAlias: {
        '@': path.resolve(__dirname, 'src'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/lib': path.resolve(__dirname, 'src/lib'),
        '@/hooks': path.resolve(__dirname, 'src/hooks'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@shared': path.resolve(__dirname, 'src/shared'),
      }
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

//module.exports = nextConfig
module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}
