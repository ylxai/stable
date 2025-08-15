/**
 * Admin Dashboard with Grouped Tabs
 * Mobile-friendly navigation with organized sections
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRequireAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Calendar, 
  Camera, 
  Settings, 
  Bell, 
  Palette,
  Plus,
  Upload,
  TrendingUp,
  Users,
  Activity,
  Monitor,
  Image,
  FolderOpen,
  Trash,
  Play,
  GripVertical,
  Star,
  Crown,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";

// Import only essential components
import { ColorPaletteProvider } from "@/components/ui/color-palette-provider";
import NotificationBell from "@/components/ui/notification-bell";
import StorageInfoDisplay from "@/components/admin/storage-info-display";

// Loading Component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    </div>
  );
}

// Error Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'An unexpected error occurred while loading the admin dashboard.'}
        </p>
        <div className="space-y-2">
          <Button onClick={resetErrorBoundary} className="w-full">
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/admin/login'} 
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Admin Dashboard Component
function AdminDashboardContent() {
  const auth = useRequireAuth();
  const queryClient = useQueryClient();
  
  // Show loading while auth is checking
  if (auth.isLoading) {
    return <LoadingFallback />;
  }

  // Show error if auth failed
  if (auth.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{auth.error}</p>
          <Button onClick={() => window.location.href = '/admin/login'} className="w-full">
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated yet
  if (!auth.isAuthenticated) {
    return <LoadingFallback />;
  }

  // Basic state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('overview');

  // Fetch admin stats with error handling
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/admin/stats");
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error('Stats fetch error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    retry: 2,
  });

  // Show error if data fetching failed
  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Loading Error</h2>
          <p className="text-gray-600 mb-4">
            {statsError.message || 'Failed to load dashboard data'}
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ColorPaletteProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Camera className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">HafiPortrait Admin</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <NotificationBell className="mobile-optimized" />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome,</span>
                  <span className="text-sm font-medium text-gray-900">
                    {auth.user?.username || 'Admin'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={auth.logout}
                  className="text-sm"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tab Navigation */}
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Photos</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? '...' : stats?.totalEvents || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
                    <Image className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? '...' : stats?.totalPhotos || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? '...' : stats?.totalMessages || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">System Status</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {statsLoading ? '...' : 'Online'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Storage Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Storage Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StorageInfoDisplay />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Event Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Event management features will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Photo Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Photo management features will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">System settings will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ColorPaletteProvider>
  );
}

// Error Boundary Component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      event.preventDefault();
      console.error('Error caught by boundary:', event.error);
      setError(event.error);
    };

    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      console.error('Unhandled promise rejection:', event.reason);
      setError(new Error(event.reason?.message || 'Unhandled promise rejection'));
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
    };
  }, []);

  if (error) {
    return (
      <ErrorFallback error={error} resetErrorBoundary={() => setError(null)} />
    );
  }

  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
}

export default function AdminDashboardGrouped() {
  return (
    <ErrorBoundary>
      <AdminDashboardContent />
    </ErrorBoundary>
  );
}