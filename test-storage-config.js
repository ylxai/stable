/**
 * Test Smart Storage Configuration
 * Tests if environment variables and storage components are working
 */

console.log('🧪 Testing Smart Storage Configuration...');
console.log('========================================');

async function testStorageConfig() {
  try {
    // Test 1: Check environment variables
    console.log('\n📋 Test 1: Environment Variables');
    console.log('--------------------------------');
    
    const envVars = {
      'CLOUDFLARE_R2_ACCOUNT_ID': process.env.CLOUDFLARE_R2_ACCOUNT_ID,
      'CLOUDFLARE_R2_ACCESS_KEY_ID': process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      'CLOUDFLARE_R2_SECRET_ACCESS_KEY': process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      'CLOUDFLARE_R2_BUCKET_NAME': process.env.CLOUDFLARE_R2_BUCKET_NAME,
      'CLOUDFLARE_R2_CUSTOM_DOMAIN': process.env.CLOUDFLARE_R2_CUSTOM_DOMAIN,
      'SMART_STORAGE_ENABLED': process.env.SMART_STORAGE_ENABLED
    };

    let envConfigured = 0;
    for (const [key, value] of Object.entries(envVars)) {
      if (value && value !== 'your-account-id-here' && value !== 'your-access-key-here' && value !== 'your-secret-key-here') {
        console.log(`✅ ${key}: SET`);
        envConfigured++;
      } else {
        console.log(`❌ ${key}: NOT SET or placeholder`);
      }
    }

    console.log(`\n📊 Environment Status: ${envConfigured}/6 variables configured`);

    // Test 2: Check if Smart Storage Manager can be loaded
    console.log('\n🔧 Test 2: Smart Storage Manager');
    console.log('--------------------------------');
    
    try {
      const SmartStorageManager = require('./src/lib/smart-storage-manager.js');
      console.log('✅ Smart Storage Manager: Loaded successfully');
      
      const manager = new SmartStorageManager();
      console.log('✅ Smart Storage Manager: Instance created');
      
      // Test storage report without initialization (should work)
      const report = manager.getStorageReport();
      console.log('✅ Storage Report: Generated');
      console.log('   Tiers available:', Object.keys(report));
      
    } catch (error) {
      console.log('❌ Smart Storage Manager: Failed to load');
      console.log('   Error:', error.message);
    }

    // Test 3: Check Cloudflare R2 Storage
    console.log('\n☁️ Test 3: Cloudflare R2 Storage');
    console.log('--------------------------------');
    
    try {
      const CloudflareR2Storage = require('./src/lib/cloudflare-r2-storage.js');
      console.log('✅ Cloudflare R2 Storage: Loaded successfully');
      
      const r2 = new CloudflareR2Storage();
      console.log('✅ Cloudflare R2 Storage: Instance created');
      
      // Check if credentials are available
      if (r2.config.accountId && r2.config.accessKeyId && r2.config.secretAccessKey) {
        console.log('✅ R2 Credentials: Available');
        console.log(`   Bucket: ${r2.config.bucketName}`);
        console.log(`   Custom Domain: ${r2.config.customDomain || 'Not set'}`);
        
        // Try to initialize (this will test credentials)
        try {
          const initResult = await r2.initialize();
          if (initResult) {
            console.log('✅ R2 Initialization: Success');
            
            // Test connection
            const connectionTest = await r2.testConnection();
            if (connectionTest) {
              console.log('✅ R2 Connection: Success');
            } else {
              console.log('❌ R2 Connection: Failed');
            }
          } else {
            console.log('❌ R2 Initialization: Failed');
          }
        } catch (initError) {
          console.log('❌ R2 Initialization: Error');
          console.log('   Error:', initError.message);
        }
      } else {
        console.log('❌ R2 Credentials: Missing or incomplete');
        console.log('   Account ID:', r2.config.accountId ? 'SET' : 'NOT SET');
        console.log('   Access Key:', r2.config.accessKeyId ? 'SET' : 'NOT SET');
        console.log('   Secret Key:', r2.config.secretAccessKey ? 'SET' : 'NOT SET');
      }
      
    } catch (error) {
      console.log('❌ Cloudflare R2 Storage: Failed to load');
      console.log('   Error:', error.message);
    }

    // Test 4: Test API endpoints (if server is running)
    console.log('\n🌐 Test 4: API Endpoints');
    console.log('------------------------');
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/storage/status');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Storage Status API: Working');
        console.log('   R2 Available:', data.data?.systemHealth?.cloudflareR2Available ? 'Yes' : 'No');
        console.log('   Smart Storage Photos:', data.data?.smartStorageAdoption?.smartStoragePhotos || 0);
        console.log('   Total Photos:', data.data?.smartStorageAdoption?.totalPhotos || 0);
      } else {
        console.log('❌ Storage Status API: HTTP', response.status);
      }
    } catch (apiError) {
      console.log('⚠️ Storage Status API: Server not running or not accessible');
      console.log('   Start server with: npm run dev');
    }

    // Test 5: Check dependencies
    console.log('\n📦 Test 5: Dependencies');
    console.log('-----------------------');
    
    try {
      require('@aws-sdk/client-s3');
      console.log('✅ AWS SDK S3: Available');
    } catch (error) {
      console.log('❌ AWS SDK S3: Missing (npm install @aws-sdk/client-s3)');
    }

    try {
      require('sharp');
      console.log('✅ Sharp: Available');
    } catch (error) {
      console.log('⚠️ Sharp: Missing (npm install sharp) - Optional for compression');
    }

    // Summary
    console.log('\n🎯 Configuration Summary');
    console.log('========================');
    
    if (envConfigured >= 5) {
      console.log('✅ Environment: Well configured');
      console.log('🚀 Ready for Smart Storage usage!');
    } else if (envConfigured >= 3) {
      console.log('⚠️ Environment: Partially configured');
      console.log('🔧 Some credentials missing');
    } else {
      console.log('❌ Environment: Needs configuration');
      console.log('📋 Please setup R2 credentials');
    }

    console.log('\n📋 Next Steps:');
    if (envConfigured < 5) {
      console.log('1. Get R2 credentials from Cloudflare Dashboard');
      console.log('2. Update .env.local with actual credentials');
      console.log('3. Follow GET_R2_CREDENTIALS.md for detailed guide');
      console.log('4. Restart server: npm run dev');
    } else {
      console.log('1. Test photo upload with Smart Storage');
      console.log('2. Monitor storage analytics');
      console.log('3. Deploy to production with Vercel');
    }

    console.log('\n🔗 Useful Commands:');
    console.log('   Test integration: node tmp_rovodev_test-smart-storage-integration.js');
    console.log('   Check R2 connection: node DSLR-System/Testing/test-cloudflare-r2-connection.js');
    console.log('   Storage status: curl http://localhost:3000/api/admin/storage/status');

  } catch (error) {
    console.error('❌ Configuration test failed:', error);
  }
}

// Run the test
testStorageConfig();