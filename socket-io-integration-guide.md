# 🔌 Socket.IO Integration Guide - Correct Configuration

## ✅ **Your Configuration Analysis:**

### **Good Parts:**
```javascript
const socket = io('wss://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com', {
  transports: ['websocket', 'polling'],  // ✅ Correct
  timeout: 10000,                        // ✅ Good timeout
  autoConnect: true,                     // ✅ Auto-connect enabled
  reconnection: true,                    // ✅ Reconnection enabled
  reconnectionAttempts: 5,               // ✅ Reasonable attempts
  reconnectionDelay: 2000                // ✅ Good delay
});
```

### **Issues to Fix:**

#### **1. Protocol Issue:**
```javascript
// ❌ Wrong:
io('wss://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com')

// ✅ Correct:
io('https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com')
```
**Reason**: Socket.IO handles protocol upgrade automatically. Use `https://` not `wss://`

#### **2. Channel System:**
Your server uses **rooms**, not **channels**:

```javascript
// ❌ Your approach:
socket.emit('subscribe', { channel: 'upload_events' });

// ✅ Correct approach:
socket.emit('join-room', 'dslr-monitoring');
socket.emit('join-room', 'backup-status');
socket.emit('join-room', 'admin-notifications');
socket.emit('join-room', 'upload-progress');
```

## 🎯 **Corrected Configuration:**

### **Production-Ready Socket.IO Client:**
```javascript
import { io } from 'socket.io-client';

// Optimized untuk production deployment
const socket = io('https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com', {
  transports: ['websocket', 'polling'],
  timeout: 10000,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,              // Increased for stability
  reconnectionDelay: 1000,               // Faster initial reconnect
  reconnectionDelayMax: 5000,            // Max delay cap
  maxReconnectionAttempts: 10,
  forceNew: false,                       // Reuse connection
  upgrade: true,                         // Allow transport upgrade
  rememberUpgrade: true                  // Remember best transport
});

// Connection event handlers
socket.on('connect', () => {
  console.log('✅ Socket.IO connected:', socket.id);
  console.log('Transport:', socket.io.engine.transport.name);
  
  // Join rooms after connection
  socket.emit('join-room', 'dslr-monitoring');
  socket.emit('join-room', 'backup-status');
  socket.emit('join-room', 'admin-notifications');
  socket.emit('join-room', 'upload-progress');
});

socket.on('connected', (data) => {
  console.log('📡 Server welcome:', data);
});

socket.on('room-joined', (data) => {
  console.log('📍 Joined room:', data);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});

// Real-time event listeners
socket.on('dslr-status-update', (data) => {
  console.log('📸 DSLR update:', data);
  // Handle DSLR status updates
});

socket.on('backup-progress-update', (data) => {
  console.log('💾 Backup progress:', data);
  // Handle backup progress updates
});

socket.on('system-notification', (data) => {
  console.log('🔔 System notification:', data);
  // Handle system notifications
});

socket.on('upload-progress', (data) => {
  console.log('📤 Upload progress:', data);
  // Handle upload progress
});
```

## 🏠 **Available Rooms in Your Server:**

Based on your current system:
- `dslr-monitoring` - DSLR camera status and uploads
- `backup-status` - Event backup progress
- `admin-notifications` - System alerts and notifications
- `upload-progress` - Real-time upload tracking

## 🔧 **Integration with Existing System:**

### **Use Existing Hooks:**
```javascript
// Instead of manual Socket.IO setup, use existing hooks:
import { useDSLRRealtime } from '@/hooks/use-socketio-realtime';
import { useBackupRealtime } from '@/hooks/use-socketio-realtime';
import { useSystemNotifications } from '@/lib/realtime-provider';

// In your component:
const { dslrStatus, isConnected } = useDSLRRealtime();
const { backupStatus, progress } = useBackupRealtime();
const { notifications } = useSystemNotifications();
```

### **Environment-Based Configuration:**
```javascript
// Use environment variables (already configured):
const socketUrl = process.env.NEXT_PUBLIC_SOCKETIO_URL || 
                  'https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com';

const useSocketIO = process.env.NEXT_PUBLIC_USE_SOCKETIO === 'true';
```

## 📊 **Server Status (Current):**
- ✅ **Status**: Healthy
- ✅ **Uptime**: ~21 minutes
- ✅ **Connected Clients**: 0 (ready for connections)
- ✅ **Total Connections**: 6 (previous successful connections)
- ✅ **Messages**: 29 received, 27 sent
- ✅ **Memory**: 64MB RSS, 9MB heap (healthy)

## 🚀 **Quick Test:**

```javascript
// Test your corrected configuration:
const socket = io('https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com', {
  transports: ['websocket', 'polling'],
  timeout: 10000,
  reconnection: true
});

socket.on('connect', () => {
  console.log('✅ Connected!');
  socket.emit('join-room', 'dslr-monitoring');
});

socket.on('room-joined', (data) => {
  console.log('📍 Room joined:', data);
});
```

---

**🎯 Key Changes Needed:**
1. **Protocol**: `https://` instead of `wss://`
2. **Rooms**: `join-room` instead of `subscribe`
3. **Integration**: Use existing hooks instead of manual setup