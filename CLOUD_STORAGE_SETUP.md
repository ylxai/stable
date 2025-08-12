# 🔐 Cloud Storage Authentication Setup

## 🚨 **Error: "No saved tokens found, authentication required"**

Error ini terjadi karena Smart Storage Manager membutuhkan credentials untuk cloud storage providers. Berikut cara mengatasinya:

## 🏗️ **Setup Cloud Storage Credentials**

### **1. Cloudflare R2 (Tier 1 - Primary Storage)**

#### **A. Dapatkan Credentials dari Cloudflare:**
1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pilih **R2 Object Storage** dari sidebar
3. Klik **Manage R2 API tokens**
4. Klik **Create API token**
5. Pilih **Custom token** dengan permissions:
   - `Zone:Zone:Read`
   - `Zone:Zone Settings:Edit`
   - `Account:Cloudflare R2:Edit`
6. Copy credentials yang dihasilkan

#### **B. Buat R2 Bucket:**
1. Di R2 Dashboard, klik **Create bucket**
2. Nama bucket: `hafiportrait-photos` (atau sesuai keinginan)
3. Pilih region terdekat
4. Klik **Create bucket**

#### **C. Tambahkan ke Environment Variables:**
```bash
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id-here
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key-here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key-here
CLOUDFLARE_R2_BUCKET_NAME=hafiportrait-photos
CLOUDFLARE_R2_PUBLIC_URL=https://your-bucket.your-account.r2.cloudflarestorage.com
```

### **2. Google Drive (Tier 2 - Secondary Storage)**

#### **A. Setup Google Cloud Project:**
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih existing project
3. Enable **Google Drive API**:
   - Navigation menu → APIs & Services → Library
   - Search "Google Drive API" → Enable

#### **B. Buat Service Account:**
1. APIs & Services → Credentials
2. Create Credentials → Service Account
3. Nama: `hafiportrait-storage`
4. Download JSON key file

#### **C. Setup OAuth2 (Alternative):**
1. APIs & Services → Credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
5. Copy Client ID dan Client Secret

#### **D. Generate Refresh Token:**
```bash
# Install Google Auth Library
npm install googleapis

# Run this script to get refresh token
node scripts/generate-google-refresh-token.js
```

#### **E. Tambahkan ke Environment Variables:**
```bash
# Google Drive Configuration
GOOGLE_DRIVE_CLIENT_ID=your-client-id-here
GOOGLE_DRIVE_CLIENT_SECRET=your-client-secret-here
GOOGLE_DRIVE_REFRESH_TOKEN=your-refresh-token-here
GOOGLE_DRIVE_FOLDER_ID=your-folder-id-here
```

### **3. Local Storage (Tier 3 - Fallback)**
```bash
# Local Storage Configuration
LOCAL_BACKUP_PATH=./DSLR-System/Backup/dslr-backup
```

## 📝 **Cara Menyimpan Environment Variables**

### **A. Development (Local):**
1. **Edit .env.local:**
   ```bash
   nano .env.local
   # atau
   code .env.local
   ```

2. **Tambahkan semua credentials di atas**

3. **Restart development server:**
   ```bash
   npm run dev
   ```

### **B. Production (Vercel Dashboard):**

#### **Manual di Vercel Dashboard:**
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan satu per satu:
   - Name: `CLOUDFLARE_R2_ACCOUNT_ID`
   - Value: `your-account-id`
   - Environment: Production, Preview, Development
   - Klik **Save**

#### **Via Vercel CLI:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add CLOUDFLARE_R2_ACCOUNT_ID
vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID
vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY
vercel env add CLOUDFLARE_R2_BUCKET_NAME
vercel env add GOOGLE_DRIVE_CLIENT_ID
vercel env add GOOGLE_DRIVE_CLIENT_SECRET
vercel env add GOOGLE_DRIVE_REFRESH_TOKEN
```

### **C. Production (Other Platforms):**

#### **Railway:**
```bash
railway variables set CLOUDFLARE_R2_ACCOUNT_ID=your-value
```

#### **Heroku:**
```bash
heroku config:set CLOUDFLARE_R2_ACCOUNT_ID=your-value
```

#### **Docker/VPS:**
```bash
# Create .env file
echo "CLOUDFLARE_R2_ACCOUNT_ID=your-value" >> .env
```

## 🧪 **Test Configuration**

### **1. Test Cloudflare R2:**
```bash
node DSLR-System/Testing/test-cloudflare-r2-connection.js
```

### **2. Test Google Drive:**
```bash
node DSLR-System/Testing/test-google-drive-connection.js
```

### **3. Test Smart Storage Integration:**
```bash
node tmp_rovodev_test-smart-storage-integration.js
```

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. "No saved tokens found":**
- ✅ Check environment variables are set
- ✅ Restart development server
- ✅ Verify credentials are correct

#### **2. "Access denied" for Cloudflare R2:**
- ✅ Check API token permissions
- ✅ Verify account ID is correct
- ✅ Ensure bucket exists

#### **3. "Invalid credentials" for Google Drive:**
- ✅ Check OAuth2 setup
- ✅ Regenerate refresh token
- ✅ Verify API is enabled

#### **4. Environment variables not loading:**
- ✅ Check file name (.env.local not .env.local.txt)
- ✅ No spaces around = sign
- ✅ Restart server after changes

### **Debug Commands:**
```bash
# Check if env vars are loaded
node -e "console.log(process.env.CLOUDFLARE_R2_ACCOUNT_ID)"

# Test storage connections
curl http://localhost:3000/api/admin/storage/status

# Check Smart Storage health
curl http://localhost:3000/api/admin/storage/analytics
```

## 🚀 **Quick Setup Script**

Saya akan buat script untuk memudahkan setup:

```bash
# Run setup script
node scripts/setup-cloud-storage.js
```

Script ini akan:
1. Check existing credentials
2. Guide you through setup process
3. Test connections
4. Update environment files

## 📊 **Verification**

Setelah setup, Anda harus melihat:
- ✅ Storage Status API menunjukkan cloud providers available
- ✅ Tier selection memilih Cloudflare R2 untuk premium photos
- ✅ Upload photos menggunakan Smart Storage (bukan fallback)
- ✅ Analytics menunjukkan Smart Storage adoption > 0%