#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script verifies that all required environment variables are set
 * and that the application is ready for deployment.
 */

require('dotenv').config();

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'GEMINI_API_KEY'
];

const optionalEnvVars = [
  'EMAIL_USER',
  'EMAIL_PASS'
];

console.log('🔍 Verifying deployment configuration...\n');

// Check required environment variables
let allRequiredVarsPresent = true;
console.log('📋 Required Environment Variables:');
requiredEnvVars.forEach((envVar) => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Set`);
  } else {
    console.log(`  ❌ ${envVar}: Missing`);
    allRequiredVarsPresent = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalEnvVars.forEach((envVar) => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Set`);
  } else {
    console.log(`  ⚠️  ${envVar}: Not set (optional)`);
  }
});

// Check DATABASE_URL format
if (process.env.DATABASE_URL) {
  console.log('\n🔍 Database URL Validation:');
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    console.log('  ✅ Database URL format is correct');
    
    // Check for SSL requirement
    if (dbUrl.includes('sslmode=require')) {
      console.log('  ✅ SSL mode is enabled');
    } else {
      console.log('  ⚠️  SSL mode not explicitly enabled (add ?sslmode=require if needed)');
    }
  } else {
    console.log('  ❌ Database URL must start with postgresql:// or postgres://');
    allRequiredVarsPresent = false;
  }
}

// Final verification
console.log('\n📊 Verification Summary:');
if (allRequiredVarsPresent) {
  console.log('  ✅ All required environment variables are set');
  console.log('  ✅ Application is ready for deployment');
  console.log('\n🚀 You can now deploy to Vercel!');
  process.exit(0);
} else {
  console.log('  ❌ Some required environment variables are missing');
  console.log('  🛑 Please fix the issues above before deploying');
  process.exit(1);
}