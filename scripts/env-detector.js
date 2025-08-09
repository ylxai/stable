/**
 * Environment Detection Utility
 * Auto-detect environment berdasarkan context
 */

const fs = require('fs');
const path = require('path');

class EnvironmentDetector {
  constructor() {
    this.environments = {
      development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_APP_URL: 'http://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com',
        NEXT_PUBLIC_ENV_MODE: 'development',
        description: 'VPS CloudRun untuk testing & development'
      },
      production: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_APP_URL: 'https://hafiportrait.photography',
        NEXT_PUBLIC_ENV_MODE: 'production',
        description: 'Vercel production dengan domain custom'
      },
      staging: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_APP_URL: 'https://hafiportrait-staging.vercel.app',
        NEXT_PUBLIC_ENV_MODE: 'staging',
        description: 'Vercel staging environment'
      }
    };
  }

  /**
   * Auto-detect environment berdasarkan berbagai faktor
   */
  detectEnvironment() {
    console.log('🔍 Auto-detecting environment...');

    // 1. Check dari npm script context
    const npmScript = this.detectFromNpmScript();
    if (npmScript) {
      console.log(`📝 Detected from npm script: ${npmScript}`);
      return npmScript;
    }

    // 2. Check dari environment variables
    const envVar = this.detectFromEnvVars();
    if (envVar) {
      console.log(`🌐 Detected from environment variables: ${envVar}`);
      return envVar;
    }

    // 3. Check dari git branch
    const gitBranch = this.detectFromGitBranch();
    if (gitBranch) {
      console.log(`🌿 Detected from git branch: ${gitBranch}`);
      return gitBranch;
    }

    // 4. Check dari CI/CD context
    const cicd = this.detectFromCICD();
    if (cicd) {
      console.log(`🚀 Detected from CI/CD: ${cicd}`);
      return cicd;
    }

    // 5. Fallback ke development
    console.log('⚠️ Could not auto-detect, defaulting to development');
    return 'development';
  }

  /**
   * Detect dari npm script yang sedang berjalan
   */
  detectFromNpmScript() {
    const npmLifecycleEvent = process.env.npm_lifecycle_event;
    const npmCommand = process.env.npm_command;

    if (npmLifecycleEvent === 'dev') {
      return 'development';
    }

    if (npmLifecycleEvent === 'build') {
      // Check jika ada flag khusus
      const args = process.argv.slice(2);
      if (args.includes('--staging')) {
        return 'staging';
      }
      return 'production';
    }

    if (npmLifecycleEvent === 'build:staging') {
      return 'staging';
    }

    if (npmLifecycleEvent === 'start') {
      // Start biasanya production, tapi check existing config
      return this.detectFromExistingConfig() || 'production';
    }

    return null;
  }

  /**
   * Detect dari environment variables
   */
  detectFromEnvVars() {
    // Check NODE_ENV
    if (process.env.NODE_ENV === 'development') {
      return 'development';
    }

    // Check Vercel environment
    if (process.env.VERCEL_ENV === 'production') {
      return 'production';
    }

    if (process.env.VERCEL_ENV === 'preview') {
      return 'staging';
    }

    // Check custom environment variable
    if (process.env.APP_ENV) {
      return process.env.APP_ENV;
    }

    return null;
  }

  /**
   * Detect dari git branch
   */
  detectFromGitBranch() {
    try {
      const { execSync } = require('child_process');
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
        encoding: 'utf8' 
      }).trim();

      if (branch === 'main' || branch === 'master') {
        return 'production';
      }

      if (branch === 'staging' || branch === 'develop') {
        return 'staging';
      }

      if (branch.startsWith('feature/') || branch.startsWith('dev/')) {
        return 'development';
      }

      return null;
    } catch (error) {
      console.warn('Could not detect git branch:', error.message);
      return null;
    }
  }

  /**
   * Detect dari CI/CD environment
   */
  detectFromCICD() {
    // Vercel
    if (process.env.VERCEL) {
      if (process.env.VERCEL_ENV === 'production') {
        return 'production';
      }
      return 'staging';
    }

    // GitHub Actions
    if (process.env.GITHUB_ACTIONS) {
      const ref = process.env.GITHUB_REF;
      if (ref === 'refs/heads/main' || ref === 'refs/heads/master') {
        return 'production';
      }
      return 'staging';
    }

    // Netlify
    if (process.env.NETLIFY) {
      return process.env.CONTEXT === 'production' ? 'production' : 'staging';
    }

    return null;
  }

  /**
   * Detect dari existing config file
   */
  detectFromExistingConfig() {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        
        if (content.includes('NEXT_PUBLIC_ENV_MODE=development')) {
          return 'development';
        }
        
        if (content.includes('NEXT_PUBLIC_ENV_MODE=production')) {
          return 'production';
        }
        
        if (content.includes('NEXT_PUBLIC_ENV_MODE=staging')) {
          return 'staging';
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return null;
  }

  /**
   * Get environment configuration
   */
  getEnvironmentConfig(envName) {
    const config = this.environments[envName];
    if (!config) {
      throw new Error(`Unknown environment: ${envName}`);
    }

    return {
      ...config,
      // Add common variables
      NEXT_PUBLIC_SUPABASE_URL: 'https://azspktldiblhrwebzmwq.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDQwNDQsImV4cCI6MjA2OTUyMDA0NH0.uKHB4K9hxUDTc0ZkwidCJv_Ev-oa99AflFvrFt_8MG8',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c3BrdGxkaWJsaHJ3ZWJ6bXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk0NDA0NCwiZXhwIjoyMDY5NTIwMDQ0fQ.hk8vOgFoW3PJZxhw40sHiNyvNxbD4_c4x6fqBynvlmE',
      JWT_SECRET: `hafiportrait-${envName}-secret-key-2025`
    };
  }

  /**
   * Display environment info
   */
  displayEnvironmentInfo(envName) {
    const config = this.environments[envName];
    
    console.log('\n🎯 ENVIRONMENT CONFIGURATION:');
    console.log('='.repeat(40));
    console.log(`📍 Environment: ${envName.toUpperCase()}`);
    console.log(`📝 Description: ${config.description}`);
    console.log(`🌐 URL: ${config.NEXT_PUBLIC_APP_URL}`);
    console.log(`⚙️ NODE_ENV: ${config.NODE_ENV}`);
    console.log('='.repeat(40));
  }
}

module.exports = EnvironmentDetector;
