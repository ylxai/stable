# 🚨 WebSocket Server Troubleshooting

## ❌ **Current Issue:**
Server `xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com` returning 503 Service Unavailable

## 🔧 **Immediate Actions:**

### **1. Check VPS Server Status:**
```bash
# SSH to VPS
ssh user@xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com

# Check PM2 processes
pm2 status
pm2 logs socketio-server --lines 50

# Check system resources
htop
df -h
free -m
```

### **2. Restart WebSocket Services:**
```bash
# Restart Socket.IO server
pm2 restart socketio-server

# Or restart all PM2 processes
pm2 restart all

# Check logs after restart
pm2 logs socketio-server --lines 20
```

### **3. Check Network/Firewall:**
```bash
# Check if port is listening
netstat -tulpn | grep :3001
ss -tulpn | grep :3001

# Check firewall
ufw status
iptables -L

# Test local connection
curl localhost:3001/health
```

### **4. Check CloudRun Configuration:**
- CloudRun service might be down
- Check CloudRun console
- Verify service is running
- Check logs in CloudRun dashboard

## 🔄 **Fallback Strategy:**

### **Option 1: Use Polling Mode (Immediate)**
```env
NEXT_PUBLIC_USE_SOCKETIO=false
NEXT_PUBLIC_ENABLE_FALLBACK=true
NEXT_PUBLIC_POLLING_ENABLED=true
```

### **Option 2: Local WebSocket Server (Quick)**
```bash
# Start local WebSocket server
cd ws/
npm install
npm start

# Update environment
NEXT_PUBLIC_SOCKETIO_URL=http://localhost:3001
```

### **Option 3: Alternative WebSocket Service**
- Use Railway.app (free tier)
- Use Render.com (free tier)
- Use Heroku (if available)

## 🎯 **For Testing Admin Dashboard:**

### **Immediate Solution:**
1. **Disable WebSocket** temporarily
2. **Use enhanced polling** (still fast)
3. **Test all functionality** with polling
4. **Fix WebSocket server** later

### **Environment Variables for Vercel:**
```
NEXT_PUBLIC_USE_SOCKETIO=false
NEXT_PUBLIC_ENABLE_FALLBACK=true
NEXT_PUBLIC_POLLING_ENABLED=true
```

## 📊 **Expected Behavior with Fallback:**
- ✅ **Admin dashboard works** (polling mode)
- ✅ **Real-time updates** (3-45s intervals)
- ✅ **All functionality** available
- ⚠️ **Slightly slower** updates (but still good)

## 🚀 **Quick Deploy with Fallback:**
```bash
# Update Vercel environment variables
vercel env add NEXT_PUBLIC_USE_SOCKETIO production
# Enter: false

vercel env add NEXT_PUBLIC_ENABLE_FALLBACK production  
# Enter: true

# Redeploy
vercel --prod
```

---

**🎯 Priority: Get admin dashboard working with polling, fix WebSocket server later!**