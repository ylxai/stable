# 🕐 External Cron Setup - Solusi Vercel Cron Limit

## ❌ **Masalah:**
Vercel Free Plan hanya mengizinkan 2 cron jobs per hari, tapi deployment gagal.

## ✅ **Solusi:**

### **Opsi 1: Deploy Tanpa Cron (Tercepat)**
```bash
# Backup vercel.json asli
cp vercel.json vercel-with-cron.json

# Gunakan vercel.json tanpa cron
cp vercel-no-cron.json vercel.json

# Deploy
vercel --prod
```

### **Opsi 2: External Cron Service (Gratis)**

#### **A. Cron-job.org (Gratis, Reliable)**
1. Daftar di https://cron-job.org/en/
2. Buat cron job:
   - **URL**: `https://hafiportrait.photography/api/cron/event-status`
   - **Schedule**: `0 */6 * * *` (setiap 6 jam)
   - **Headers**: `Authorization: Bearer YOUR_CRON_SECRET`

#### **B. UptimeRobot (Gratis + Monitor)**
1. Daftar di https://uptimerobot.com/
2. Buat HTTP(s) monitor:
   - **URL**: `https://hafiportrait.photography/api/cron/event-status`
   - **Interval**: 6 hours
   - **Headers**: `Authorization: Bearer YOUR_CRON_SECRET`

#### **C. GitHub Actions (Gratis)**
```yaml
# .github/workflows/cron.yml
name: Event Status Cron
on:
  schedule:
    - cron: '0 */6 * * *'
jobs:
  cron:
    runs-on: ubuntu-latest
    steps:
      - name: Call Cron Endpoint
        run: |
          curl -X GET "https://hafiportrait.photography/api/cron/event-status" \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### **Opsi 3: VPS Cron (Sudah Ada Server)**
```bash
# Di VPS xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com
crontab -e

# Tambahkan:
0 */6 * * * curl -X GET "https://hafiportrait.photography/api/cron/event-status" -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🔧 **Environment Variables untuk Cron:**
```
CRON_SECRET=hafiportrait-cron-secret-2025
```

## 📋 **Langkah Deployment:**

### **Quick Fix (Deploy Sekarang):**
```bash
# 1. Remove cron dari vercel.json
cp vercel-no-cron.json vercel.json

# 2. Deploy
vercel --prod

# 3. Setup external cron (pilih salah satu opsi di atas)
```

### **Restore Cron Later:**
```bash
# Setelah upgrade Vercel plan atau setup external cron
cp vercel-with-cron.json vercel.json
```

## 🎯 **Rekomendasi:**
1. **Deploy dulu tanpa cron** (vercel-no-cron.json)
2. **Setup cron-job.org** (gratis, reliable)
3. **Test manual**: `https://hafiportrait.photography/api/cron/event-status`

**Cron job tetap berfungsi, hanya dipanggil dari external service instead of Vercel!** ✅