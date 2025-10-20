#!/usr/bin/env node

// Debug build script to identify where the build is hanging
const { execSync } = require('child_process');

console.log('Starting debug build process...');

try {
  console.log('Step 1: Cleaning previous build...');
  execSync('rimraf .next', { stdio: 'inherit' });
  console.log('Step 1 completed.');
} catch (error) {
  console.log('Step 1 skipped or failed (might not be critical).');
}

try {
  console.log('Step 2: Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Step 2 completed.');
} catch (error) {
  console.error('Step 2 failed:', error.message);
}

try {
  console.log('Step 3: Building Next.js app...');
  execSync('next build', { stdio: 'inherit' });
  console.log('Step 3 completed.');
} catch (error) {
  console.error('Step 3 failed:', error.message);
  process.exit(1);
}

console.log('Debug build process completed.');