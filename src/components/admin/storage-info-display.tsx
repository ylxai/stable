'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, HardDrive, Cloud, Database } from 'lucide-react';

interface StorageInfo {
  cloudflareR2: {
    name: string;
    used: string;
    available: string;
    total: string;
    usagePercentage: number;
    status: string;
    color: string;
  };
  googleDrive: {
    name: string;
    used: string;
    available: string;
    total: string;
    usagePercentage: number;
    status: string;
    color: string;
  };
  summary: {
    totalUsed: string;
    totalAvailable: string;
    overallUsage: number;
  };
}

export default function StorageInfoDisplay() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStorageInfo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/storage/info');
      const result = await response.json();
      
      if (result.success) {
        setStorageInfo(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch storage info');
      }
    } catch (error: any) {
      setError(error.message);
      console.error('Failed to fetch storage info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm">
        <div className="bg-white/80 rounded-lg px-3 py-2 text-center animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white/80 rounded-lg px-3 py-2 text-center animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !storageInfo) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm">
        <div className="bg-white/80 rounded-lg px-3 py-2 text-center">
          <div className="font-semibold text-green-600">15GB+</div>
          <div className="text-gray-600">Google Drive</div>
        </div>
        <div className="bg-white/80 rounded-lg px-3 py-2 text-center">
          <div className="font-semibold text-blue-600">10GB</div>
          <div className="text-gray-600">Cloudflare R2</div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'warning': return '⚠️';
      case 'notice': return '📊';
      default: return '✅';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 text-xs sm:text-sm">
      {/* Google Drive */}
      <div className="bg-white/80 rounded-lg px-3 py-2 text-center relative group">
        <div className={`font-semibold ${storageInfo.googleDrive.color}`}>
          {storageInfo.googleDrive.used}
        </div>
        <div className="text-gray-600">Google Drive</div>
        <div className="text-xs text-gray-500 mt-1">
          {getStatusIcon(storageInfo.googleDrive.status)} {storageInfo.googleDrive.usagePercentage}%
        </div>
        
        {/* Progress bar on hover */}
        <div className="absolute inset-0 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-full px-2">
            <Progress value={storageInfo.googleDrive.usagePercentage} className="h-1 mb-1" />
            <div className="text-xs text-gray-600">
              {storageInfo.googleDrive.used} / {storageInfo.googleDrive.total}
            </div>
          </div>
        </div>
      </div>

      {/* Cloudflare R2 */}
      <div className="bg-white/80 rounded-lg px-3 py-2 text-center relative group">
        <div className={`font-semibold ${storageInfo.cloudflareR2.color}`}>
          {storageInfo.cloudflareR2.used}
        </div>
        <div className="text-gray-600">Cloudflare R2</div>
        <div className="text-xs text-gray-500 mt-1">
          {getStatusIcon(storageInfo.cloudflareR2.status)} {storageInfo.cloudflareR2.usagePercentage}%
        </div>
        
        {/* Progress bar on hover */}
        <div className="absolute inset-0 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="w-full px-2">
            <Progress value={storageInfo.cloudflareR2.usagePercentage} className="h-1 mb-1" />
            <div className="text-xs text-gray-600">
              {storageInfo.cloudflareR2.used} / {storageInfo.cloudflareR2.total}
            </div>
          </div>
        </div>
      </div>

      {/* Refresh button */}
      <button
        onClick={fetchStorageInfo}
        className="bg-white/80 rounded-lg px-2 py-2 text-center hover:bg-white transition-colors duration-200"
        title="Refresh storage info"
      >
        <RefreshCw className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}