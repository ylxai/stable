/**
 * Admin Logout API Endpoint
 * POST /api/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { destroySession, logActivity, validateSession } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('admin_session')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    // Get user info before destroying session
    const user = await validateSession(sessionId);
    
    // Destroy session
    await destroySession(sessionId);

    // Log logout activity
    if (user) {
      const ipAddress = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      await logActivity(
        user.id,
        'logout',
        'auth',
        user.username,
        { ip_address: ipAddress },
        ipAddress,
        userAgent
      );
    }

    // Clear session cookie
    cookieStore.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}