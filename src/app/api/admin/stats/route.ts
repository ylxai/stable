import { NextResponse } from 'next/server';
import { corsResponse, corsErrorResponse, handleOptions } from '@/lib/cors';

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    console.log('📊 Getting admin stats');
    
    // Import database with error handling
    let database;
    try {
      const { database: db } = await import('@/lib/database');
      database = db;
    } catch (error) {
      console.error('❌ Failed to import database:', error);
      // Return fallback stats
      return corsResponse({
        totalEvents: 0,
        totalPhotos: 0,
        totalMessages: 0,
        recentActivity: [],
        systemStatus: 'operational'
      });
    }

    // Get stats with error handling
    const stats = await database.getStats();
    
    // Add additional stats for admin dashboard
    const adminStats = {
      ...stats,
      recentActivity: [], // Will be populated later
      systemStatus: 'operational',
      lastUpdated: new Date().toISOString()
    };

    return corsResponse(adminStats);
    
  } catch (error: any) {
    console.error('❌ Get stats error:', error);
    
    // Return fallback data instead of error
    const fallbackStats = {
      totalEvents: 0,
      totalPhotos: 0,
      totalMessages: 0,
      recentActivity: [],
      systemStatus: 'degraded',
      lastUpdated: new Date().toISOString(),
      error: error.message
    };
    
    return corsResponse(fallbackStats);
  }
}