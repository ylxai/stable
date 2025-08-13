/**
 * API Endpoint for Event Backup Management
 * Handles backup operations for specific events
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;
    const body = await request.json();
    
    console.log(`🎯 Starting backup for event: ${eventId}`);
    
    // Import EventStorageManager
    const EventStorageManager = require('@/lib/event-storage-manager');
    const eventStorageManager = new EventStorageManager();
    
    // Initialize storage manager
    await eventStorageManager.initialize();
    
    // Start backup process
    const backupResult = await eventStorageManager.backupEventToGoogleDrive(eventId, {
      compressionQuality: body.compressionQuality || 0.90,
      includeMetadata: body.includeMetadata !== false
    });
    
    console.log(`✅ Backup completed for event ${eventId}:`, backupResult);
    
    return NextResponse.json({
      success: true,
      message: `Event backup completed successfully`,
      data: backupResult
    });
    
  } catch (error: any) {
    const resolvedParams = await params;
    console.error(`❌ Backup failed for event ${resolvedParams.id}:`, error);
    
    return NextResponse.json({
      success: false,
      message: `Failed to backup event: ${error.message}`,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const eventId = resolvedParams.id;
    const { searchParams } = new URL(request.url);
    const backupId = searchParams.get('backupId');
    
    // Import EventStorageManager
    const EventStorageManager = require('@/lib/event-storage-manager');
    const eventStorageManager = new EventStorageManager();
    
    if (backupId) {
      // Get specific backup status
      const backupStatus = eventStorageManager.getBackupStatus(backupId);
      
      if (!backupStatus) {
        return NextResponse.json({
          success: false,
          message: 'Backup not found'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: true,
        data: backupStatus
      });
    } else {
      // Get all backup statuses for this event
      const allStatuses = eventStorageManager.getAllBackupStatuses();
      const eventBackups = allStatuses.filter(status => status.eventId === eventId);
      
      return NextResponse.json({
        success: true,
        data: eventBackups
      });
    }
    
  } catch (error: any) {
    const resolvedParams = await params;
    console.error(`❌ Failed to get backup status for event ${resolvedParams.id}:`, error);
    
    return NextResponse.json({
      success: false,
      message: `Failed to get backup status: ${error.message}`,
      error: error.message
    }, { status: 500 });
  }
}