/**
 * Application Configuration
 * Centralized configuration for app URLs and environment detection
 */

/**
 * Get the base URL for the application
 * This function handles different deployment environments and ensures
 * the correct domain is used for links and QR codes
 */
export function getAppBaseUrl(): string {
  // In browser environment, we can use window.location
  if (typeof window !== 'undefined') {
    const { protocol, host } = window.location;
    return `${protocol}//${host}`;
  }

  // Server-side: Check environment variables in order of priority
  // Skip localhost URLs in production environment
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl !== 'http://localhost:3000' && !envUrl.includes('localhost')) {
    return envUrl;
  }

  // Check for Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Check for Cloudflare Pages
  if (process.env.CF_PAGES_URL) {
    return process.env.CF_PAGES_URL;
  }

  // Check for Railway deployment
  if (process.env.RAILWAY_STATIC_URL) {
    return process.env.RAILWAY_STATIC_URL;
  }

  // Check for Netlify deployment
  if (process.env.NETLIFY_URL) {
    return process.env.NETLIFY_URL;
  }

  // Production fallback - use your actual domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://hafiportrait.photography'; // Current production domain
  }

  // Development fallback - use environment variable or localhost
  return process.env.DSLR_API_BASE_URL || 'http://localhost:3000';
}

/**
 * Generate event URL with access code
 */
export function generateEventUrl(eventId: string, accessCode: string): string {
  const baseUrl = getAppBaseUrl();
  return `${baseUrl}/event/${eventId}?code=${accessCode}`;
}

/**
 * Check if we're in production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Get the current environment name
 */
export function getEnvironment(): string {
  if (process.env.VERCEL) return 'vercel';
  if (process.env.CF_PAGES) return 'cloudflare-pages';
  if (process.env.RAILWAY_ENVIRONMENT) return 'railway';
  if (process.env.NETLIFY) return 'netlify';
  if (process.env.NODE_ENV === 'production') return 'production';
  return 'development';
}