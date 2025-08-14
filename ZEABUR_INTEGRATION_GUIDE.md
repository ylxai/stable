# 🔗 Panduan Integrasi Socket.IO Zeabur dengan Sistem HafiPortrait

## 📋 Overview Integrasi

Sistem HafiPortrait sudah memiliki konfigurasi Socket.IO yang lengkap. Kita akan mengintegrasikan server Socket.IO Zeabur sebagai pengganti server WebSocket yang ada.

## 🔄 Langkah-langkah Integrasi

### 1. **Update Konfigurasi Production WebSocket**

Update file `src/lib/production-websocket-config.ts`:

```typescript
// Ganti URL server yang lama dengan URL Zeabur baru
export const PRODUCTION_WS_CONFIG = {
  // Zeabur Socket.IO Server (BARU)
  serverUrl: 'https://your-zeabur-socketio-domain.com',
  healthEndpoint: 'https://your-zeabur-socketio-domain.com/health',
  wsEndpoint: 'https://your-zeabur-socketio-domain.com/socket.io/',
  
  // Sisanya tetap sama...
  connectionTimeout: 10000,
  reconnectAttempts: 10,
  // ... konfigurasi lainnya
};
```

### 2. **Update Environment Variables**

Tambahkan di `.env.local` atau Vercel environment:

```env
# Socket.IO Zeabur Configuration
NEXT_PUBLIC_SOCKETIO_URL=https://your-zeabur-socketio-domain.com
NEXT_PUBLIC_USE_SOCKETIO=true

# JWT Secret (harus sama dengan Zeabur server)
JWT_SECRET=your-super-secret-jwt-key
```

### 3. **Update Socket.IO Client Configuration**

File `src/lib/socketio-client.ts` sudah kompatibel, tapi perlu sedikit penyesuaian:

```typescript
// Di bagian constructor SocketIOClient, update server URL detection
constructor() {
  // Prioritas: Environment variable > Production config > Fallback
  this.serverUrl = 
    process.env.NEXT_PUBLIC_SOCKETIO_URL || 
    PRODUCTION_WS_CONFIG.serverUrl || 
    'https://your-zeabur-socketio-domain.com';
    
  // Sisanya tetap sama...
}
```

## 🔧 Konfigurasi Komponen yang Perlu Diupdate

### 1. **Admin Components**

Komponen admin sudah menggunakan `use-socketio-realtime.ts` yang kompatibel:

- ✅ `backup-status-monitor.tsx` - Sudah kompatibel
- ✅ `event-backup-manager.tsx` - Sudah kompatibel  
- ✅ `dslr-monitor.tsx` - Sudah kompatibel
- ✅ `system-monitor.tsx` - Sudah kompatibel

### 2. **Event Components**

Komponen event juga sudah kompatibel:

- ✅ `PhotoGallery.tsx` - Real-time photo updates
- ✅ `GuestbookSection.tsx` - Real-time message updates
- ✅ `PhotoUploadForm.tsx` - Upload notifications

## 📡 API Integration Points

### 1. **Photo Upload Integration**

Update `src/app/api/events/[id]/photos/route.ts`:

```typescript
// Setelah upload berhasil, kirim notifikasi via Zeabur Socket.IO
const notifyPhotoUpload = async (eventId: string, photoData: any) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SOCKETIO_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        type: 'new-photo',
        data: {
          photoId: photoData.id,
          photoUrl: photoData.url,
          uploadedBy: photoData.uploadedBy,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Failed to send photo notification:', error);
  }
};

// Panggil setelah upload berhasil
await notifyPhotoUpload(eventId, uploadedPhoto);
```

### 2. **Message Integration**

Update `src/app/api/events/[id]/messages/route.ts`:

```typescript
// Setelah message berhasil disimpan
const notifyNewMessage = async (eventId: string, messageData: any) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SOCKETIO_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId,
        type: 'new-message',
        data: {
          messageId: messageData.id,
          message: messageData.message,
          author: messageData.author,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Failed to send message notification:', error);
  }
};
```

### 3. **Admin Notifications**

Update `src/app/api/admin/events/[id]/backup/route.ts`:

```typescript
// Notifikasi admin saat backup dimulai/selesai
const notifyAdminBackup = async (type: string, data: any) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SOCKETIO_URL}/api/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `backup-${type}`,
        adminOnly: true,
        data: {
          eventId: data.eventId,
          status: data.status,
          progress: data.progress,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
};
```

## 🔐 Authentication Integration

### 1. **JWT Token Integration**

Update `src/lib/auth.ts` untuk include JWT token:

```typescript
// Tambahkan method untuk generate Socket.IO token
export function generateSocketIOToken(user: any) {
  return jwt.sign(
    {
      userId: user.id,
      isAdmin: user.isAdmin || false,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}
```

### 2. **Client Authentication**

Update `src/hooks/use-socketio-realtime.ts`:

```typescript
// Di useEffect connection, tambahkan auth token
useEffect(() => {
  if (shouldConnect && !isConnected) {
    // Get auth token dari session/localStorage
    const authToken = localStorage.getItem('auth-token') || 
                     generateGuestToken();
    
    socketClient.connect({
      auth: {
        token: authToken
      }
    });
  }
}, [shouldConnect, isConnected]);
```

## 🧪 Testing Integration

### 1. **Local Testing**

```bash
# 1. Start Zeabur Socket.IO server locally
cd zeabur-socketio
npm install
npm start

# 2. Update .env.local
NEXT_PUBLIC_SOCKETIO_URL=http://localhost:3001
NEXT_PUBLIC_USE_SOCKETIO=true

# 3. Start main app
npm run dev

# 4. Test dengan client-example.html
# Buka zeabur-socketio/client-example.html di browser
```

### 2. **Production Testing**

```bash
# 1. Deploy ke Zeabur
# 2. Update environment variables di Vercel:
NEXT_PUBLIC_SOCKETIO_URL=https://your-zeabur-domain.com
NEXT_PUBLIC_USE_SOCKETIO=true

# 3. Test connection
node zeabur-socketio/test-connection.js https://your-zeabur-domain.com
```

## 📊 Monitoring Integration

### 1. **Health Check Integration**

Tambahkan di `src/app/api/admin/system/health/route.ts`:

```typescript
// Check Zeabur Socket.IO health
const checkSocketIOHealth = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKETIO_URL}/health`);
    const data = await response.json();
    return {
      status: data.status === 'healthy' ? 'healthy' : 'unhealthy',
      connections: data.connections,
      uptime: data.uptime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};
```

### 2. **Stats Integration**

Update `src/components/admin/system-monitor.tsx`:

```typescript
// Tambahkan Socket.IO stats
const fetchSocketIOStats = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SOCKETIO_URL}/api/stats`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Socket.IO stats:', error);
    return null;
  }
};
```

## 🚀 Deployment Checklist

### Pre-deployment:
- [ ] Deploy Socket.IO server ke Zeabur
- [ ] Set environment variables di Zeabur
- [ ] Test Socket.IO server dengan `test-connection.js`
- [ ] Update `NEXT_PUBLIC_SOCKETIO_URL` di Vercel
- [ ] Test local integration

### Post-deployment:
- [ ] Verify real-time photo notifications
- [ ] Verify real-time message notifications  
- [ ] Verify admin backup notifications
- [ ] Check health monitoring
- [ ] Monitor connection stats
- [ ] Test mobile compatibility

## 🔄 Rollback Plan

Jika ada masalah, rollback dengan:

```env
# Kembali ke WebSocket server lama
NEXT_PUBLIC_SOCKETIO_URL=https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com
NEXT_PUBLIC_USE_SOCKETIO=false
```

## 📞 Troubleshooting

### Common Issues:

1. **CORS Error**: Pastikan domain frontend sudah ditambahkan di Zeabur server
2. **Connection Failed**: Check health endpoint dan network connectivity  
3. **Auth Failed**: Pastikan JWT_SECRET sama di frontend dan Zeabur
4. **Missing Notifications**: Check API integration dan error logs

### Debug Commands:

```bash
# Check Zeabur server health
curl https://your-zeabur-domain.com/health

# Check connection stats
curl https://your-zeabur-domain.com/api/stats

# Test notification API
curl -X POST https://your-zeabur-domain.com/api/notify \
  -H "Content-Type: application/json" \
  -d '{"type":"test","data":{"message":"test"}}'
```

---

**Ready untuk integrasi! 🚀**

Sistem sudah dirancang modular, jadi integrasi akan smooth tanpa breaking changes major.