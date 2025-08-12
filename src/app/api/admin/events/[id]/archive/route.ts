/**
 * API Endpoint for Event Archive Management
 * Handles archiving events after successful backup
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    const body = await request.json();
    const { backupId } = body;
    
    if (!backupId) {
      return NextResponse.json({
        success: false,
        message: 'Backup ID is required for archiving'
      }, { status: 400 });
    }
    
    console.log(`🗄️ Starting archive process for event: ${eventId} with backup: ${backupId}`);
    
    // Import EventStorageManager
    const EventStorageManager = require('@/lib/event-storage-manager');
    const eventStorageManager = new EventStorageManager();
    
    // Archive the event
    const archiveResult = await eventStorageManager.archiveEvent(eventId, backupId);
    
    console.log(`✅ Archive completed for event ${eventId}:`, archiveResult);
    
    return NextResponse.json({
      success: true,
      message: `Event archived successfully`,
      data: archiveResult
    });
    
  } catch (error: any) {
    console.error(`❌ Archive failed for event ${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      message: `Failed to archive event: ${error.message}`,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    // Get event archive status from database
    const { smartDatabase } = await import('@/lib/database-with-smart-storage');
    const event = await smartDatabase.getEventById(eventId);
    
    if (!event) {
      return NextResponse.json({
        success: false,
        message: 'Event not found'
      }, { status: 404 });
    }
    
    const archiveInfo = {
      eventId: event.id,
      isArchived: event.is_archived || false,
      archivedAt: event.archived_at || null,
      backupId: event.backup_id || null,
      googleDriveBackupUrl: event.google_drive_backup_url || null
    };
    
    return NextResponse.json({
      success: true,
      data: archiveInfo
    });
    
  } catch (error: any) {
    console.error(`❌ Failed to get archive status for event ${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      message: `Failed to get archive status: ${error.message}`,
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;
    
    console.log(`🔄 Unarchiving event: ${eventId}`);
    
    // Unarchive the event (remove archive status)
    const { smartDatabase } = await import('@/lib/database-with-smart-storage');
    const updatedEvent = await smartDatabase.updateEvent(eventId, {
      is_archived: false,
      archived_at: null
      // Keep backup_id and google_drive_backup_url for reference
    });
    
    console.log(`✅ Event ${eventId} unarchived successfully`);
    
    return NextResponse.json({
      success: true,
      message: `Event unarchived successfully`,
      data: {
        eventId,
        isArchived: false,
        unarchived: true
      }
    });
    
  } catch (error: any) {
    console.error(`❌ Unarchive failed for event ${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      message: `Failed to unarchive event: ${error.message}`,
      error: error.message
    }, { status: 500 });
  }
}