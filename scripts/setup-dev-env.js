#!/usr/bin/env node

/**
 * Setup Development Environment
 * Auto-configure untuk VPS CloudRun development
 */

const fs = require('fs');
const path = require('path');
const EnvironmentDetector = require('./env-detector');

async function setupDevelopmentEnvironment() {
  console.log('🔧 Setting up Development Environment...');
  console.log('🎯 Target: VPS CloudRun (Development & Testing)');
  console.log('');

  const detector = new EnvironmentDetector();
  const config = detector.getEnvironmentConfig('development');

  // Display environment info
  detector.displayEnvironmentInfo('development');

  // Backup existing .env.local if exists
  await backupExistingEnv();

  // Generate .env.local for development
  await generateEnvFile(config);

  // Validate configuration
  await validateConfiguration(config);

  console.log('\n✅ Development environment setup complete!');
  console.log('🚀 Ready to run: npm run dev');
  console.log(`📱 Access at: ${config.NEXT_PUBLIC_APP_URL}`);
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
  console.log('📝 Generating .env.local for development...');

  const envContent = `# Auto-generated Development Environment
# Generated at: ${new Date().toISOString()}
# Target: VPS CloudRun (Development & Testing)

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

# Development Specific
PORT=3000
NEXT_TELEMETRY_DISABLED=1

# Development Tools
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_ENV_INFO=true
`;

  const envPath = path.join(process.cwd(), '.env.local');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Generated .env.local');
}

async function validateConfiguration(config) {
  console.log('🔍 Validating configuration...');

  const checks = [
    {
      name: 'NODE_ENV',
      test: config.NODE_ENV === 'development',
      value: config.NODE_ENV
    },
    {
      name: 'APP_URL',
      test: config.NEXT_PUBLIC_APP_URL.includes('clawcloudrun.com'),
      value: config.NEXT_PUBLIC_APP_URL
    },
    {
      name: 'Supabase URL',
      test: config.NEXT_PUBLIC_SUPABASE_URL.includes('supabase.co'),
      value: config.NEXT_PUBLIC_SUPABASE_URL
    },
    {
      name: 'JWT Secret',
      test: config.JWT_SECRET.includes('development'),
      value: config.JWT_SECRET.substring(0, 20) + '...'
    }
  ];

  checks.forEach(check => {
    const status = check.test ? '✅' : '❌';
    console.log(`   ${status} ${check.name}: ${check.value}`);
  });

  const allPassed = checks.every(check => check.test);
  
  if (allPassed) {
    console.log('✅ All configuration checks passed');
  } else {
    console.log('⚠️ Some configuration checks failed');
    process.exit(1);
  }
}

// Run setup
setupDevelopmentEnvironment().catch(error => {
  console.error('❌ Development setup failed:', error);
  process.exit(1);
});