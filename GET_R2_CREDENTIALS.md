# 🔐 Cara Mendapatkan Cloudflare R2 Credentials

## 📋 **Setup yang Anda Butuhkan:**
- ✅ Bucket: `hafiportrait-photos` (sudah ada)
- ✅ Custom Domain: `photos.hafiportrait.photography` (sudah dikonfigurasi)
- ⚠️ API Credentials: Perlu didapatkan

## 🚀 **Langkah-langkah Mendapatkan R2 Credentials:**

### **1. Login ke Cloudflare Dashboard**
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Login dengan akun Anda

### **2. Navigasi ke R2 Object Storage**
1. Di sidebar kiri, klik **R2 Object Storage**
2. Anda akan melihat bucket `hafiportrait-photos`

### **3. Dapatkan Account ID**
1. Di halaman R2, lihat di bagian atas
2. Copy **Account ID** (format: 32 karakter alphanumeric)
3. Contoh: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### **4. Buat R2 API Token**
1. Klik **Manage R2 API tokens** (di sebelah kanan)
2. Klik **Create API token**
3. Pilih **Custom token**
4. **Token name**: `HafiPortrait Smart Storage`
5. **Permissions**:
   - Account: `Cloudflare R2:Edit`
   - Zone Resources: `Include - All zones`
6. **Account Resources**: `Include - All accounts`
7. **Client IP Address Filtering**: `Is in - 0.0.0.0/0` (atau kosongkan)
8. **TTL**: `Custom - 1 year`
9. Klik **Continue to summary**
10. Klik **Create Token**

### **5. Copy Credentials**
Setelah token dibuat, Anda akan mendapat:
- **Access Key ID**: Contoh `a1b2c3d4e5f6g7h8i9j0`
- **Secret Access Key**: Contoh `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0`

⚠️ **PENTING**: Copy dan simpan credentials ini sekarang! Anda tidak bisa melihatnya lagi setelah menutup halaman.

## 🔧 **Update .env.local dengan Credentials Anda:**

```bash
# Edit file .env.local
nano .env.local
# atau
code .env.local
```

**Ganti baris berikut:**
```bash
# SEBELUM:
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key-here

# SESUDAH (dengan credentials Anda):
CLOUDFLARE_R2_ACCOUNT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
CLOUDFLARE_R2_ACCESS_KEY_ID=a1b2c3d4e5f6g7h8i9j0
CLOUDFLARE_R2_SECRET_ACCESS_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

## 🧪 **Test Konfigurasi:**

### **1. Restart Development Server:**
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### **2. Test R2 Connection:**
```bash
node DSLR-System/Testing/test-cloudflare-r2-connection.js
```

### **3. Test Smart Storage Integration:**
```bash
node tmp_rovodev_test-smart-storage-integration.js
```

### **4. Test via API:**
```bash
# Test storage status
curl http://localhost:3000/api/admin/storage/status

# Test tier selection
curl -X POST http://localhost:3000/api/admin/storage/tier-selection \
  -H "Content-Type: application/json" \
  -d '{"fileSize": 2048000, "albumName": "Official", "isPremium": true}'
```

## ✅ **Hasil yang Diharapkan:**

Setelah konfigurasi benar, Anda akan melihat:

### **Storage Status API:**
```json
{
  "systemHealth": {
    "cloudflareR2Available": true,
    "googleDriveAvailable": false,
    "localStorageAvailable": true
  }
}
```

### **Tier Selection:**
```json
{
  "selectedTier": {
    "tier": "cloudflareR2",
    "compression": "premium",
    "priority": "high"
  }
}
```

### **Photo Upload:**
- URLs akan menggunakan: `https://photos.hafiportrait.photography/events/event-id/album/photo.jpg`
- Smart Storage adoption rate akan mulai meningkat
- Upload akan lebih cepat dengan CDN

## 🔒 **Keamanan:**

### **Environment Variables untuk Production:**
Jika deploy ke Vercel/production:

1. **Vercel Dashboard:**
   - Settings → Environment Variables
   - Tambahkan semua `CLOUDFLARE_R2_*` variables

2. **Vercel CLI:**
   ```bash
   vercel env add CLOUDFLARE_R2_ACCOUNT_ID
   vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID
   vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY
   ```

### **Jangan Commit Credentials:**
- ✅ `.env.local` sudah di `.gitignore`
- ❌ Jangan commit credentials ke Git
- ✅ Gunakan environment variables untuk production

## 🎯 **Troubleshooting:**

### **Error: "Missing Cloudflare R2 credentials"**
- Check apakah semua 3 credentials sudah diisi
- Restart development server

### **Error: "Access denied"**
- Check API token permissions
- Pastikan Account ID benar

### **Error: "Bucket not found"**
- Pastikan bucket name: `hafiportrait-photos`
- Check bucket masih ada di R2 dashboard

### **URLs tidak menggunakan custom domain**
- Check `CLOUDFLARE_R2_CUSTOM_DOMAIN=photos.hafiportrait.photography`
- Pastikan custom domain sudah dikonfigurasi di Cloudflare

## 📞 **Bantuan:**
Jika ada masalah, jalankan:
```bash
# Debug storage configuration
node -e "console.log('R2 Account ID:', process.env.CLOUDFLARE_R2_ACCOUNT_ID ? 'SET' : 'NOT SET')"
node -e "console.log('R2 Access Key:', process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? 'SET' : 'NOT SET')"
node -e "console.log('R2 Secret:', process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET')"
```