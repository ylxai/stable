'use client';

/**
 * Backup Status Monitor Component
 * Provides global overview of all backup operations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Trash2,
  Activity
} from 'lucide-react';

interface BackupSummary {
  totalBackups: number;
  activeBackups: number;
  completedBackups: number;
  failedBackups: number;
  totalPhotosBackedUp: number;
  totalPhotosFailed: number;
}

interface BackupStatus {
  backupId: string;
  eventId: string;
  status: 'initializing' | 'backing_up' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  totalPhotos: number;
  processedPhotos: number;
  successfulUploads: number;
  failedUploads: number;
  googleDriveFolderUrl?: string;
  duration?: number;
}

export function BackupStatusMonitor() {
  const [summary, setSummary] = useState<BackupSummary | null>(null);
  const [recentBackups, setRecentBackups] = useState<BackupStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load backup status
  const loadBackupStatus = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/backup/status');
      const result = await response.json();
      
      if (result.success) {
        setSummary(result.data.summary);
        setRecentBackups(result.data.recentBackups);
      } else {
        throw new Error(result.message || 'Failed to load backup status');
      }
    } catch (error: any) {
      setError(`Failed to load backup status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh every 5 seconds if there are active backups
  useEffect(() => {
    loadBackupStatus();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        if (summary?.activeBackups && summary.activeBackups > 0) {
          loadBackupStatus();
        }
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, summary?.activeBackups]);

  // Clean up old backup statuses
  const cleanupOldBackups = async (maxAge: number = 7) => {
    try {
      const response = await fetch(`/api/admin/backup/status?maxAge=${maxAge}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      if (result.success) {
        await loadBackupStatus(); // Refresh after cleanup
      }
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'backing_up':
      case 'initializing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'completed': 'default',
      'failed': 'destructive',
      'backing_up': 'secondary',
      'initializing': 'secondary'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const calculateProgress = (backup: BackupStatus) => {
    if (backup.totalPhotos === 0) return 0;
    return Math.round((backup.processedPhotos / backup.totalPhotos) * 100);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading backup status...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards - Mobile Optimized */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Backups</p>
                  <p className="text-xl sm:text-2xl font-bold">{summary.totalBackups}</p>
                </div>
                <Database className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Active</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{summary.activeBackups}</p>
                </div>
                <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Completed</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{summary.completedBackups}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Failed</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{summary.failedBackups}</p>
                </div>
                <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Recent Backups - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Database className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Recent Backup Operations</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Monitor ongoing and recent backup operations
              </CardDescription>
            </div>
            
            {/* Mobile-Optimized Controls */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
              {/* Mobile: Stacked buttons */}
              <div className="flex gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="flex-1 text-xs"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto: {autoRefresh ? 'ON' : 'OFF'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadBackupStatus()}
                  className="flex-1 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
              <div className="flex gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cleanupOldBackups()}
                  className="flex-1 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Cleanup
                </Button>
              </div>
              
              {/* Desktop: Horizontal buttons */}
              <div className="hidden sm:flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className="text-xs"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadBackupStatus()}
                  className="text-xs"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => cleanupOldBackups()}
                  className="text-xs"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Cleanup
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-6">
          {recentBackups.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Database className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No backup operations found</p>
              <p className="text-xs sm:text-sm mt-1">Start a backup from the event management page</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {recentBackups.map((backup) => (
                <div key={backup.backupId} className="border rounded-lg p-3 sm:p-4 space-y-3 hover:shadow-sm transition-shadow">
                  {/* Header - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0 flex-1">
                      <span className="font-medium text-sm sm:text-base truncate">Event: {backup.eventId}</span>
                      {getStatusBadge(backup.status)}
                    </div>
                    
                    {/* Actions - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2">
                      {backup.googleDriveFolderUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(backup.googleDriveFolderUrl, '_blank')}
                          className="w-full sm:w-auto text-xs"
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Google Drive
                        </Button>
                      )}
                      <span className="text-xs sm:text-sm text-gray-500 self-start sm:self-center">
                        {new Date(backup.startTime).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar - Mobile Optimized */}
                  {backup.status === 'backing_up' && (
                    <div className="space-y-2">
                      <Progress value={calculateProgress(backup)} className="w-full h-2 sm:h-3" />
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                        <span>{backup.processedPhotos} / {backup.totalPhotos} photos</span>
                        <span className="font-medium">{calculateProgress(backup)}% complete</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Completed Status - Mobile Optimized */}
                  {backup.status === 'completed' && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                        <span className="text-green-600 font-medium">
                          ✅ {backup.successfulUploads} photos backed up
                        </span>
                        {backup.failedUploads > 0 && (
                          <span className="text-orange-600">
                            ⚠️ {backup.failedUploads} failed
                          </span>
                        )}
                      </div>
                      {backup.duration && (
                        <span className="text-gray-500 text-xs">
                          Duration: {formatDuration(backup.duration)}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Failed Status - Mobile Optimized */}
                  {backup.status === 'failed' && (
                    <div className="text-xs sm:text-sm text-red-600 font-medium">
                      ❌ Backup failed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics - Mobile Optimized */}
      {summary && summary.totalPhotosBackedUp > 0 && (
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              📊 Backup Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                <p className="text-xl sm:text-2xl font-bold text-green-600">{summary.totalPhotosBackedUp}</p>
                <p className="text-xs sm:text-sm text-green-700 font-medium mt-1">Total Photos Backed Up</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                <p className="text-xl sm:text-2xl font-bold text-red-600">{summary.totalPhotosFailed}</p>
                <p className="text-xs sm:text-sm text-red-700 font-medium mt-1">Total Photos Failed</p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {summary.totalPhotosBackedUp > 0 
                    ? Math.round((summary.totalPhotosBackedUp / (summary.totalPhotosBackedUp + summary.totalPhotosFailed)) * 100)
                    : 0}%
                </p>
                <p className="text-xs sm:text-sm text-blue-700 font-medium mt-1">Success Rate</p>
              </div>
            </div>
            
            {/* Mobile: Additional Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border sm:hidden">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2">💾 Free Storage Used</p>
                <div className="flex justify-center gap-4 text-xs">
                  <span className="text-blue-600 font-medium">Google Drive: 15GB+</span>
                  <span className="text-green-600 font-medium">Cloudflare R2: 10GB</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}