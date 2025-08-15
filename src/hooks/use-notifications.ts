/**
 * React Hook for Notification Management
 * Provides easy access to notification features and real-time updates
 */

import { useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'upload_success' | 'upload_failed' | 'camera_disconnected' | 'storage_warning' | 'event_milestone' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'upload' | 'system' | 'event' | 'user';
  metadata?: {
    fileName?: string;
    eventName?: string;
    count?: number;
    percentage?: number;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hafiportrait-notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotifications(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load notifications from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('hafiportrait-notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error('Failed to save notifications to localStorage:', error);
      }
    }
  }, [notifications, isLoading]);

  // Listen for real-time events
  useEffect(() => {
    const handleAdminUpload = (event: CustomEvent) => {
      const { type, data } = event.detail;
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: type,
        title: getNotificationTitle(type),
        message: data.message || `${data.fileName || 'File'} berhasil diupload`,
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: getNotificationPriority(type),
        category: getNotificationCategory(type),
        metadata: {
          fileName: data.fileName,
          eventName: data.eventName,
          count: data.count,
          percentage: data.percentage
        }
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
      
      // Mobile haptic feedback for high priority notifications
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        if (newNotification.priority === 'high' || newNotification.priority === 'critical') {
          navigator.vibrate([100, 50, 100]); // Pattern: vibrate-pause-vibrate
        } else if (newNotification.priority === 'medium') {
          navigator.vibrate(100); // Single vibration
        }
      }
    };

    const handleDSLRNotification = (event: any) => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: event.type,
        title: getNotificationTitle(event.type),
        message: event.message || event.data?.message || 'New notification',
        timestamp: new Date().toISOString(),
        isRead: false,
        priority: getNotificationPriority(event.type),
        category: getNotificationCategory(event.type),
        metadata: {
          fileName: event.data?.fileName,
          eventName: event.data?.eventName,
          count: event.data?.count,
          percentage: event.data?.percentage
        }
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
    };

    // Listen for events
    if (typeof window !== 'undefined') {
      window.addEventListener('admin-upload-success', handleAdminUpload as EventListener);
      window.addEventListener('admin-upload-failed', handleAdminUpload as EventListener);
      window.addEventListener('dslr-notification', handleDSLRNotification);
      
      return () => {
        window.removeEventListener('admin-upload-success', handleAdminUpload as EventListener);
        window.removeEventListener('admin-upload-failed', handleAdminUpload as EventListener);
        window.removeEventListener('dslr-notification', handleDSLRNotification);
      };
    }
  }, []);

  const getNotificationTitle = (type: string): string => {
    switch (type) {
      case 'upload_success': return '📸 Foto Berhasil Diupload';
      case 'upload_failed': return '❌ Upload Gagal';
      case 'upload_start': return '📤 Memulai Upload';
      case 'camera_connected': return '📷 Kamera Terhubung';
      case 'camera_disconnected': return '📷 Kamera Terputus';
      case 'storage_warning': return '⚠️ Storage Hampir Penuh';
      case 'event_milestone': return '🎉 Milestone Tercapai';
      default: return '📢 Notifikasi Baru';
    }
  };

  const getNotificationPriority = (type: string): 'low' | 'medium' | 'high' | 'critical' => {
    switch (type) {
      case 'upload_failed': 
      case 'camera_disconnected': 
      case 'storage_warning': return 'high';
      case 'upload_success': 
      case 'event_milestone': return 'medium';
      case 'upload_start': 
      case 'camera_connected': return 'low';
      default: return 'medium';
    }
  };

  const getNotificationCategory = (type: string): 'upload' | 'system' | 'event' | 'user' => {
    switch (type) {
      case 'upload_success':
      case 'upload_failed':
      case 'upload_start': return 'upload';
      case 'camera_connected':
      case 'camera_disconnected':
      case 'storage_warning': return 'system';
      case 'event_milestone': return 'event';
      default: return 'user';
    }
  };

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification
  };
}