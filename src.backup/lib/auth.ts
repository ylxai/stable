/**
 * Authentication Utilities
 * HafiPortrait Admin Authentication System
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'hafiportrait-secret-key-change-in-production';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  id: string;
  user_id: number;
  expires_at: string;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(userId: number, username: string): string {
  return jwt.sign(
    { userId, username },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.userId, username: decoded.username };
  } catch (error) {
    return null;
  }
}

/**
 * Create admin users with hashed passwords
 */
export async function createDefaultAdminUsers(): Promise<void> {
  const defaultUsers = [
    {
      username: 'hafi',
      password: 'Hantu@112233',
      email: 'hafi@hafiportrait.com',
      full_name: 'Hafi Portrait'
    },
    {
      username: 'nandika',
      password: 'Hantu@112233',
      email: 'nandika@hafiportrait.com',
      full_name: 'Nandika'
    }
  ];

  for (const user of defaultUsers) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('username', user.username)
        .single();

      if (!existingUser) {
        const hashedPassword = await hashPassword(user.password);
        
        const { error } = await supabaseAdmin
          .from('admin_users')
          .insert({
            username: user.username,
            password_hash: hashedPassword,
            email: user.email,
            full_name: user.full_name,
            role: 'superadmin'
          });

        if (error) {
          console.error(`Error creating user ${user.username}:`, error);
        } else {
          console.log(`✅ Created superadmin user: ${user.username}`);
        }
      } else {
        console.log(`ℹ️ User ${user.username} already exists`);
      }
    } catch (error) {
      console.error(`Error processing user ${user.username}:`, error);
    }
  }
}

/**
 * Authenticate user with username and password
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AdminUser | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', credentials.username)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return null;
    }

    const isValidPassword = await verifyPassword(credentials.password, user.password_hash);
    if (!isValidPassword) {
      return null;
    }

    // Update last login
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Create session for authenticated user
 */
export async function createSession(
  userId: number, 
  ipAddress?: string, 
  userAgent?: string
): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();

  const { error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({
      id: sessionId,
      user_id: userId,
      expires_at: expiresAt,
      ip_address: ipAddress,
      user_agent: userAgent
    });

  if (error) {
    throw new Error('Failed to create session');
  }

  return sessionId;
}

/**
 * Validate session
 */
export async function validateSession(sessionId: string): Promise<AdminUser | null> {
  try {
    const { data: session, error } = await supabaseAdmin
      .from('admin_sessions')
      .select(`
        *,
        admin_users (
          id, username, email, full_name, role, is_active, last_login, created_at
        )
      `)
      .eq('id', sessionId)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !session || !session.admin_users) {
      return null;
    }

    return session.admin_users as AdminUser;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

/**
 * Destroy session (logout)
 */
export async function destroySession(sessionId: string): Promise<void> {
  await supabaseAdmin
    .from('admin_sessions')
    .delete()
    .eq('id', sessionId);
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions(): Promise<void> {
  await supabaseAdmin
    .from('admin_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());
}

/**
 * Log admin activity
 */
export async function logActivity(
  userId: number,
  action: string,
  resource?: string,
  resourceId?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await supabaseAdmin
      .from('admin_activity_logs')
      .insert({
        user_id: userId,
        action,
        resource,
        resource_id: resourceId,
        details,
        ip_address: ipAddress,
        user_agent: userAgent
      });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}

/**
 * Generate secure session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<AdminUser | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, email, full_name, role, is_active, last_login, created_at')
      .eq('id', userId)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Check if user has permission
 */
export function hasPermission(user: AdminUser, permission: string): boolean {
  // Superadmin has all permissions
  if (user.role === 'superadmin') {
    return true;
  }

  // Add more role-based permissions here if needed
  return false;
}

/**
 * Initialize authentication system
 */
export async function initializeAuth(): Promise<void> {
  try {
    console.log('🔐 Initializing authentication system...');
    
    // Create default admin users
    await createDefaultAdminUsers();
    
    // Clean up expired sessions
    await cleanupExpiredSessions();
    
    console.log('✅ Authentication system initialized');
  } catch (error) {
    console.error('❌ Failed to initialize authentication:', error);
  }
}