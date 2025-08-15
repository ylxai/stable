# Troubleshooting Login di Vercel Preview

## 🚨 Masalah: Login Tidak Bisa di Mode Preview Vercel

Dokumen ini menjelaskan langkah-langkah troubleshooting untuk masalah login yang tidak berfungsi di mode preview Vercel.

## 🔍 Langkah-langkah Debugging

### 1. Periksa Environment Variables

Pastikan environment variables sudah diset dengan benar untuk preview environment:

```bash
# Jalankan script setup
chmod +x setup-vercel-preview.sh
./setup-vercel-preview.sh
```

### 2. Verifikasi Environment Variables

```bash
# List semua environment variables
vercel env ls

# Periksa environment variables untuk preview
vercel env ls | grep preview
```

### 3. Gunakan Halaman Test

Buka halaman test untuk debugging:
```
https://your-preview-url.vercel.app/admin/test-login
```

Halaman ini akan:
- Test konektivitas ke berbagai API endpoint
- Menampilkan debug information
- Membantu mengidentifikasi masalah

## 🐛 Masalah Umum dan Solusi

### Masalah 1: CORS Error

**Gejala:**
- Error di console browser: "CORS policy blocked"
- Network tab menunjukkan error CORS

**Solusi:**
1. Periksa `ALLOWED_ORIGINS` environment variable
2. Pastikan domain preview sudah ditambahkan ke allowed origins
3. Update CORS configuration:

```bash
# Tambahkan domain preview ke allowed origins
vercel env add ALLOWED_ORIGINS preview
# Masukkan: https://hafiportrait.photography,https://www.hafiportrait.photography,https://hafiportrait.vercel.app,https://*.vercel.app
```

### Masalah 2: API Endpoint Tidak Ditemukan (404)

**Gejala:**
- Error 404 saat mengakses `/api/auth/login`
- Network tab menunjukkan 404 response

**Solusi:**
1. Pastikan API route sudah di-deploy dengan benar
2. Periksa apakah ada error di build process
3. Test API endpoint langsung:

```bash
# Test API endpoint
curl -X GET https://your-preview-url.vercel.app/api/auth/test
```

### Masalah 3: Network Error

**Gejala:**
- "Failed to fetch" error
- Tidak bisa terhubung ke API

**Solusi:**
1. Periksa koneksi internet
2. Pastikan Vercel deployment berhasil
3. Coba akses dari browser yang berbeda
4. Periksa Vercel logs:

```bash
# View Vercel logs
vercel logs --function=api/auth/login
```

### Masalah 4: Authentication Error

**Gejala:**
- Login gagal dengan credentials yang benar
- Error 401 atau 500

**Solusi:**
1. Periksa database connection
2. Pastikan authentication service berjalan
3. Periksa logs untuk error detail:

```bash
# View function logs
vercel logs --function=api/auth/login
```

## 🔧 Konfigurasi yang Diperlukan

### Environment Variables untuk Preview

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://hafiportrait.photography
NEXT_PUBLIC_API_BASE_URL=https://hafiportrait.photography
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://hafiportrait.photography,https://www.hafiportrait.photography,https://hafiportrait.vercel.app,https://*.vercel.app

# Database Configuration (jika menggunakan database)
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
```

### Konfigurasi CORS di vercel.json

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
          "value": "Content-Type, Authorization, X-Requested-With, X-API-Key, X-User-ID, X-User-Username, X-User-Role"
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

## 🧪 Testing Checklist

### 1. Test API Connectivity
- [ ] Buka `/admin/test-login`
- [ ] Klik "Test API Connection"
- [ ] Periksa hasil di debug info
- [ ] Pastikan semua endpoint merespons

### 2. Test Login Functionality
- [ ] Masukkan credentials yang valid
- [ ] Klik "Test Login"
- [ ] Periksa response dari semua endpoint
- [ ] Pastikan setidaknya satu endpoint berhasil

### 3. Test CORS
- [ ] Buka browser developer tools
- [ ] Buka tab Network
- [ ] Coba login
- [ ] Periksa apakah ada CORS error

### 4. Test Production vs Preview
- [ ] Test di production: `https://hafiportrait.photography/admin/login`
- [ ] Test di preview: `https://your-preview-url.vercel.app/admin/login`
- [ ] Bandingkan hasilnya

## 📊 Debug Information

### Console Logs
Periksa console browser untuk:
- API URL yang digunakan
- Response status codes
- Error messages
- CORS errors

### Network Tab
Periksa Network tab di developer tools untuk:
- Request headers
- Response headers
- Response body
- Timing information

### Vercel Logs
```bash
# View all logs
vercel logs

# View specific function logs
vercel logs --function=api/auth/login

# View recent logs
vercel logs --since=1h
```

## 🚀 Deployment Checklist

### Sebelum Deploy
- [ ] Environment variables sudah diset
- [ ] CORS configuration sudah benar
- [ ] API routes sudah dibuat
- [ ] Database connection sudah dikonfigurasi

### Setelah Deploy
- [ ] Test API endpoints
- [ ] Test login functionality
- [ ] Periksa CORS headers
- [ ] Periksa error logs

### Monitoring
- [ ] Set up error monitoring (Sentry)
- [ ] Monitor API response times
- [ ] Track login success/failure rates
- [ ] Monitor CORS errors

## 🔄 Rollback Plan

Jika ada masalah serius:

1. **Rollback ke versi sebelumnya:**
   ```bash
   vercel rollback
   ```

2. **Disable preview deployments sementara:**
   - Buka Vercel dashboard
   - Nonaktifkan automatic deployments

3. **Fix issues di local:**
   - Test di local environment
   - Fix semua issues
   - Deploy ulang

## 📞 Support

Jika masalah masih berlanjut:

1. **Periksa Vercel Status:** https://vercel-status.com
2. **Vercel Documentation:** https://vercel.com/docs
3. **Community Support:** https://github.com/vercel/vercel/discussions

## 📝 Log Template

Gunakan template ini untuk melaporkan masalah:

```
**Environment:** Preview
**URL:** https://your-preview-url.vercel.app
**Error:** [Deskripsi error]
**Steps to reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected behavior:** [Apa yang seharusnya terjadi]
**Actual behavior:** [Apa yang sebenarnya terjadi]

**Debug info:**
- Console logs: [Paste console logs]
- Network tab: [Paste network info]
- Environment variables: [List relevant env vars]
```

---

**Dibuat oleh:** AI Assistant  
**Tanggal:** 2024  
**Versi:** 1.0.0