# Fix: "Terjadi kesalahan jaringan" di Vercel Preview

## 🚨 Masalah: Network Error di Vercel Preview

Error "Terjadi kesalahan jaringan. Silakan coba lagi." di environment preview Vercel biasanya disebabkan oleh masalah CORS, environment variables, atau API endpoints yang tidak tersedia.

## 🔍 Langkah-langkah Troubleshooting

### 1. Jalankan Troubleshooting Script

```bash
# Jalankan script troubleshooting
chmod +x troubleshoot-vercel-preview.sh
./troubleshoot-vercel-preview.sh
```

### 2. Test API Endpoints Manual

```bash
# Test simple API endpoint
curl -X GET https://your-preview-url.vercel.app/api/test-simple

# Test auth API endpoint
curl -X GET https://your-preview-url.vercel.app/api/auth/test

# Test health check
curl -X GET https://your-preview-url.vercel.app/api/health
```

### 3. Periksa Browser Console

1. Buka browser developer tools (F12)
2. Buka tab Console
3. Buka tab Network
4. Coba login dan periksa error yang muncul

## 🐛 Penyebab Umum dan Solusi

### Masalah 1: CORS Error

**Gejala:**
- Error "CORS policy blocked" di console
- Network tab menunjukkan CORS error
- Request gagal dengan status 0

**Solusi:**
1. **Update CORS configuration di vercel.json:**
   ```json
   {
     "headers": [
       {
         "source": "/api/(.*)",
         "headers": [
           {
             "key": "Access-Control-Allow-Origin",
             "value": "*"
           },
           {
             "key": "Access-Control-Allow-Methods",
             "value": "GET, POST, PUT, DELETE, OPTIONS, PATCH"
           },
           {
             "key": "Access-Control-Allow-Headers",
             "value": "Content-Type, Authorization, X-Requested-With"
           },
           {
             "key": "Access-Control-Allow-Credentials",
             "value": "true"
           }
         ]
       }
     ]
   }
   ```

2. **Update environment variables:**
   ```bash
   vercel env add ALLOWED_ORIGINS preview
   # Masukkan: https://hafiportrait.photography,https://www.hafiportrait.photography,https://*.vercel.app
   ```

### Masalah 2: API Endpoint Tidak Tersedia

**Gejala:**
- Error 404 saat mengakses API
- "API endpoint tidak ditemukan"
- Network tab menunjukkan 404 response

**Solusi:**
1. **Periksa apakah API routes sudah di-deploy:**
   ```bash
   # List deployments
   vercel ls
   
   # Check build logs
   vercel logs --function=api/auth/login
   ```

2. **Redeploy aplikasi:**
   ```bash
   vercel --prod
   ```

3. **Test dengan endpoint sederhana:**
   ```
   https://your-preview-url.vercel.app/api/test-simple
   ```

### Masalah 3: Environment Variables Missing

**Gejala:**
- Error "Server configuration error"
- API tidak bisa mengakses database
- Health check menunjukkan missing variables

**Solusi:**
1. **Set environment variables untuk preview:**
   ```bash
   vercel env add NEXT_PUBLIC_API_BASE_URL preview
   # Masukkan: https://hafiportrait.photography
   
   vercel env add NEXT_PUBLIC_APP_URL preview
   # Masukkan: https://hafiportrait.photography
   
   vercel env add ALLOWED_ORIGINS preview
   # Masukkan: https://hafiportrait.photography,https://www.hafiportrait.photography,https://*.vercel.app
   ```

2. **Verifikasi environment variables:**
   ```bash
   vercel env ls | grep preview
   ```

### Masalah 4: Database Connection Error

**Gejala:**
- Error 500 saat login
- "Terjadi kesalahan server"
- Health check menunjukkan database unhealthy

**Solusi:**
1. **Periksa Supabase connection:**
   ```bash
   # Test health check
   curl -X GET https://your-preview-url.vercel.app/api/health
   ```

2. **Pastikan database credentials sudah diset:**
   ```bash
   vercel env ls | grep SUPABASE
   ```

3. **Test database connection:**
   - Buka Supabase dashboard
   - Periksa project status
   - Test connection dari SQL editor

### Masalah 5: Preview Domain Not Allowed

**Gejala:**
- CORS error dari preview domain
- "Access-Control-Allow-Origin" tidak sesuai
- Request ditolak oleh CORS policy

**Solusi:**
1. **Update CORS untuk preview domains:**
   ```bash
   vercel env add ALLOWED_ORIGINS preview
   # Masukkan: https://hafiportrait.photography,https://www.hafiportrait.photography,https://*.vercel.app,https://your-preview-url.vercel.app
   ```

2. **Update middleware CORS handling:**
   - Periksa `src/middleware.ts`
   - Pastikan preview domains diizinkan

## 🔧 Quick Fix Commands

### 1. Setup Environment Variables
```bash
# Setup environment variables untuk preview
chmod +x setup-vercel-preview.sh
./setup-vercel-preview.sh
```

### 2. Test API Endpoints
```bash
# Test simple endpoint
curl -X GET https://your-preview-url.vercel.app/api/test-simple

# Test CORS
curl -X OPTIONS \
  -H "Origin: https://your-preview-url.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  https://your-preview-url.vercel.app/api/auth/login
```

### 3. Check Logs
```bash
# View recent logs
vercel logs --since=10m

# View function logs
vercel logs --function=api/auth/login
```

### 4. Redeploy
```bash
# Redeploy dengan environment variables baru
vercel --prod
```

## 🧪 Testing Checklist

### 1. Basic Connectivity
- [ ] `/api/test-simple` returns 200
- [ ] `/api/auth/test` returns 200
- [ ] `/api/health` returns 200

### 2. CORS Testing
- [ ] OPTIONS request returns 200
- [ ] CORS headers are present
- [ ] No CORS errors in browser console

### 3. Login Testing
- [ ] Login endpoint accepts POST requests
- [ ] Invalid credentials return 401
- [ ] No network errors in console

### 4. Environment Variables
- [ ] All required variables are set
- [ ] Database connection works
- [ ] API can access environment variables

## 📊 Debug Information

### Browser Console Logs
Periksa console untuk:
- CORS errors
- Network errors
- JavaScript errors
- API response errors

### Network Tab
Periksa Network tab untuk:
- Failed requests
- Response status codes
- Request/response headers
- Timing information

### Vercel Logs
```bash
# View all logs
vercel logs

# View specific function logs
vercel logs --function=api/auth/login

# View recent logs
vercel logs --since=10m
```

## 🚀 Deployment Checklist

### Sebelum Deploy
- [ ] Environment variables sudah diset untuk preview
- [ ] CORS configuration sudah benar
- [ ] API routes sudah dibuat
- [ ] Database connection sudah dikonfigurasi

### Setelah Deploy
- [ ] Test `/api/test-simple` endpoint
- [ ] Test CORS dengan OPTIONS request
- [ ] Test login dengan invalid credentials
- [ ] Periksa browser console untuk errors

## 🔄 Alternative Solutions

### 1. Use Production API for Preview
Jika preview API tidak berfungsi, gunakan production API:

```javascript
// Di halaman login, gunakan production API untuk preview
const baseUrl = (() => {
  if (typeof window !== 'undefined') {
    const currentOrigin = window.location.origin;
    if (currentOrigin.includes('vercel.app') && !currentOrigin.includes('hafiportrait')) {
      return 'https://hafiportrait.photography';
    }
    return currentOrigin;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://hafiportrait.photography';
})();
```

### 2. Disable CORS for Development
Untuk testing sementara, bisa disable CORS:

```javascript
// Di API route
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    }
  });
}
```

### 3. Use Proxy for API Calls
Gunakan proxy untuk bypass CORS:

```javascript
// Gunakan relative URL untuk API calls
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
```

## 📞 Support

Jika masalah masih berlanjut:

1. **Periksa Vercel Status:** https://vercel-status.com
2. **Vercel Documentation:** https://vercel.com/docs
3. **Community Support:** https://github.com/vercel/vercel/discussions

## 📝 Log Template

Gunakan template ini untuk melaporkan masalah:

```
**Environment:** Vercel Preview
**URL:** https://your-preview-url.vercel.app
**Error:** "Terjadi kesalahan jaringan. Silakan coba lagi."
**Steps to reproduce:**
1. Buka preview URL
2. Buka /admin/test-login
3. Klik "Test API Connection"
4. Error muncul

**Expected behavior:** API endpoints should work
**Actual behavior:** Network error occurs

**Debug info:**
- Console logs: [Paste console logs]
- Network tab: [Paste network info]
- Environment variables: [List relevant env vars]
- API test results: [Paste test results]
```

---

**Dibuat oleh:** AI Assistant  
**Tanggal:** 2024  
**Versi:** 1.0.0