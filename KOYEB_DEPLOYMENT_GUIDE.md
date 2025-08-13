# 🚀 Koyeb WebSocket + Vercel Frontend Deployment Guide

Complete setup untuk deploy WebSocket server di Koyeb dan frontend di Vercel dengan integrasi real-time notifications.

## 📋 **Overview Architecture**

```
📱 Frontend (Vercel) ←→ 🌐 WebSocket Server (Koyeb) ←→ 📸 DSLR System (Local/VPS)
```

- **Frontend**: Next.js di Vercel (global CDN, auto-scaling)
- **WebSocket**: Node.js server di Koyeb (real-time notifications)
- **DSLR System**: Local atau VPS terpisah (photo processing)

## 🎯 **Step 1: Koyeb WebSocket Deployment**

### **1.1 Persiapan Repository**

```bash
# Clone repository
git clone https://github.com/your-username/hafiportrait-photography.git
cd hafiportrait-photography

# Pastikan folder ws/ sudah ada dengan semua file
ls ws/
# Output: Dockerfile, package.json, server.js, health-check.js, dll
```

### **1.2 Deploy ke Koyeb**

#### **Option A: Via Koyeb Dashboard (Recommended)**

1. **Login ke Koyeb**: https://app.koyeb.com/
2. **Create New App**: 
   - Name: `hafiportrait-websocket`
   - Region: `Frankfurt (fra)` atau `Washington (was)`
3. **Source Configuration**:
   - **Source**: GitHub repository
   - **Repository**: `your-username/hafiportrait-photography`
   - **Branch**: `main`
   - **Build command**: `cd ws && npm install`
   - **Run command**: `cd ws && npm start`
4. **Port Configuration**:
   - **Port**: `3001` (WebSocket)
   - **Health check**: `/health` on port `3002`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   WS_PORT=3001
   HEALTH_PORT=3002
   HOST=0.0.0.0
   MAX_CONNECTIONS=1000
   HEARTBEAT_INTERVAL=30000
   PING_TIMEOUT=120000
   ENABLE_STATS_LOGGING=true
   CORS_ORIGIN=*
   LOG_LEVEL=info
   ```

#### **Option B: Via Koyeb CLI**

```bash
# Install Koyeb CLI
curl -fsSL https://cli.koyeb.com/install.sh | sh

# Login
koyeb auth login

# Deploy
koyeb app create hafiportrait-websocket \
  --git github.com/your-username/hafiportrait-photography \
  --git-branch main \
  --git-build-command "cd ws && npm install" \
  --git-run-command "cd ws && npm start" \
  --ports 3001:http \
  --env NODE_ENV=production \
  --env WS_PORT=3001 \
  --env HEALTH_PORT=3002 \
  --env HOST=0.0.0.0 \
  --regions fra \
  --instance-type nano
```

### **1.3 Verifikasi Deployment**

```bash
# Check deployment status
koyeb app list
koyeb app logs hafiportrait-websocket

# Test WebSocket connection
# Ganti YOUR_KOYEB_URL dengan URL yang diberikan Koyeb
node ws/test-connection.js
# Set environment: WS_URL=wss://your-app-name.koyeb.app/ws
```

## 🌐 **Step 2: Vercel Frontend Configuration**

### **2.1 Environment Variables di Vercel**

Login ke Vercel Dashboard dan set environment variables:

```bash
# Production Environment
NEXT_PUBLIC_WS_URL=wss://hafiportrait-websocket-your-id.koyeb.app/ws

# Preview Environment (untuk testing)
NEXT_PUBLIC_WS_URL=wss://hafiportrait-websocket-your-id.koyeb.app/ws

# Development (local)
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
```

### **2.2 Update vercel.json**

```json
{
  "crons": [
    {
      "path": "/api/cron/event-status",
      "schedule": "0 */6 * * *"
    }
  ],
  "functions": {
    "src/app/api/cron/event-status/route.ts": {
      "maxDuration": 60
    }
  },
  "rewrites": [
    {
      "source": "/event/:id",
      "destination": "/event/:id"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-WebSocket-URL",
          "value": "wss://hafiportrait-websocket-your-id.koyeb.app/ws"
        }
      ]
    }
  ]
}
```

### **2.3 Deploy ke Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_WS_URL production
# Input: wss://hafiportrait-websocket-your-id.koyeb.app/ws
```

## 🔧 **Step 3: Integration Testing**

### **3.1 Test WebSocket Connection**

```bash
# Test dari local
cd ws
WS_URL=wss://hafiportrait-websocket-your-id.koyeb.app/ws node test-connection.js

# Expected output:
# ✅ Connected to WebSocket server
# 📺 Subscribed to channel: dslr_status
# 📺 Subscribed to channel: backup_progress
# 💓 Heartbeat acknowledged
# ✅ Connection test PASSED
```

### **3.2 Test Frontend Integration**

1. **Open browser**: https://your-vercel-app.vercel.app
2. **Open DevTools Console**
3. **Check WebSocket connection**:
   ```javascript
   // Should see in console:
   // 🔌 Connecting to WebSocket server...
   // ✅ WebSocket connected
   ```

### **3.3 Test Real-time Notifications**

```bash
# Simulate DSLR notification
curl -X POST https://hafiportrait-websocket-your-id.koyeb.app/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "type": "notification",
    "payload": {
      "type": "upload_success",
      "title": "Photo Uploaded",
      "message": "IMG_001.jpg uploaded successfully",
      "priority": "medium"
    }
  }'
```

## 📊 **Step 4: Monitoring & Maintenance**

### **4.1 Koyeb Monitoring**

```bash
# Check app status
koyeb app get hafiportrait-websocket

# View logs
koyeb app logs hafiportrait-websocket --follow

# Check metrics
koyeb app metrics hafiportrait-websocket

# Scale app
koyeb app update hafiportrait-websocket --scale 2
```

### **4.2 Health Checks**

```bash
# WebSocket health
curl https://hafiportrait-websocket-your-id.koyeb.app/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "connections": 5,
  "memory": {
    "used": "45.2 MB",
    "total": "512 MB"
  }
}
```

### **4.3 Performance Monitoring**

```bash
# Stats endpoint
curl https://hafiportrait-websocket-your-id.koyeb.app/stats

# Response:
{
  "connections": {
    "total": 15,
    "active": 12
  },
  "messages": {
    "sent": 1250,
    "received": 890
  },
  "uptime": "2h 15m",
  "memory": "45.2 MB"
}
```

## 🔄 **Step 5: Auto-Deployment Setup**

### **5.1 GitHub Actions (Optional)**

Create `.github/workflows/deploy-websocket.yml`:

```yaml
name: Deploy WebSocket to Koyeb

on:
  push:
    branches: [main]
    paths: ['ws/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Koyeb
        env:
          KOYEB_TOKEN: ${{ secrets.KOYEB_TOKEN }}
        run: |
          curl -fsSL https://cli.koyeb.com/install.sh | sh
          koyeb auth login --token $KOYEB_TOKEN
          koyeb app redeploy hafiportrait-websocket
```

### **5.2 Webhook Integration**

Setup webhook di Koyeb untuk auto-deploy:
1. **Koyeb Dashboard** → **App Settings** → **Git Integration**
2. **Enable Auto-deploy**: `ON`
3. **Branch**: `main`
4. **Path filter**: `ws/`

## 🌍 **Step 6: Production Optimization**

### **6.1 Domain Setup (Optional)**

```bash
# Add custom domain di Koyeb
koyeb domain create ws.hafiportrait.photography \
  --app hafiportrait-websocket

# Update Vercel environment
vercel env add NEXT_PUBLIC_WS_URL production
# Input: wss://ws.hafiportrait.photography/ws
```

### **6.2 SSL/TLS Configuration**

Koyeb automatically provides SSL certificates. Pastikan menggunakan `wss://` (secure WebSocket) untuk production.

### **6.3 Scaling Configuration**

```bash
# Auto-scaling setup
koyeb app update hafiportrait-websocket \
  --min-scale 1 \
  --max-scale 3 \
  --instance-type small
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **WebSocket Connection Failed**
   ```bash
   # Check Koyeb logs
   koyeb app logs hafiportrait-websocket --tail 100
   
   # Check health endpoint
   curl https://your-app.koyeb.app/health
   ```

2. **CORS Issues**
   ```javascript
   // Update CORS_ORIGIN environment variable
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

3. **Port Issues**
   ```bash
   # Pastikan port 3001 dan 3002 terbuka
   # Koyeb automatically handles port mapping
   ```

## 💰 **Cost Estimation**

### **Koyeb Pricing:**
- **Nano instance**: $0.000009/second (~$23/month)
- **Small instance**: $0.000018/second (~$46/month)
- **Free tier**: 512MB RAM, 0.1 vCPU (limited hours)

### **Vercel Pricing:**
- **Hobby**: Free (personal projects)
- **Pro**: $20/month (commercial use)

### **Total Monthly Cost:**
- **Development**: FREE (Koyeb free tier + Vercel hobby)
- **Production**: $23-46/month (Koyeb) + $0-20/month (Vercel)

## 🎉 **Final Checklist**

- [ ] ✅ WebSocket server deployed di Koyeb
- [ ] ✅ Frontend deployed di Vercel
- [ ] ✅ Environment variables configured
- [ ] ✅ WebSocket connection tested
- [ ] ✅ Real-time notifications working
- [ ] ✅ Health checks passing
- [ ] ✅ Auto-deployment setup
- [ ] ✅ Monitoring configured
- [ ] ✅ Domain setup (optional)
- [ ] ✅ SSL/TLS enabled

## 📞 **Support**

Jika ada masalah:
1. Check Koyeb logs: `koyeb app logs hafiportrait-websocket`
2. Check Vercel logs: `vercel logs`
3. Test WebSocket: `node ws/test-connection.js`
4. Check health: `curl https://your-app.koyeb.app/health`

---

**🚀 Ready for Production!** Your WebSocket + Vercel system is now live with global CDN, auto-scaling, and real-time notifications.