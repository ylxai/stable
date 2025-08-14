# 🔧 Zeabur Environment Variables Setup

## 📋 Current Status
- ✅ **Domain**: `wbs.zeabur.app`
- ⚠️ **Environment**: Currently `development` (needs to be `production`)
- ✅ **Port**: 8080 (correct)

## 🌍 Required Environment Variables di Zeabur Dashboard

Masuk ke Zeabur dashboard dan set environment variables berikut:

### **1. Core Configuration**
```env
NODE_ENV=production
PORT=8080
```

### **2. Security & Authentication**
```env
JWT_SECRET=your-super-secret-jwt-key-here
```

### **3. CORS Configuration**
```env
FRONTEND_URL=https://hafiportrait.photography
FRONTEND_URL_SECONDARY=https://hafiportrait.vercel.app
```

## 📱 Cara Set Environment Variables di Zeabur:

### **Step 1: Buka Zeabur Dashboard**
1. Login ke [zeabur.com](https://zeabur.com)
2. Pilih project Socket.IO Anda
3. Klik pada service "socketio-server"

### **Step 2: Set Environment Variables**
1. Klik tab "Environment"
2. Tambahkan variables satu per satu:

```
Key: NODE_ENV
Value: production

Key: PORT  
Value: 8080

Key: JWT_SECRET
Value: [generate secret key yang kuat]

Key: FRONTEND_URL
Value: https://hafiportrait.vercel.app
```

### **Step 3: Redeploy**
1. Klik "Redeploy" atau push commit baru
2. Wait for deployment to complete
3. Check logs untuk konfirmasi environment

## 🔐 Generate JWT Secret

Gunakan salah satu cara berikut untuk generate JWT secret:

### **Option 1: Online Generator**
- Buka: https://generate-secret.vercel.app/64
- Copy secret yang di-generate

### **Option 2: Node.js Command**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **Option 3: Manual Random String**
```
Contoh: HafiPortrait2024SecretKey_SocketIO_Zeabur_Production_12345
```

## ✅ Verification Steps

Setelah set environment variables:

### **1. Check Logs di Zeabur**
Logs harus menampilkan:
```
🚀 HafiPortrait Socket.IO Server running on port 8080
📡 Environment: production
🔗 Health check: https://wbs.zeabur.app/health
📊 Status: https://wbs.zeabur.app/status
🌐 Public URL: https://wbs.zeabur.app
```

### **2. Test Health Endpoint**
```bash
curl https://wbs.zeabur.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "connections": 0,
  "uptime": 60
}
```

### **3. Test Status Endpoint**
```bash
curl https://wbs.zeabur.app/status
```

Expected response:
```json
{
  "service": "HafiPortrait Socket.IO",
  "version": "1.0.0",
  "environment": "production",
  "connections": 0,
  "eventRooms": 0,
  "adminConnections": 0,
  "uptime": 60
}
```

## 🔄 After Environment Setup

Setelah environment variables di-set dan environment sudah `production`:

### **1. Update Frontend Configuration**
```bash
# Di main project directory
npm run zeabur:migrate
# Masukkan: https://wbs.zeabur.app
```

### **2. Test Integration**
```bash
npm run test:zeabur-integration
```

### **3. Update Vercel Environment**
Di Vercel dashboard, set:
```env
NEXT_PUBLIC_SOCKETIO_URL=https://wbs.zeabur.app
NEXT_PUBLIC_USE_SOCKETIO=true
JWT_SECRET=[same as Zeabur]
```

## 🚨 Important Notes

1. **JWT_SECRET** harus sama di Zeabur dan Vercel
2. **NODE_ENV=production** wajib untuk production mode
3. **FRONTEND_URL** harus match dengan domain frontend Anda
4. Setelah set environment variables, **redeploy** di Zeabur

## 📞 Troubleshooting

### **Environment masih development?**
- Check environment variables di Zeabur dashboard
- Pastikan `NODE_ENV=production` sudah di-set
- Redeploy service

### **CORS errors?**
- Check `FRONTEND_URL` di environment variables
- Pastikan domain frontend sudah benar

### **Connection failed?**
- Test health endpoint: `https://socket-server.zeabur.app/health`
- Check Zeabur logs untuk error messages

---

**Domain Zeabur**: `https://socket-server.zeabur.app`
**Status**: Ready for environment configuration