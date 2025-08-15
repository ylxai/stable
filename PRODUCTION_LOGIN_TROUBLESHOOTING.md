# Troubleshooting Login di Production Environment

## 🚨 Masalah: Login Tidak Bisa di Production

Dokumen ini menjelaskan langkah-langkah troubleshooting untuk masalah login yang tidak berfungsi di environment production.

## 🔍 Langkah-langkah Debugging

### 1. Jalankan Production Monitor

Gunakan script monitoring untuk mengecek status production:

```bash
# Jalankan script monitoring
chmod +x monitor-production.sh
./monitor-production.sh
```

Script ini akan mengecek:
- Health check endpoint
- Environment variables
- Database connection
- CORS configuration
- Login endpoint
- SSL certificate
- Response time

### 2. Periksa Environment Variables

Pastikan semua environment variables sudah diset dengan benar:

```bash
# List environment variables
vercel env ls

# Periksa environment variables untuk production
vercel env ls | grep production
```

### 3. Test Health Check

Buka health check endpoint untuk melihat status sistem:
```
https://hafiportrait.photography/api/health
```

### 4. Gunakan Halaman Test

Buka halaman test untuk debugging:
```
https://hafiportrait.photography/admin/test-login
```

## 🐛 Masalah Umum dan Solusi

### Masalah 1: Database Connection Error

**Gejala:**
- Error 500 saat login
- Health check menunjukkan database unhealthy
- Logs menunjukkan database connection failed

**Solusi:**
1. Periksa Supabase connection:
   ```bash
   # Test database connection
   curl -X GET https://hafiportrait.photography/api/health
   ```

2. Periksa environment variables:
   ```bash
   vercel env ls | grep SUPABASE
   ```

3. Pastikan Supabase service aktif:
   - Buka Supabase dashboard
   - Periksa project status
   - Periksa database logs

### Masalah 2: Environment Variables Missing

**Gejala:**
- Error "Server configuration error"
- Health check menunjukkan missing environment variables
- Login gagal dengan error 500

**Solusi:**
1. Set environment variables yang diperlukan:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL production
   vercel env add SUPABASE_SERVICE_ROLE_KEY production
   vercel env add JWT_SECRET production
   ```

2. Verifikasi environment variables:
   ```bash
   vercel env ls
   ```

3. Redeploy aplikasi:
   ```bash
   vercel --prod
   ```

### Masalah 3: CORS Error

**Gejala:**
- Error di console browser: "CORS policy blocked"
- Network tab menunjukkan error CORS
- Login request gagal

**Solusi:**
1. Periksa CORS configuration:
   ```bash
   # Test CORS preflight
   curl -X OPTIONS \
     -H "Origin: https://hafiportrait.photography" \
     -H "Access-Control-Request-Method: POST" \
     https://hafiportrait.photography/api/auth/login
   ```

2. Update CORS headers di vercel.json
3. Periksa middleware CORS configuration

### Masalah 4: Authentication Error

**Gejala:**
- Login gagal dengan credentials yang benar
- Error 401 atau 500
- User tidak ditemukan

**Solusi:**
1. Periksa database users:
   ```sql
   SELECT * FROM admin_users WHERE is_active = true;
   ```

2. Periksa password hash:
   ```sql
   SELECT username, password_hash FROM admin_users;
   ```

3. Reset user password jika diperlukan

### Masalah 5: Session Creation Error

**Gejala:**
- Login berhasil tapi tidak redirect ke dashboard
- Error "Gagal membuat sesi"
- Cookie tidak terset

**Solusi:**
1. Periksa session table:
   ```sql
   SELECT * FROM admin_sessions ORDER BY created_at DESC LIMIT 5;
   ```

2. Periksa cookie settings di browser
3. Periksa secure cookie configuration

### Masalah 6: Timeout Error

**Gejala:**
- Request timeout
- Error "Request timeout"
- Login lambat

**Solusi:**
1. Periksa response time:
   ```bash
   # Test response time
   time curl -s https://hafiportrait.photography/api/health
   ```

2. Periksa Vercel function timeout
3. Optimize database queries

## 🔧 Konfigurasi yang Diperlukan

### Environment Variables untuk Production

```bash
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://hafiportrait.photography
NEXT_PUBLIC_API_BASE_URL=https://hafiportrait.photography
NODE_ENV=production

# CORS Configuration
ALLOWED_ORIGINS=https://hafiportrait.photography,https://www.hafiportrait.photography
```

### Database Schema Requirements

Pastikan tabel berikut ada di database:

```sql
-- Admin users table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin sessions table
CREATE TABLE admin_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES admin_users(id),
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing Checklist

### 1. Health Check
- [ ] `/api/health` returns 200
- [ ] Database status is healthy
- [ ] Environment variables are configured
- [ ] Response time < 1 second

### 2. API Endpoints
- [ ] `/api/auth/test` returns 200
- [ ] `/api/auth/login` accepts POST requests
- [ ] CORS preflight requests work
- [ ] OPTIONS requests return 200

### 3. Authentication
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials returns 401
- [ ] Session cookie is set
- [ ] Redirect to dashboard works

### 4. Security
- [ ] Password validation works
- [ ] Input sanitization works
- [ ] Rate limiting is in place
- [ ] SSL certificate is valid

## 📊 Monitoring dan Logs

### Vercel Logs
```bash
# View all logs
vercel logs

# View specific function logs
vercel logs --function=api/auth/login

# View recent logs
vercel logs --since=1h

# View error logs
vercel logs --function=api/auth/login | grep ERROR
```

### Database Logs
- Periksa Supabase dashboard untuk database logs
- Monitor query performance
- Check for connection errors

### Browser Console
- Periksa Network tab untuk request/response
- Periksa Console tab untuk JavaScript errors
- Periksa Application tab untuk cookies

## 🚀 Deployment Checklist

### Sebelum Deploy
- [ ] Environment variables sudah diset
- [ ] Database schema sudah dibuat
- [ ] Test users sudah dibuat
- [ ] CORS configuration sudah benar

### Setelah Deploy
- [ ] Health check endpoint berfungsi
- [ ] Login dengan test credentials berhasil
- [ ] Session management berfungsi
- [ ] Error handling berfungsi

### Monitoring
- [ ] Set up error monitoring (Sentry)
- [ ] Monitor API response times
- [ ] Track login success/failure rates
- [ ] Monitor database performance

## 🔄 Rollback Plan

Jika ada masalah serius:

1. **Rollback ke versi sebelumnya:**
   ```bash
   vercel rollback
   ```

2. **Disable production deployment sementara:**
   - Buka Vercel dashboard
   - Nonaktifkan automatic deployments

3. **Fix issues di staging:**
   - Test di preview environment
   - Fix semua issues
   - Deploy ulang ke production

## 📞 Support

Jika masalah masih berlanjut:

1. **Periksa Vercel Status:** https://vercel-status.com
2. **Periksa Supabase Status:** https://status.supabase.com
3. **Vercel Documentation:** https://vercel.com/docs
4. **Supabase Documentation:** https://supabase.com/docs

## 📝 Log Template

Gunakan template ini untuk melaporkan masalah:

```
**Environment:** Production
**URL:** https://hafiportrait.photography
**Error:** [Deskripsi error]
**Steps to reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected behavior:** [Apa yang seharusnya terjadi]
**Actual behavior:** [Apa yang sebenarnya terjadi]

**Debug info:**
- Health check: [Paste health check response]
- Console logs: [Paste console logs]
- Network tab: [Paste network info]
- Environment variables: [List relevant env vars]
- Database status: [Database connection status]
```

## 🎯 Quick Fix Commands

```bash
# Quick health check
curl -s https://hafiportrait.photography/api/health | jq

# Test login endpoint
curl -X POST https://hafiportrait.photography/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'

# Check environment variables
vercel env ls

# View recent logs
vercel logs --since=10m

# Redeploy
vercel --prod
```

---

**Dibuat oleh:** AI Assistant  
**Tanggal:** 2024  
**Versi:** 1.0.0