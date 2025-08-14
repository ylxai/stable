# 🚨 Fix Backup Issues - Google Drive Auth & Quality

## ❌ **Issues Found:**

### **1. Google Drive Authentication Failed**
```
"No access, refresh token, API key or refresh handler callback is set."
```

### **2. Backup Quality Issue**
- File `PHOTO-2024-12-08-11-49-43 2.jpg` kualitas parah
- Backup mengambil compressed version, bukan original dari R2

## 🔧 **SOLUTIONS:**

### **Fix 1: Google Drive Authentication**

#### **A. Check Environment Variables:**
```bash
# Verify these are set in Vercel:
GOOGLE_DRIVE_CLIENT_ID=1098208255243-i92ah6oithsvfhvq4fq62tfr8armjh1a.apps.googleusercontent.com
GOOGLE_DRIVE_CLIENT_SECRET=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
GOOGLE_DRIVE_REFRESH_TOKEN=1//0erDLcuFyYiK3CgYIARAAGA4SNwF-L9Ir3z2Ib2mbiPwCs-c3K_JeLfkZT0Zwxs-AMCJqyLsWs6nM8gk6Y4KLvrofLQHF9Qwcifg
```

#### **B. Add Missing Environment Variables to Vercel:**
```bash
vercel env add GOOGLE_DRIVE_CLIENT_ID production
vercel env add GOOGLE_DRIVE_CLIENT_SECRET production  
vercel env add GOOGLE_DRIVE_REFRESH_TOKEN production
vercel env add GOOGLE_DRIVE_FOLDER_NAME production
```

### **Fix 2: Backup Quality Issue**

#### **Problem:** 
EventStorageManager mengambil foto dari database `url` field yang sudah compressed, bukan original dari R2.

#### **Solution:**
Update `downloadPhotoBuffer()` untuk prioritas original quality:

```javascript
async downloadPhotoBuffer(photo) {
  try {
    // PRIORITY 1: Download original from R2 (highest quality)
    if (photo.storage_provider === 'cloudflare-r2' && photo.storage_path) {
      console.log(`📥 Downloading ORIGINAL from R2: ${photo.storage_path}`);
      return await this.smartStorageManager.cloudflareR2.downloadPhoto(photo.storage_path);
    }
    
    // PRIORITY 2: Download from Google Drive if stored there
    else if (photo.storage_provider === 'google-drive' && photo.storage_file_id) {
      console.log(`📥 Downloading from Google Drive: ${photo.storage_file_id}`);
      return await this.smartStorageManager.googleDrive.downloadPhoto(photo.storage_file_id);
    }
    
    // PRIORITY 3: Local storage
    else if (photo.storage_provider === 'local' && photo.storage_path) {
      console.log(`📥 Downloading from local: ${photo.storage_path}`);
      const fs = require('fs').promises;
      return await fs.readFile(photo.storage_path);
    }
    
    // LAST RESORT: Download from public URL (compressed)
    else if (photo.url) {
      console.log(`⚠️ Downloading from public URL (may be compressed): ${photo.url}`);
      const response = await fetch(photo.url);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      return Buffer.from(await response.arrayBuffer());
    }
    
    else {
      throw new Error(`No valid storage location found for photo ${photo.id}`);
    }
  } catch (error) {
    console.error(`❌ Failed to download photo ${photo.id}:`, error);
    throw error;
  }
}
```

## 🚀 **Quick Fix Commands:**

### **1. Add Google Drive Environment Variables:**
```bash
# Add to Vercel production
vercel env add GOOGLE_DRIVE_CLIENT_ID production
# Enter: 1098208255243-i92ah6oithsvfhvq4fq62tfr8armjh1a.apps.googleusercontent.com

vercel env add GOOGLE_DRIVE_CLIENT_SECRET production
# Enter: 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

vercel env add GOOGLE_DRIVE_REFRESH_TOKEN production
# Enter: 1//0erDLcuFyYiK3CgYIARAAGA4SNwF-L9Ir3z2Ib2mbiPwCs-c3K_JeLfkZT0Zwxs-AMCJqyLsWs6nM8gk6Y4KLvrofLQHF9Qwcifg

vercel env add GOOGLE_DRIVE_FOLDER_NAME production
# Enter: HafiPortrait-Photos
```

### **2. Update Code & Deploy:**
```bash
# Fix downloadPhotoBuffer method
# Deploy updated code
vercel --prod
```

### **3. Test Backup:**
```bash
# Test backup API after fixes
curl -X POST "https://hafiportrait.photography/api/admin/events/8012fcc9-9e5c-4448-bd70-3e7f1add8692/backup" \
     -H "Content-Type: application/json" \
     -d '{"compressionQuality": 1.0}'
```

## 📊 **Expected Results After Fix:**

### **Before:**
- ❌ Google Drive auth failed
- ❌ Backup quality poor (compressed version)
- ❌ File: `PHOTO-2024-12-08-11-49-43 2.jpg` (low quality)

### **After:**
- ✅ Google Drive auth working
- ✅ Backup original quality from R2
- ✅ File: High quality original from Cloudflare R2
- ✅ Backup API returns success

---

**🎯 Priority: Fix Google Drive environment variables first, then update backup quality logic!**