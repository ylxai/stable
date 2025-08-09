/**
 * Admin Login Page
 * /admin/login
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, User, Camera } from 'lucide-react';
import { ColorPaletteProvider } from '@/components/ui/color-palette-provider';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  // Note: Removed auth check to prevent 401 console errors on login page
  // Authentication will be handled by middleware and useRequireAuth hook

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Smart URL detection for different environments
      const baseUrl = (() => {
        if (typeof window !== 'undefined') {
          return window.location.origin;
        }
        // Server-side fallback
        if (process.env.NODE_ENV === 'production') {
          return process.env.NEXT_PUBLIC_APP_URL || 'https://hafiportrait.photography';
        }
        return process.env.DSLR_API_BASE_URL || 'http://localhost:3000';
      })();
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
        // Login successful
        router.replace(redirectTo);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <ColorPaletteProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-dynamic-primary rounded-full p-3">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">HafiPortrait</h1>
            <p className="text-gray-600">Admin Dashboard Login</p>
          </div>

          {/* Login Form */}
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Welcome Back
              </CardTitle>
              <p className="text-center text-gray-600">
                Sign in to your admin account
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-dynamic-primary focus:ring-dynamic-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me for 30 days
                  </Label>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-dynamic-primary hover:bg-dynamic-primary/90 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>


              {/* Security Notice */}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Your session is secured with industry-standard encryption
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 HafiPortrait. All rights reserved.</p>
            <p className="mt-1">Professional Photography Services</p>
          </div>
        </div>
      </div>
    </ColorPaletteProvider>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}