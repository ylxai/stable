# 🚀 Quick Start: WebSocket + Vercel di Koyeb

**One-command deployment untuk WebSocket server di Koyeb + Frontend di Vercel**

## ⚡ Super Quick Setup (5 menit)

### **Step 1: Deploy WebSocket ke Koyeb**

```bash
# Clone repository (jika belum)
git clone https://github.com/your-username/hafiportrait-photography.git
cd hafiportrait-photography

# One-command deployment
bash scripts/quick-koyeb-setup.sh
```

**Script ini akan:**
- ✅ Install Koyeb CLI
- ✅ Login ke Koyeb (browser auth)
- ✅ Deploy WebSocket server
- ✅ Test deployment
- ✅ Generate Vercel config

### **Step 2: Update Vercel Environment**

Setelah deployment selesai, copy WebSocket URL dari output:

```bash
# Output akan menampilkan:
# 🌐 WebSocket URL: wss://hafiportrait-websocket-abc123.koyeb.app/ws
```

**Set di Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project → Settings → Environment Variables
3. Add: `NEXT_PUBLIC_WS_URL` = `wss://your-koyeb-domain.koyeb.app/ws`
4. Redeploy Vercel app

### **Step 3: Test Integration**

```bash
# Test WebSocket connection
cd ws
WS_URL=wss://your-koyeb-domain.koyeb.app/ws node test-connection.js

# Expected output:
# ✅ Connected to WebSocket server
# 💓 Heartbeat acknowledged
# ✅ Connection test PASSED
```

## 🔧 Management Commands

```bash
# Check deployment status
npm run koyeb:status

# View logs
npm run koyeb:logs

# Redeploy
npm run koyeb:deploy

# Full setup (interactive)
npm run koyeb:setup
```

## 📊 URLs & Endpoints

Setelah deployment, Anda akan mendapatkan:

- **WebSocket**: `wss://your-app.koyeb.app/ws`
- **Health Check**: `https://your-app.koyeb.app/health`
- **Stats**: `https://your-app.koyeb.app/stats`
- **Frontend**: `https://your-vercel-app.vercel.app`

## 🎯 Architecture Overview

```
📱 Frontend (Vercel)     🌐 WebSocket (Koyeb)     📸 DSLR System
├─ Next.js App          ├─ Node.js Server         ├─ Local/VPS
├─ Global CDN           ├─ Real-time WS           ├─ Photo Processing
├─ Auto-scaling         ├─ Auto-scaling           └─ Upload Notifications
└─ Free/Pro tier        └─ €23/month (nano)           ↓
                                                  Real-time Updates
```

## 💰 Cost Breakdown

- **Koyeb WebSocket**: €23/month (nano instance)
- **Vercel Frontend**: Free (hobby) / $20/month (pro)
- **Total**: €23-43/month untuk production-ready system

## 🚨 Troubleshooting

### **WebSocket Connection Failed**
```bash
# Check Koyeb logs
npm run koyeb:logs

# Check health
curl https://your-app.koyeb.app/health
```

### **Vercel Environment Issues**
```bash
# Check current environment
vercel env ls

# Add WebSocket URL
vercel env add NEXT_PUBLIC_WS_URL production
```

### **CORS Issues**
```bash
# Update CORS origin di Koyeb
koyeb app update hafiportrait-websocket --env CORS_ORIGIN=https://your-vercel-app.vercel.app
```

## ✅ Success Checklist

- [ ] ✅ WebSocket server deployed di Koyeb
- [ ] ✅ Health check passing (`/health` returns `{"status": "healthy"}`)
- [ ] ✅ WebSocket connection test passed
- [ ] ✅ Vercel environment variable set (`NEXT_PUBLIC_WS_URL`)
- [ ] ✅ Frontend deployed dan dapat connect ke WebSocket
- [ ] ✅ Real-time notifications working
- [ ] ✅ DSLR system dapat send notifications

## 🎉 Next Steps

1. **Custom Domain** (optional):
   ```bash
   koyeb domain create ws.hafiportrait.photography --app hafiportrait-websocket
   ```

2. **SSL Certificate**: Automatic via Koyeb

3. **Monitoring**: Built-in Koyeb dashboard + health checks

4. **Scaling**: Auto-scaling 1-3 instances based on load

---

**🚀 Ready for Production!** Your WebSocket + Vercel system is now live with global CDN, auto-scaling, and real-time notifications.