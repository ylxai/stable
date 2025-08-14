/**
 * Next.js Middleware for Authentication
 * Protects admin routes and handles authentication
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Edge Runtime compatible validation
// import { validateSession } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = ['/admin'];

// Routes that should redirect to admin if already authenticated
const authRoutes = ['/admin/login'];

// Helper function to get base URL for API calls
function getBaseUrl(request: NextRequest): string {
  // For CloudRun and production environments
  if (process.env.NODE_ENV === 'production') {
    // Use the request URL's origin for production
    const url = new URL(request.url);
    return url.origin;
  }
  
  // For development, handle both HTTP and HTTPS
  const url = new URL(request.url);
  if (url.protocol === 'https:' && url.hostname === 'localhost') {
    return `http://${url.host}`;
  }
  
  return url.origin;
}

// Helper function to validate session with timeout and retry
async function validateSessionWithRetry(baseUrl: string, sessionId: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const validateResponse = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          'Cookie': `admin_session=${sessionId}`,
          'User-Agent': 'NextJS-Middleware/1.0',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!validateResponse.ok) {
        throw new Error(`HTTP ${validateResponse.status}`);
      }
      
      const responseData = await validateResponse.json();
      
      if (!responseData.success || !responseData.user) {
        throw new Error('Invalid response structure');
      }
      
      return responseData;
    } catch (error) {
      console.warn(`Session validation attempt ${i + 1} failed:`, error);
      
      if (i === retries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 100));
    }
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionId = request.cookies.get('admin_session')?.value;

  // Block common bot attack patterns FIRST (before any processing)
  const blockedPaths = [
    '/wp-admin', '/wp-login', '/wp-content', '/wp-includes',
    '/xmlrpc.php', '/phpmyadmin', '/phpMyAdmin', '/admin/config.php',
    '/administrator', '/.env', '/.git', '/config.php', '/setup.php', '/install.php'
  ];
  
  const isBlocked = blockedPaths.some(blocked => 
    pathname.startsWith(blocked) || pathname.includes(blocked)
  );
  
  if (isBlocked) {
    // Return 404 immediately without logging
    return new NextResponse(null, { 
      status: 404,
      headers: { 'Cache-Control': 'public, max-age=3600' }
    });
  }

  // Skip middleware for health checks and static assets
  if (pathname.includes('/health') || pathname.includes('/_next/') || pathname.includes('/favicon')) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) && pathname !== '/admin/login'
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing protected route
  if (isProtectedRoute) {
    if (!sessionId) {
      // No session, redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validate session with robust error handling
    try {
      const baseUrl = getBaseUrl(request);
      const responseData = await validateSessionWithRetry(baseUrl, sessionId);
      const user = responseData.user;
      
      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', user.id.toString());
      requestHeaders.set('x-user-username', user.username);
      requestHeaders.set('x-user-role', user.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('Middleware session validation error:', error);
      
      // Clear invalid session and redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }
  }

  // If accessing auth route while already authenticated
  if (isAuthRoute && sessionId) {
    try {
      const baseUrl = getBaseUrl(request);
      await validateSessionWithRetry(baseUrl, sessionId, 1); // Single retry for auth routes
      
      // Already authenticated, redirect to admin dashboard
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch (error) {
      // Continue to login page if validation fails
      console.warn('Auth route validation error:', error);
      
      // Clear invalid session
      const response = NextResponse.next();
      response.cookies.set('admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API routes to avoid infinite loops)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};