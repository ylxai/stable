/**
 * Admin Login API Endpoint
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession, logActivity } from '@/lib/auth';
import { cookies } from 'next/headers';
import { corsResponse, corsErrorResponse, handleOptions } from '@/lib/cors';

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return corsErrorResponse('Username and password are required', 400);
    }

    // Get client info
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Authenticate user
    const user = await authenticateUser({ username, password });
    
    if (!user) {
      // Log failed login attempt
      await logActivity(
        0, // No user ID for failed attempts
        'login_failed',
        'auth',
        username,
        { reason: 'invalid_credentials' },
        ipAddress,
        userAgent
      );

      return corsErrorResponse('Invalid username or password', 401);
    }

    // Create session
    const sessionId = await createSession(user.id, ipAddress, userAgent);

    // Log successful login
    await logActivity(
      user.id,
      'login_success',
      'auth',
      user.username,
      { ip_address: ipAddress },
      ipAddress,
      userAgent
    );

    // Set session cookie
    const cookieStore = cookies();
    cookieStore.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    // Return user data (without sensitive info)
    return corsResponse({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return corsErrorResponse('Internal server error', 500);
  }
}