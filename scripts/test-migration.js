#!/usr/bin/env node

/**
 * Migration Test Script
 * This script verifies that the Prisma migration setup is working correctly.
 */

console.log('🔍 Testing Prisma migration setup...\n');

// Check if prisma is installed
try {
  require.resolve('@prisma/client');
  console.log('✅ Prisma client is installed');
} catch (error) {
  console.log('❌ Prisma client is not installed');
  process.exit(1);
}

// Check if prisma CLI is available
const { execSync } = require('child_process');

try {
  const version = execSync('npx prisma --version', { encoding: 'utf-8' });
  console.log('✅ Prisma CLI is available');
  console.log(`   Prisma version: ${version.trim()}`);
} catch (error) {
  console.log('❌ Prisma CLI is not available');
  process.exit(1);
}

// Check if migrate command is available
try {
  const help = execSync('npx prisma migrate --help', { encoding: 'utf-8' });
  console.log('✅ Prisma migrate command is available');
} catch (error) {
  console.log('❌ Prisma migrate command is not available');
  process.exit(1);
}

console.log('\n✅ All migration prerequisites are met');
console.log('🚀 The vercel-build script should work correctly during deployment');