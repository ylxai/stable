/**
 * Authentication Hook
 * Manages authentication state and provides auth functions
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  last_login: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  const router = useRouter();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Force localhost URL for development
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setState(prev => ({
          ...prev,
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check authentication status',
      }));
    }
  }, []);

  // Login function
  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Force localhost URL for development
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setState(prev => ({
          ...prev,
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: data.error || 'Login failed',
          isLoading: false,
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Network error. Please try again.',
        isLoading: false,
      }));
      return false;
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Force localhost URL for development
      const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
      await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      router.push('/admin/login');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Logout failed',
        isLoading: false,
      }));
    }
  }, [router]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    ...state,
    login,
    logout,
    checkAuth,
    clearError,
  };
}

/**
 * Hook for checking if user has specific permission
 */
export function usePermission(permission: string): boolean {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return false;
  }

  // Superadmin has all permissions
  if (user.role === 'superadmin') {
    return true;
  }

  // Add more role-based permission logic here
  return false;
}

/**
 * Hook for protecting components that require authentication
 */
export function useRequireAuth(): AuthState & AuthActions {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/admin/login');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}