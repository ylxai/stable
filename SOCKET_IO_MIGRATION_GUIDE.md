# 🔄 Socket.IO Migration Guide

## 📋 **Migration Status**
✅ **Phase 1 Complete**: Socket.IO server implementation
✅ **Phase 2 Complete**: Socket.IO client wrapper
✅ **Phase 3 Complete**: React hooks implementation
🔄 **Phase 4 In Progress**: Component updates and testing

## 🚀 **Quick Start - Testing Socket.IO**

### **1. Install Dependencies**
```bash
pnpm install
```

### **2. Start Socket.IO Server**
```bash
# Development mode
pnpm run socketio:dev

# Or production mode
pnpm run socketio:start
```

### **3. Start Next.js App with Socket.IO**
```bash
# In another terminal
NEXT_PUBLIC_USE_SOCKETIO=true pnpm run dev
```

### **4. Test Both Servers (Optional)**
```bash
# Run both WebSocket and Socket.IO for comparison
pnpm run dev:full      # WebSocket version
pnpm run dev:socketio  # Socket.IO version
```

## 🔧 **Environment Configuration**

### **Socket.IO Environment Variables**
```env
# Socket.IO Configuration
SOCKETIO_PORT=3001
NEXT_PUBLIC_SOCKETIO_URL=http://localhost:3001
NEXT_PUBLIC_USE_SOCKETIO=true

# Legacy WebSocket (for fallback)
WS_PORT=3002
NEXT_PUBLIC_WS_URL=ws://localhost:3002/ws
```

### **Production Environment**
```env
# Production Socket.IO
SOCKETIO_PORT=3001
NEXT_PUBLIC_SOCKETIO_URL=https://ws.hafiportrait.photography
NEXT_PUBLIC_USE_SOCKETIO=true
CORS_ORIGIN=https://hafiportrait.photography,https://www.hafiportrait.photography
JWT_SECRET=your-production-jwt-secret
```

## 📱 **Component Migration**

### **Option 1: Feature Flag Approach (Recommended)**
Update components to support both WebSocket and Socket.IO based on environment variable:

```typescript
// In component
import { useDSLRRealtime } from '@/hooks/use-websocket-realtime';
import { useDSLRRealtimeSocketIO } from '@/hooks/use-socketio-realtime';

const useSocketIO = process.env.NEXT_PUBLIC_USE_SOCKETIO === 'true';

export function DSLRMonitor() {
  const websocketData = useDSLRRealtime();
  const socketioData = useDSLRRealtimeSocketIO();
  
  const data = useSocketIO ? socketioData : websocketData;
  
  return (
    <div>
      <div className="flex items-center gap-2">
        <span>Protocol: {useSocketIO ? 'Socket.IO' : 'WebSocket'}</span>
        <span>Transport: {data.transport}</span>
      </div>
      {/* Rest of component */}
    </div>
  );
}
```

### **Option 2: Direct Migration**
Replace WebSocket hooks with Socket.IO hooks:

```typescript
// Before
import { useDSLRRealtime } from '@/hooks/use-websocket-realtime';

// After
import { useDSLRRealtimeSocketIO as useDSLRRealtime } from '@/hooks/use-socketio-realtime';
```

## 🧪 **Testing Checklist**

### **Basic Functionality**
- [ ] Server starts without errors
- [ ] Client connects successfully
- [ ] Room subscription works
- [ ] Real-time data updates
- [ ] Heartbeat mechanism
- [ ] Graceful disconnection

### **Mobile Testing**
- [ ] Auto-fallback (WebSocket → Polling)
- [ ] Network switching (WiFi ↔ Mobile)
- [ ] Background/foreground handling
- [ ] Battery optimization
- [ ] Touch responsiveness

### **Performance Testing**
- [ ] Connection speed comparison
- [ ] Memory usage monitoring
- [ ] CPU usage comparison
- [ ] Network bandwidth usage
- [ ] Reconnection reliability

### **Feature Comparison**
| Feature | WebSocket | Socket.IO | Status |
|---------|-----------|-----------|---------|
| Real-time updates | ✅ | ✅ | ✅ |
| Auto-reconnection | ✅ | ✅ | ✅ |
| Room management | Manual | Built-in | ✅ |
| Mobile optimization | Basic | Advanced | ✅ |
| Compression | ❌ | ✅ | ✅ |
| Auto-fallback | ❌ | ✅ | ✅ |
| Rate limiting | Manual | Built-in | ✅ |
| Authentication | Manual | Middleware | ✅ |

## 📊 **Performance Comparison**

### **Connection Establishment**
- **WebSocket**: ~100-200ms
- **Socket.IO**: ~150-300ms (includes handshake)

### **Message Latency**
- **WebSocket**: ~5-10ms
- **Socket.IO**: ~10-20ms (includes protocol overhead)

### **Mobile Performance**
- **WebSocket**: Good on stable connections
- **Socket.IO**: Excellent with auto-fallback

### **Browser Compatibility**
- **WebSocket**: 95%+ modern browsers
- **Socket.IO**: 99%+ all browsers (with fallback)

## 🔄 **Migration Steps**

### **Step 1: Parallel Testing (Current)**
```bash
# Test Socket.IO alongside WebSocket
NEXT_PUBLIC_USE_SOCKETIO=true pnpm run dev:socketio
```

### **Step 2: Component Updates**
Update admin components to use Socket.IO hooks:
- `src/components/admin/dslr-monitor.tsx`
- `src/components/admin/backup-status-monitor.tsx`

### **Step 3: Production Deployment**
Deploy Socket.IO server and update environment variables.

### **Step 4: Full Migration**
Remove WebSocket code after successful validation.

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Connection Failed**
```bash
# Check if Socket.IO server is running
curl http://localhost:3001/health

# Check logs
pnpm run socketio:dev
```

#### **CORS Errors**
```env
# Update CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:3000,https://your-domain.com
```

#### **Authentication Issues**
```env
# Ensure JWT_SECRET is set
JWT_SECRET=your-secret-key
```

#### **Mobile Connection Issues**
- Check network type detection
- Verify auto-fallback is working
- Test background/foreground transitions

### **Debug Commands**
```bash
# Test Socket.IO connection
node -e "
const io = require('socket.io-client');
const socket = io('http://localhost:3001');
socket.on('connect', () => console.log('Connected!'));
socket.on('disconnect', () => console.log('Disconnected!'));
"

# Check server health
curl -s http://localhost:3001/health | jq

# Monitor server logs
pnpm run socketio:dev | grep -E "(Connected|Disconnected|Error)"
```

## 📈 **Monitoring & Analytics**

### **Key Metrics to Track**
- Connection success rate
- Average connection time
- Message delivery latency
- Reconnection frequency
- Transport usage (WebSocket vs Polling)
- Mobile vs Desktop performance

### **Health Check Endpoint**
```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "stats": {
    "connectedClients": 5,
    "roomSubscriptions": {
      "dslr-monitoring": 2,
      "backup-status": 3
    },
    "transports": {
      "websocket": 4,
      "polling": 1
    }
  }
}
```

## 🎯 **Next Steps**

1. **Test Socket.IO server**: `pnpm run socketio:dev`
2. **Update components**: Add feature flag support
3. **Mobile testing**: Test on real devices
4. **Performance validation**: Compare metrics
5. **Production deployment**: Deploy Socket.IO server
6. **Full migration**: Remove WebSocket code

## 📞 **Support**

If you encounter issues during migration:
1. Check server logs: `pnpm run socketio:dev`
2. Test health endpoint: `curl http://localhost:3001/health`
3. Compare with WebSocket version
4. Check browser console for client errors

---

**Migration Progress**: 75% Complete
**Next Milestone**: Component updates and mobile testing
**ETA**: Ready for production testing