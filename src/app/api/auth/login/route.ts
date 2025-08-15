/**
 * Admin Login API Endpoint
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession, logActivity } from '@/lib/auth';
import { cookies } from 'next/headers';
import { corsResponse, corsErrorResponse, handleOptions } from '@/lib/cors';

// Handle OPTIONS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || request.headers.get('referer');
  return handleOptions(origin);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || request.headers.get('referer');
  
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return corsErrorResponse('Method not allowed', 405, origin);
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return corsErrorResponse('Invalid JSON in request body', 400, origin);
    }

    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return corsErrorResponse('Username dan password harus diisi', 400, origin);
    }

    // Validate input length
    if (username.length < 3 || username.length > 50) {
      return corsErrorResponse('Username harus antara 3-50 karakter', 400, origin);
    }

    if (password.length < 6 || password.length > 100) {
      return corsErrorResponse('Password harus antara 6-100 karakter', 400, origin);
    }

    // Get client info
    const ipAddress = request.ip || 
                     request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Rate limiting check (basic implementation)
    const rateLimitKey = `login_attempts:${ipAddress}`;
    // Note: In production, implement proper rate limiting with Redis or similar

    // Authenticate user
    const user = await authenticateUser({ username, password });
    
    if (!user) {
      // Log failed login attempt
      await logActivity(
        0, // No user ID for failed attempts
        'login_failed',
        'auth',
        username,
        { 
          reason: 'invalid_credentials',
          ip_address: ipAddress,
          user_agent: userAgent
        },
        ipAddress,
        userAgent
      );

      return corsErrorResponse('Username atau password salah', 401, origin);
    }

    // Check if user is active
    if (user.status !== 'active') {
      await logActivity(
        user.id,
        'login_failed',
        'auth',
        user.username,
        { 
          reason: 'account_inactive',
          ip_address: ipAddress,
          user_agent: userAgent
        },
        ipAddress,
        userAgent
      );

      return corsErrorResponse('Akun tidak aktif. Silakan hubungi administrator.', 403, origin);
    }

    // Create session
    const sessionId = await createSession(user.id, ipAddress, userAgent);

    if (!sessionId) {
      return corsErrorResponse('Gagal membuat sesi. Silakan coba lagi.', 500, origin);
    }

    // Log successful login
    await logActivity(
      user.id,
      'login_success',
      'auth',
      user.username,
      { 
        ip_address: ipAddress,
        user_agent: userAgent,
        session_id: sessionId
      },
      ipAddress,
      userAgent
    );

    // Set session cookie with enhanced security
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    
    cookieStore.set('admin_session', sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      domain: isProduction ? undefined : undefined, // Let browser set domain
    });

    // Return user data (without sensitive info)
    return corsResponse({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status
      },
      message: 'Login berhasil',
      session: {
        expires_in: 24 * 60 * 60, // 24 hours in seconds
        created_at: new Date().toISOString()
      }
    }, 200, origin);

  } catch (error) {
    console.error('Login API error:', error);
    
    // Log the error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Don't expose internal errors to client
    return corsErrorResponse('Terjadi kesalahan server. Silakan coba lagi nanti.', 500, origin);
  }
}