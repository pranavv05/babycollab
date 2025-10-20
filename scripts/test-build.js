#!/usr/bin/env node

/**
 * Simple Build Test
 * This script tests if the build environment is properly set up
 */

console.log('🔍 Testing build environment...\n');

// Test environment variables
const envVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'GEMINI_API_KEY'
];

console.log('📋 Checking environment variables:');
envVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`  ✅ ${envVar}: Set`);
  } else {
    console.log(`  ⚠️  ${envVar}: Not set`);
  }
});

// Test if required modules are available
try {
  require('next');
  console.log('  ✅ Next.js: Available');
} catch (error) {
  console.log('  ❌ Next.js: Not available');
}

try {
  require('@prisma/client');
  console.log('  ✅ Prisma Client: Available');
} catch (error) {
  console.log('  ❌ Prisma Client: Not available');
}

try {
  require('@clerk/nextjs');
  console.log('  ✅ Clerk: Available');
} catch (error) {
  console.log('  ❌ Clerk: Not available');
}

console.log('\n✅ Build environment test completed');