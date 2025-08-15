/**
 * API Endpoint for Storage Information
 * Provides real-time storage usage data from Cloudflare R2 and Google Drive
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('💾 Getting storage information');
    
    // Import storage managers
    const SmartStorageManager = require('@/lib/smart-storage-manager');
    const smartStorageManager = new SmartStorageManager();
    
    // Get storage statistics
    const storageStats = await smartStorageManager.getStorageStats();
    
    // Calculate usage percentages
    const cloudflareR2Usage = storageStats.cloudflareR2.used / storageStats.cloudflareR2.available * 100;
    const googleDriveUsage = storageStats.googleDrive.used / storageStats.googleDrive.available * 100;
    
    // Format storage info
    const storageInfo = {
      cloudflareR2: {
        name: 'Cloudflare R2',
        used: formatBytes(storageStats.cloudflareR2.used),
        available: formatBytes(storageStats.cloudflareR2.available),
        total: formatBytes(storageStats.cloudflareR2.available),
        usagePercentage: Math.round(cloudflareR2Usage),
        status: cloudflareR2Usage > 80 ? 'warning' : cloudflareR2Usage > 60 ? 'notice' : 'good',
        color: cloudflareR2Usage > 80 ? 'text-red-600' : cloudflareR2Usage > 60 ? 'text-orange-600' : 'text-blue-600'
      },
      googleDrive: {
        name: 'Google Drive',
        used: formatBytes(storageStats.googleDrive.used),
        available: formatBytes(storageStats.googleDrive.available),
        total: formatBytes(storageStats.googleDrive.available),
        usagePercentage: Math.round(googleDriveUsage),
        status: googleDriveUsage > 80 ? 'warning' : googleDriveUsage > 60 ? 'notice' : 'good',
        color: googleDriveUsage > 80 ? 'text-red-600' : googleDriveUsage > 60 ? 'text-orange-600' : 'text-green-600'
      },
      summary: {
        totalUsed: formatBytes(storageStats.cloudflareR2.used + storageStats.googleDrive.used),
        totalAvailable: formatBytes(storageStats.cloudflareR2.available + storageStats.googleDrive.available),
        overallUsage: Math.round((storageStats.cloudflareR2.used + storageStats.googleDrive.used) / 
                                (storageStats.cloudflareR2.available + storageStats.googleDrive.available) * 100)
      }
    };
    
    return NextResponse.json({
      success: true,
      data: storageInfo
    });
    
  } catch (error: any) {
    console.error('❌ Failed to get storage info:', error);
    
    // Return fallback data if storage managers fail
    const fallbackData = {
      cloudflareR2: {
        name: 'Cloudflare R2',
        used: '0 B',
        available: '10 GB',
        total: '10 GB',
        usagePercentage: 0,
        status: 'good',
        color: 'text-blue-600'
      },
      googleDrive: {
        name: 'Google Drive',
        used: '0 B',
        available: '15 GB',
        total: '15 GB',
        usagePercentage: 0,
        status: 'good',
        color: 'text-green-600'
      },
      summary: {
        totalUsed: '0 B',
        totalAvailable: '25 GB',
        overallUsage: 0
      }
    };
    
    return NextResponse.json({
      success: false,
      message: `Failed to get storage info: ${error.message}`,
      data: fallbackData
    }, { status: 500 });
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}