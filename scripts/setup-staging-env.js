#!/usr/bin/env node

/**
 * Setup Staging Environment
 * Auto-configure untuk Vercel staging/preview
 */

const fs = require('fs');
const path = require('path');
const EnvironmentDetector = require('./env-detector');

async function setupStagingEnvironment() {
  console.log('🔄 Setting up Staging Environment...');
  console.log('🎯 Target: Vercel Staging (hafiportrait-staging.vercel.app)');
  console.log('');

  const detector = new EnvironmentDetector();
  const config = detector.getEnvironmentConfig('staging');

  // Display environment info
  detector.displayEnvironmentInfo('staging');

  // Backup existing .env.local if exists
  await backupExistingEnv();

  // Generate .env.local for staging
  await generateEnvFile(config);

  // Validate configuration
  await validateConfiguration(config);

  console.log('\n✅ Staging environment setup complete!');
  console.log('🚀 Ready for: npm run build && npm start');
  console.log(`🌐 Staging URL: ${config.NEXT_PUBLIC_APP_URL}`);
  console.log('📦 Vercel preview deployment ready');
}

async function backupExistingEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(process.cwd(), `.env.local.backup.${timestamp}`);
    
    fs.copyFileSync(envPath, backupPath);
    console.log(`💾 Backed up existing .env.local to: ${path.basename(backupPath)}`);
  }
}

async function generateEnvFile(config) {
  console.log('📝 Generating .env.local for staging...');

  const envContent = `# Auto-generated Staging Environment
# Generated at: ${new Date().toISOString()}
# Target: Vercel Staging (Preview Deployments)

# Environment Configuration
NODE_ENV=${config.NODE_ENV}
NEXT_PUBLIC_ENV_MODE=${config.NEXT_PUBLIC_ENV_MODE}
NEXT_PUBLIC_APP_URL=${config.NEXT_PUBLIC_APP_URL}

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${config.NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.NEXT_PUBLIC_SUPABASE_ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${config.SUPABASE_SERVICE_ROLE_KEY}

# Authentication
JWT_SECRET=${config.JWT_SECRET}

# Staging Specific
NEXT_TELEMETRY_DISABLED=1
NEXT_PRIVATE_STANDALONE=true

# Staging Debug (more verbose than production)
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_ENV_INFO=true
`;

  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Generated .env.local');
}

async function validateConfiguration(config) {
  console.log('🔍 Validating staging configuration...');

  const checks = [
    {
      name: 'NODE_ENV',
      test: config.NODE_ENV === 'production',
      value: config.NODE_ENV
    },
    {
      name: 'Staging URL',
      test: config.NEXT_PUBLIC_APP_URL.includes('vercel.app'),
      value: config.NEXT_PUBLIC_APP_URL
    },
    {
      name: 'HTTPS Protocol',
      test: config.NEXT_PUBLIC_APP_URL.startsWith('https://'),
      value: 'HTTPS enabled'
    },
    {
      name: 'Supabase URL',
      test: config.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co'),
      value: config.NEXT_PUBLIC_SUPABASE_URL
    },
    {
      name: 'JWT Secret',
      test: config.JWT_SECRET.includes('staging'),
      value: config.JWT_SECRET.substring(0, 20) + '...'
    }
  ];

  checks.forEach(check => {
    const status = check.test ? '✅' : '❌';
    console.log(`   ${status} ${check.name}: ${check.value}`);
  });

  const allPassed = checks.every(check => check.test);
  
  if (allPassed) {
    console.log('✅ All staging configuration checks passed');
  } else {
    console.log('⚠️ Some staging configuration checks failed');
    process.exit(1);
  }
}

// Run setup
setupStagingEnvironment().catch(error => {
  console.error('❌ Staging setup failed:', error);
  process.exit(1);
});