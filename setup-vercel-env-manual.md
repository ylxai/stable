# 🔧 Manual Setup Environment Variables di Vercel Dashboard

Jika script otomatis tidak bisa dijalankan, copy-paste environment variables berikut satu per satu di Vercel Dashboard:

## 📍 Cara Manual:
1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project **HafiPortrait Photography**
3. Go to **Settings** → **Environment Variables**
4. Klik **Add New** untuk setiap variable di bawah
5. Set **Environment**: **Production**
6. **Save** dan **Redeploy**

---

## 🎯 Socket.IO Configuration (PRIORITAS TINGGI)

```
Name: NEXT_PUBLIC_WS_URL
Value: https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com
Environment: Production
```

```
Name: NEXT_PUBLIC_SOCKETIO_URL
Value: https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com
Environment: Production
```

```
Name: NEXT_PUBLIC_USE_SOCKETIO
Value: true
Environment: Production
```

```
Name: NEXT_PUBLIC_ENABLE_FALLBACK
Value: true
Environment: Production
```

```
Name: NEXT_PUBLIC_POLLING_ENABLED
Value: true
Environment: Production
```

```
Name: NEXT_PUBLIC_WS_HEALTH_URL
Value: https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com/health
Environment: Production
```

---

## 🗄️ Database Configuration (WAJIB)

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://azspktldiblhrwebzmwq.supabase.co
Environment: Production
```

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8
Environment: Production
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE
Environment: Production
```

---

## 🔐 Authentication (WAJIB)

```
Name: JWT_SECRET
Value: hafiportrait-production-secret-key-2025
Environment: Production
```

---

## ☁️ Cloudflare R2 Storage (WAJIB)

```
Name: CLOUDFLARE_R2_ACCOUNT_ID
Value: b14090010faed475102a62eca152b67f
Environment: Production
```

```
Name: CLOUDFLARE_R2_ACCESS_KEY_ID
Value: 51c66dbac26827b84132186428eb3492
Environment: Production
```

```
Name: CLOUDFLARE_R2_SECRET_ACCESS_KEY
Value: 65fe1143600bd9ef97a5c76b4ae924259779e0d0815ce44f09a1844df37fe3f1
Environment: Production
```

```
Name: CLOUDFLARE_R2_BUCKET_NAME
Value: hafiportrait-photos
Environment: Production
```

```
Name: CLOUDFLARE_R2_CUSTOM_DOMAIN
Value: photos.hafiportrait.photography
Environment: Production
```

```
Name: CLOUDFLARE_R2_PUBLIC_URL
Value: https://photos.hafiportrait.photography
Environment: Production
```

```
Name: CLOUDFLARE_R2_REGION
Value: auto
Environment: Production
```

```
Name: CLOUDFLARE_R2_ENDPOINT
Value: https://b14090010faed475102a62eca152b67f.r2.cloudflarestorage.com
Environment: Production
```

---

## 📁 Google Drive Storage (WAJIB)

```
Name: GOOGLE_DRIVE_CLIENT_ID
Value: 1098208255243-i92ah6oithsvfhvq4fq62tfr8armjh1a.apps.googleusercontent.com
Environment: Production
```

```
Name: GOOGLE_DRIVE_CLIENT_SECRET
Value: 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
Environment: Production
```

```
Name: GOOGLE_DRIVE_REFRESH_TOKEN
Value: 1//0erDLcuFyYiK3CgYIARAAGA4SNwF-L9Ir3z2Ib2mbiPwCs-c3K_JeLfkZT0Zwxs-AMCJqyLsWs6nM8gk6Y4KLvrofLQHF9Qwcifg
Environment: Production
```

```
Name: GOOGLE_DRIVE_FOLDER_ID
Value: root
Environment: Production
```

```
Name: GOOGLE_DRIVE_FOLDER_NAME
Value: HafiPortrait-Photos
Environment: Production
```

```
Name: GOOGLE_DRIVE_SHARED_FOLDER
Value: false
Environment: Production
```

---

## 🎛️ Smart Storage Configuration (OPSIONAL)

```
Name: SMART_STORAGE_ENABLED
Value: true
Environment: Production
```

```
Name: SMART_STORAGE_DEFAULT_TIER
Value: cloudflareR2
Environment: Production
```

```
Name: SMART_STORAGE_PRIMARY
Value: cloudflareR2
Environment: Production
```

```
Name: SMART_STORAGE_SECONDARY
Value: googleDrive
Environment: Production
```

```
Name: SMART_STORAGE_TERTIARY
Value: local
Environment: Production
```

```
Name: SMART_STORAGE_COMPRESSION_QUALITY
Value: 85
Environment: Production
```

---

## 🌍 Environment Settings (OPSIONAL)

```
Name: NODE_ENV
Value: production
Environment: Production
```

```
Name: NEXT_PUBLIC_ENV_MODE
Value: production
Environment: Production
```

```
Name: NEXT_PUBLIC_APP_URL
Value: https://hafiportrait.photography
Environment: Production
```

```
Name: NEXT_TELEMETRY_DISABLED
Value: 1
Environment: Production
```

---

## ✅ Setelah Setup Selesai:

1. **Redeploy** aplikasi di Vercel
2. **Test Socket.IO** connection: https://ws.hafiportrait.photography/health
3. **Verifikasi** real-time features di admin dashboard
4. **Monitor** connection status di browser console

🎯 **Total Environment Variables**: 32 variables
⏱️ **Estimasi Waktu Setup Manual**: 15-20 menit