#!/bin/bash

# 🚀 Setup Vercel Environment Variables untuk HafiPortrait Photography
# Script untuk mengatur semua environment variables sekaligus

echo "🔧 Setting up Vercel Environment Variables..."
echo "📋 Project: HafiPortrait Photography"
echo ""

# Pastikan Vercel CLI terinstall
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI tidak ditemukan. Install dulu dengan:"
    echo "npm i -g vercel"
    exit 1
fi

echo "🎯 Setting Socket.IO Configuration..."
vercel env add NEXT_PUBLIC_WS_URL production <<< "https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com"
vercel env add NEXT_PUBLIC_SOCKETIO_URL production <<< "https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com"
vercel env add NEXT_PUBLIC_USE_SOCKETIO production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_FALLBACK production <<< "true"
vercel env add NEXT_PUBLIC_POLLING_ENABLED production <<< "true"
vercel env add NEXT_PUBLIC_WS_HEALTH_URL production <<< "https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com/health"

echo "🗄️ Setting Database Configuration..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "https://azspktldiblhrwebzmwq.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8"
vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE"

echo "🔐 Setting Authentication..."
vercel env add JWT_SECRET production <<< "hafiportrait-production-secret-key-2025"

echo "☁️ Setting Cloudflare R2 Storage..."
vercel env add CLOUDFLARE_R2_ACCOUNT_ID production <<< "b14090010faed475102a62eca152b67f"
vercel env add CLOUDFLARE_R2_ACCESS_KEY_ID production <<< "51c66dbac26827b84132186428eb3492"
vercel env add CLOUDFLARE_R2_SECRET_ACCESS_KEY production <<< "65fe1143600bd9ef97a5c76b4ae924259779e0d0815ce44f09a1844df37fe3f1"
vercel env add CLOUDFLARE_R2_BUCKET_NAME production <<< "hafiportrait-photos"
vercel env add CLOUDFLARE_R2_CUSTOM_DOMAIN production <<< "photos.hafiportrait.photography"
vercel env add CLOUDFLARE_R2_PUBLIC_URL production <<< "https://photos.hafiportrait.photography"
vercel env add CLOUDFLARE_R2_REGION production <<< "auto"
vercel env add CLOUDFLARE_R2_ENDPOINT production <<< "https://b14090010faed475102a62eca152b67f.r2.cloudflarestorage.com"

echo "📁 Setting Google Drive Storage..."
vercel env add GOOGLE_DRIVE_CLIENT_ID production <<< "1098208255243-i92ah6oithsvfhvq4fq62tfr8armjh1a.apps.googleusercontent.com"
vercel env add GOOGLE_DRIVE_CLIENT_SECRET production <<< "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"
vercel env add GOOGLE_DRIVE_REFRESH_TOKEN production <<< "1//0erDLcuFyYiK3CgYIARAAGA4SNwF-L9Ir3z2Ib2mbiPwCs-c3K_JeLfkZT0Zwxs-AMCJqyLsWs6nM8gk6Y4KLvrofLQHF9Qwcifg"
vercel env add GOOGLE_DRIVE_FOLDER_ID production <<< "root"
vercel env add GOOGLE_DRIVE_FOLDER_NAME production <<< "HafiPortrait-Photos"
vercel env add GOOGLE_DRIVE_SHARED_FOLDER production <<< "false"

echo "🎛️ Setting Smart Storage Configuration..."
vercel env add SMART_STORAGE_ENABLED production <<< "true"
vercel env add SMART_STORAGE_DEFAULT_TIER production <<< "cloudflareR2"
vercel env add SMART_STORAGE_PRIMARY production <<< "cloudflareR2"
vercel env add SMART_STORAGE_SECONDARY production <<< "googleDrive"
vercel env add SMART_STORAGE_TERTIARY production <<< "local"
vercel env add SMART_STORAGE_COMPRESSION_QUALITY production <<< "85"

echo "🌍 Setting Environment Configuration..."
vercel env add NODE_ENV production <<< "production"
vercel env add NEXT_PUBLIC_ENV_MODE production <<< "production"
vercel env add NEXT_PUBLIC_APP_URL production <<< "https://hafiportrait.photography"
vercel env add NEXT_TELEMETRY_DISABLED production <<< "1"

echo ""
echo "✅ Semua environment variables berhasil ditambahkan!"
echo ""
echo "🚀 Langkah selanjutnya:"
echo "1. Verifikasi di Vercel Dashboard: https://vercel.com/dashboard"
echo "2. Deploy ulang aplikasi: vercel --prod"
echo "3. Test Socket.IO connection setelah deployment"
echo ""
echo "🎯 Socket.IO Server: https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com"
echo "📊 Health Check: https://xcyrexmwrwjq.ap-southeast-1.clawcloudrun.com/health"