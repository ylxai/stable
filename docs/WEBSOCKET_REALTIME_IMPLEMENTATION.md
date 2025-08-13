# 🔄 WebSocket Real-time Implementation

## 📋 **Overview**
Implementasi WebSocket untuk data real-time yang kritis (DSLR, Backup) dengan fallback polling untuk system metrics di admin dashboard HafiPortrait Photography.

## 🎯 **Strategy**
- **WebSocket Real-time**: Data kritis yang membutuhkan update instant (DSLR status, Backup progress, Upload events)
- **Polling Fallback**: System metrics yang tidak kritis (CPU, Memory, Storage) tetap menggunakan polling dengan interval yang lebih panjang
- **Hybrid Approach**: Kombinasi optimal antara performance dan resource usage

## ✅ **Implemented Components**

### **1. WebSocket Server** (`src/lib/websocket-server.ts`)
```javascript
class RealTimeWebSocketServer {
  // Real-time monitoring untuk:
  - DSLR status changes (2s interval)
  - Backup progress updates (5s interval)
  - Camera connection events
  - Upload completion events
  - Critical notifications
}
```

**Features:**
- ✅ Multi-channel subscription system
- ✅ Automatic reconnection with exponential backoff
- ✅ Heartbeat monitoring untuk client connections
- ✅ File-based monitoring untuk DSLR status
- ✅ EventStorageManager integration untuk backup status
- ✅ Graceful shutdown handling

### **2. React Hooks** (`src/hooks/use-websocket-realtime.ts`)
```javascript
// Generic WebSocket hook
useWebSocketRealtime(options)

// Specialized hooks
useDSLRRealtime()      // DSLR monitoring
useBackupRealtime()    // Backup monitoring  
useSystemNotifications() // Critical alerts
```

**Features:**
- ✅ Automatic subscription management
- ✅ Real-time data updates
- ✅ Connection status monitoring
- ✅ Error handling dengan fallback
- ✅ Message queuing saat disconnected

### **3. Enhanced Components**

#### **DSLR Monitor** (`src/components/admin/dslr-monitor.tsx`)
- ✅ WebSocket real-time data integration
- ✅ Fallback polling (30s interval) saat WebSocket disconnected
- ✅ Real-time toggle switch
- ✅ Connection status indicators
- ✅ Upload progress notifications
- ✅ Camera connection alerts

#### **Backup Status Monitor** (`src/components/admin/backup-status-monitor.tsx`)
- ✅ Real-time backup progress updates
- ✅ Instant status change notifications
- ✅ WebSocket/Polling mode indicators
- ✅ Real-time toggle controls
- ✅ Notification management
- ✅ Fallback polling (30s interval)

#### **System Monitor** (`src/components/admin/system-monitor.tsx`)
- ✅ Tetap menggunakan polling (2 menit interval)
- ✅ Optimized untuk system metrics yang tidak kritis
- ✅ Reduced frequency untuk resource efficiency

## 🚀 **Usage**

### **Development Mode**
```bash
# Start Next.js + WebSocket server
pnpm run dev:full

# Or start separately
pnpm run dev        # Next.js (port 3000)
pnpm run ws:start   # WebSocket server (port 3001)
```

### **Production Mode**
```bash
# Build application
pnpm run build

# Start Next.js
pnpm run start

# Start WebSocket server (separate process)
pnpm run ws:start
```

### **Environment Configuration**
```env
# .env.local
WS_PORT=3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws

# Production
NEXT_PUBLIC_WS_URL=wss://your-domain.com/ws
```

## 📊 **Performance Benefits**

### **Before (Polling Only)**
- DSLR Monitor: 10s interval polling
- Backup Monitor: 10s interval polling  
- System Monitor: 2min interval polling
- **Total API calls**: ~18 calls/minute

### **After (WebSocket + Polling)**
- DSLR: Real-time WebSocket + 30s fallback polling
- Backup: Real-time WebSocket + 30s fallback polling
- System: 2min interval polling (unchanged)
- **Total API calls**: ~6 calls/minute (67% reduction)
- **Real-time updates**: Instant untuk critical data

## 🔧 **Technical Details**

### **WebSocket Channels**
- `dslr`: DSLR status, camera connection, upload events
- `backup`: Backup progress, completion notifications
- `system`: Critical system alerts
- `upload`: File upload progress
- `camera`: Camera connection events

### **Message Types**
```javascript
// Client to Server
{ type: 'subscribe', payload: { channel: 'dslr' } }
{ type: 'unsubscribe', payload: { channel: 'backup' } }
{ type: 'heartbeat', payload: { timestamp: '...' } }
{ type: 'get_status', payload: { channel: 'dslr' } }

// Server to Client
{ type: 'dslr_status', payload: { isConnected: true, ... } }
{ type: 'backup_progress', payload: { backupId: '...', progress: 75 } }
{ type: 'camera_status', payload: { status: 'connected', ... } }
{ type: 'notification', payload: { type: 'critical', ... } }
```

### **Fallback Strategy**
1. **WebSocket Available**: Real-time updates via WebSocket
2. **WebSocket Disconnected**: Automatic fallback ke polling
3. **Toggle Control**: User dapat switch antara real-time dan polling
4. **Connection Indicators**: Visual feedback untuk connection status

## 🛡️ **Error Handling**

### **Connection Issues**
- Automatic reconnection dengan exponential backoff
- Maximum 5 reconnection attempts
- Graceful degradation ke polling mode
- User notification untuk connection status

### **Data Validation**
- Message format validation
- Payload sanitization
- Error boundary protection
- Fallback data sources

## 📱 **Mobile Optimization**

### **Responsive Design**
- Touch-friendly toggle controls
- Stacked button layout untuk mobile
- Optimized badge sizes
- Efficient data updates

### **Performance**
- Reduced polling frequency
- Efficient WebSocket message handling
- Minimal battery impact
- Smart connection management

## 🔍 **Monitoring & Debugging**

### **Server Stats**
```javascript
wsServer.getStats()
// Returns: {
//   connectedClients: 3,
//   subscriptions: { dslr: 2, backup: 1 },
//   uptime: "5m 30s",
//   lastDslrUpdate: "2024-01-15T10:30:00Z",
//   activeBackups: 2
// }
```

### **Client Debugging**
```javascript
// Browser console
const wsClient = getWebSocketClient();
console.log('Connection status:', wsClient.getStatus());
console.log('Subscriptions:', wsClient.getSubscriptions());
```

### **Logging**
- Server: Detailed connection dan message logs
- Client: Connection status dan error logs
- Performance: Message frequency dan latency tracking

## 🚀 **Next Steps**

### **Phase 1 - Current Implementation** ✅
- [x] WebSocket server setup
- [x] React hooks integration
- [x] DSLR Monitor real-time updates
- [x] Backup Monitor real-time updates
- [x] Fallback polling strategy

### **Phase 2 - Enhancement** 🔄
- [ ] WebSocket server clustering untuk scalability
- [ ] Message persistence untuk offline clients
- [ ] Advanced reconnection strategies
- [ ] Performance metrics dashboard
- [ ] Real-time analytics

### **Phase 3 - Production** 🎯
- [ ] Load balancer integration
- [ ] SSL/TLS termination
- [ ] Rate limiting
- [ ] Monitoring dan alerting
- [ ] Auto-scaling configuration

## 📚 **Documentation**

### **API Reference**
- [WebSocket Server API](./WEBSOCKET_API.md)
- [React Hooks Guide](./WEBSOCKET_HOOKS.md)
- [Component Integration](./WEBSOCKET_COMPONENTS.md)

### **Deployment Guides**
- [Local Development](./WEBSOCKET_DEVELOPMENT.md)
- [Production Deployment](./WEBSOCKET_PRODUCTION.md)
- [Docker Configuration](./WEBSOCKET_DOCKER.md)

---

**Status**: ✅ **Fully Implemented and Ready for Testing**
**Performance**: 67% reduction in API calls + Real-time critical data updates
**Compatibility**: Full backward compatibility dengan polling fallback
**Mobile**: Optimized untuk touch devices dengan responsive controls