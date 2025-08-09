'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellRing, 
  BellOff,
  Send, 
  Users, 
  Settings, 
  History,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Edit,
  Plus,
  Filter,
  Download,
  Upload as UploadIcon
} from 'lucide-react';

interface NotificationSettings {
  uploadSuccess: boolean;
  uploadFailed: boolean;
  cameraDisconnected: boolean;
  storageWarning: boolean;
  eventMilestone: boolean;
  clientNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationTemplate {
  id: string;
  type: 'upload_success' | 'upload_failed' | 'camera_disconnected' | 'storage_warning' | 'event_milestone';
  title: string;
  message: string;
  isActive: boolean;
}

interface NotificationHistory {
  id: string;
  type: string;
  title: string;
  message: string;
  recipients: number;
  sentAt: string;
  deliveryRate: number;
  openRate: number;
  status: 'sent' | 'failed' | 'pending';
}

interface Subscriber {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'photographer' | 'client' | 'guest';
  isActive: boolean;
  subscribedAt: string;
  lastSeen: string;
}

export default function NotificationManager() {
  const [activeTab, setActiveTab] = useState<'settings' | 'templates' | 'history' | 'subscribers'>('settings');
  
  const [settings, setSettings] = useState<NotificationSettings>({
    uploadSuccess: true,
    uploadFailed: true,
    cameraDisconnected: true,
    storageWarning: true,
    eventMilestone: true,
    clientNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      type: 'upload_success',
      title: '📸 Foto Baru Diupload',
      message: '{count} foto baru berhasil diupload ke album {albumName}',
      isActive: true
    },
    {
      id: '2',
      type: 'upload_failed',
      title: '❌ Upload Gagal',
      message: 'Upload foto {fileName} gagal. Silakan cek koneksi internet.',
      isActive: true
    },
    {
      id: '3',
      type: 'camera_disconnected',
      title: '📷 Kamera Terputus',
      message: 'Koneksi kamera DSLR terputus. Silakan cek kabel USB.',
      isActive: true
    },
    {
      id: '4',
      type: 'storage_warning',
      title: '💾 Storage Hampir Penuh',
      message: 'Storage tersisa {percentage}%. Silakan backup foto lama.',
      isActive: true
    },
    {
      id: '5',
      type: 'event_milestone',
      title: '🎉 Milestone Event',
      message: '{count} foto telah diupload untuk event {eventName}!',
      isActive: true
    }
  ]);

  const [history, setHistory] = useState<NotificationHistory[]>([
    {
      id: '1',
      type: 'upload_success',
      title: '📸 Foto Baru Diupload',
      message: '5 foto baru berhasil diupload ke album Official',
      recipients: 25,
      sentAt: new Date().toISOString(),
      deliveryRate: 98,
      openRate: 75,
      status: 'sent'
    },
    {
      id: '2',
      type: 'event_milestone',
      title: '🎉 Milestone Event',
      message: '100 foto telah diupload untuk event Wedding Sarah & John!',
      recipients: 45,
      sentAt: new Date(Date.now() - 3600000).toISOString(),
      deliveryRate: 100,
      openRate: 85,
      status: 'sent'
    }
  ]);

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: '1',
      email: 'photographer@hafiportrait.com',
      name: 'Official Photographer',
      role: 'photographer',
      isActive: true,
      subscribedAt: '2024-01-15T10:00:00Z',
      lastSeen: new Date().toISOString()
    },
    {
      id: '2',
      email: 'admin@hafiportrait.com',
      name: 'Admin',
      role: 'admin',
      isActive: true,
      subscribedAt: '2024-01-15T10:00:00Z',
      lastSeen: new Date().toISOString()
    }
  ]);

  const [stats, setStats] = useState({
    totalSent: 1247,
    deliveryRate: 98.5,
    openRate: 76.3,
    activeSubscribers: 156
  });

  const handleSettingsUpdate = () => {
    // API call to update settings
    console.log('Settings updated:', settings);
  };

  const handleSendTestNotification = () => {
    // Send test notification
    console.log('Sending test notification...');
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'photographer': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      case 'guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mobile-spacing">
      {/* Header */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <div>
            <h2 className="mobile-card-title flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Manager
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Kelola notifikasi real-time untuk upload dan event
            </p>
          </div>
          
          <button 
            onClick={handleSendTestNotification}
            className="mobile-btn mobile-btn-primary touch-feedback"
          >
            <Send className="h-4 w-4 mr-1" />
            Test
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Total Sent</span>
            <Send className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>
        </div>

        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Delivery Rate</span>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>

        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Open Rate</span>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-2xl font-bold">{stats.openRate}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
        </div>

        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Subscribers</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-2xl font-bold">{stats.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mobile-tabs-container">
        <div className="mobile-tabs-list">
          <button
            onClick={() => setActiveTab('settings')}
            className={`mobile-tab ${activeTab === 'settings' ? 'data-[state=active]:bg-background data-[state=active]:text-foreground' : ''}`}
          >
            <Settings className="tab-icon" />
            <span className="tab-label">Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`mobile-tab ${activeTab === 'templates' ? 'data-[state=active]:bg-background data-[state=active]:text-foreground' : ''}`}
          >
            <Edit className="tab-icon" />
            <span className="tab-label">Templates</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`mobile-tab ${activeTab === 'history' ? 'data-[state=active]:bg-background data-[state=active]:text-foreground' : ''}`}
          >
            <History className="tab-icon" />
            <span className="tab-label">History</span>
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`mobile-tab ${activeTab === 'subscribers' ? 'data-[state=active]:bg-background data-[state=active]:text-foreground' : ''}`}
          >
            <Users className="tab-icon" />
            <span className="tab-label">Subscribers</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'settings' && (
        <div className="mobile-spacing slide-up">
          <div className="mobile-card">
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">Notification Settings</h3>
            </div>
            <div className="mobile-card-content mobile-spacing">
              
              {/* Upload Notifications */}
              <div>
                <h4 className="font-medium mb-3">Upload Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mobile-label">Upload Success</label>
                      <p className="text-xs text-muted-foreground">Notifikasi saat foto berhasil diupload</p>
                    </div>
                    <Switch
                      checked={settings.uploadSuccess}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, uploadSuccess: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mobile-label">Upload Failed</label>
                      <p className="text-xs text-muted-foreground">Notifikasi saat upload gagal</p>
                    </div>
                    <Switch
                      checked={settings.uploadFailed}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, uploadFailed: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* System Notifications */}
              <div>
                <h4 className="font-medium mb-3">System Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mobile-label">Camera Disconnected</label>
                      <p className="text-xs text-muted-foreground">Alert saat kamera terputus</p>
                    </div>
                    <Switch
                      checked={settings.cameraDisconnected}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, cameraDisconnected: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mobile-label">Storage Warning</label>
                      <p className="text-xs text-muted-foreground">Peringatan storage hampir penuh</p>
                    </div>
                    <Switch
                      checked={settings.storageWarning}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, storageWarning: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Audio & Haptic */}
              <div>
                <h4 className="font-medium mb-3">Audio & Haptic</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mobile-label">Sound Enabled</label>
                      <p className="text-xs text-muted-foreground">Suara notifikasi</p>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, soundEnabled: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mobile-label">Vibration</label>
                      <p className="text-xs text-muted-foreground">Getaran untuk mobile</p>
                    </div>
                    <Switch
                      checked={settings.vibrationEnabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, vibrationEnabled: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Quiet Hours */}
              <div>
                <h4 className="font-medium mb-3">Quiet Hours</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="mobile-label">Enable Quiet Hours</label>
                      <p className="text-xs text-muted-foreground">Nonaktifkan notifikasi pada jam tertentu</p>
                    </div>
                    <Switch
                      checked={settings.quietHours.enabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, enabled: checked }
                        }))
                      }
                    />
                  </div>
                  
                  {settings.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="mobile-form-group">
                        <label className="mobile-label">Start Time</label>
                        <input
                          type="time"
                          className="mobile-input"
                          value={settings.quietHours.start}
                          onChange={(e) => 
                            setSettings(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, start: e.target.value }
                            }))
                          }
                        />
                      </div>
                      <div className="mobile-form-group">
                        <label className="mobile-label">End Time</label>
                        <input
                          type="time"
                          className="mobile-input"
                          value={settings.quietHours.end}
                          onChange={(e) => 
                            setSettings(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, end: e.target.value }
                            }))
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSettingsUpdate}
                className="mobile-btn mobile-btn-primary touch-feedback w-full"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="mobile-spacing slide-up">
          <div className="mobile-card">
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">Notification Templates</h3>
              <button className="mobile-btn mobile-btn-primary touch-feedback">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            <div className="mobile-card-content">
              <div className="mobile-spacing">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-sm font-medium">{template.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted rounded touch-feedback">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded touch-feedback">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium">{template.title}</p>
                      <p className="text-sm text-muted-foreground">{template.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="mobile-spacing slide-up">
          <div className="mobile-card">
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">Notification History</h3>
              <div className="flex items-center gap-2">
                <button className="mobile-btn mobile-btn-secondary touch-feedback">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </button>
                <button className="mobile-btn mobile-btn-secondary touch-feedback">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
            <div className="mobile-card-content">
              <div className="mobile-spacing">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(item.sentAt)}
                          </span>
                        </div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{item.message}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm font-medium">{item.recipients}</p>
                        <p className="text-xs text-muted-foreground">Recipients</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.deliveryRate}%</p>
                        <p className="text-xs text-muted-foreground">Delivered</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.openRate}%</p>
                        <p className="text-xs text-muted-foreground">Opened</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="mobile-spacing slide-up">
          <div className="mobile-card">
            <div className="mobile-card-header">
              <h3 className="mobile-card-title">Subscribers</h3>
              <button className="mobile-btn mobile-btn-primary touch-feedback">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            <div className="mobile-card-content">
              <div className="mobile-spacing">
                {subscribers.map((subscriber) => (
                  <div key={subscriber.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{subscriber.name}</p>
                          <Badge variant={subscriber.isActive ? 'default' : 'secondary'}>
                            {subscriber.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{subscriber.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(subscriber.role)}`}>
                            {subscriber.role}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Last seen: {formatDateTime(subscriber.lastSeen)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted rounded touch-feedback">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded touch-feedback">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}