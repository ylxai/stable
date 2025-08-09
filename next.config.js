/** @type {import('next').NextConfig} */
const nextConfig = {
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
    serverComponentsExternalPackages: ['@neondatabase/serverless']
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

module.exports = nextConfig