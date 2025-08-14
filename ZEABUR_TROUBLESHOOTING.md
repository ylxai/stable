# 🚨 Zeabur Deployment Troubleshooting

## 📊 Current Issue Status

**Problem**: Socket.IO server returning 404/502 errors
- ❌ Health endpoint: `Bad Gateway (502)`
- ❌ Root endpoint: `404 Not Found`
- ❌ Socket.IO connections: `502 WebSocket error`

## 🔍 Diagnosis

### **Issue**: Deployment Failed or Service Down
The server was working before but now returning errors, indicating:
1. **Deployment failure** - Build or start process failed
2. **Service crashed** - PM2 process died
3. **Port binding issue** - Service not listening on correct port
4. **Environment variables** - Missing or incorrect configuration

## 🔧 Troubleshooting Steps

### **Step 1: Check Zeabur Dashboard**
1. Login ke [Zeabur Dashboard](https://zeabur.com)
2. Go to your project → Socket.IO service
3. Check **"Logs"** tab untuk error messages
4. Check **"Deployments"** tab untuk deployment status

### **Step 2: Check Deployment Logs**
Look for these common errors:
```
❌ npm ERR! Missing script: start
❌ Error: Cannot find module 'pm2'
❌ EADDRINUSE: address already in use :::8080
❌ Error: listen EACCES: permission denied 0.0.0.0:8080
```

### **Step 3: Check Environment Variables**
Ensure these are set in Zeabur dashboard:
```env
NODE_ENV=production
PORT=8080
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://hafiportrait.photography
FRONTEND_URL_SECONDARY=https://hafiportrait.vercel.app
```

### **Step 4: Redeploy Service**
1. In Zeabur dashboard
2. Go to service → **"Redeploy"**
3. Wait for deployment to complete
4. Check logs for success/failure

## 🛠️ Quick Fixes

### **Fix 1: Update package.json Start Script**
Ensure `zeabur-socketio/package.json` has:
```json
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.config.js"
  }
}
```

### **Fix 2: Simplify PM2 Configuration**
If PM2 cluster mode fails, try simple mode:
```json
{
  "scripts": {
    "start": "pm2-runtime start ecosystem.simple.js"
  }
}
```

### **Fix 3: Fallback to Direct Node**
If PM2 completely fails:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### **Fix 4: Check Port Configuration**
Ensure all files use port 8080:
- `server.js`: `process.env.PORT || 8080`
- `ecosystem.config.js`: `PORT: 8080`
- `.env.example`: `PORT=8080`

## 🚀 Recovery Actions

### **Action 1: Push Latest Code**
```bash
cd zeabur-socketio
git add .
git commit -m "Fix deployment configuration"
git push
```

### **Action 2: Trigger Redeploy**
- Zeabur dashboard → Service → Redeploy
- Or push new commit to trigger auto-deploy

### **Action 3: Check Health After Deploy**
```bash
# Wait 2-3 minutes after redeploy, then test:
curl https://wbs.zeabur.app/health
```

### **Action 4: Debug with Simple Configuration**
If still failing, temporarily update `package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

## 📋 Expected Success Indicators

After successful deployment:
```bash
# Health check should return:
curl https://wbs.zeabur.app/health
{
  "status": "healthy",
  "timestamp": "2025-08-14T...",
  "connections": 0,
  "uptime": 123
}

# Status should return:
curl https://wbs.zeabur.app/status
{
  "service": "HafiPortrait Socket.IO",
  "version": "1.0.0",
  "environment": "production"
}
```

## 🔄 Alternative Solutions

### **Option 1: Recreate Service**
If deployment keeps failing:
1. Delete current service in Zeabur
2. Create new service
3. Connect same GitHub repository
4. Set environment variables again

### **Option 2: Use Different Port**
If port 8080 has issues:
1. Try port 3000 or 8000
2. Update all configuration files
3. Redeploy

### **Option 3: Simplify Configuration**
Remove advanced features temporarily:
- Use direct Node.js instead of PM2
- Remove cluster mode
- Minimal dependencies

## 📞 Next Steps

1. **Check Zeabur logs** for specific error messages
2. **Redeploy service** with current configuration
3. **Test health endpoint** after deployment
4. **Report specific errors** if deployment still fails

---

**Current Status**: Service down, needs redeploy and troubleshooting
**Priority**: High - Service unavailable