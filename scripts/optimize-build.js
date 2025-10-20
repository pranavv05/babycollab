#!/usr/bin/env node

/**
 * Build Optimization Script
 * This script helps optimize the build process for Vercel deployment
 */

console.log('🔍 Optimizing build for Vercel deployment...\n');

// Check if we're running on Vercel
const isVercel = process.env.VERCEL === '1';

if (isVercel) {
  console.log('☁️  Running on Vercel environment');
  console.log('   Setting memory optimization flags...\n');
  
  // Set Node.js memory limit
  process.env.NODE_OPTIONS = '--max-old-space-size=4096';
  
  // Set build optimization flags
  process.env.NEXT_BUILD_MEMORY_LIMIT = '4096';
  
  console.log('✅ Build optimization flags set');
} else {
  console.log('💻 Running in local environment');
  console.log('   No optimization needed\n');
}

// Check for required environment variables
const requiredEnvVars = ['DATABASE_URL', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.log('⚠️  Warning: Missing environment variables:');
  missingEnvVars.forEach(envVar => console.log(`   - ${envVar}`));
  console.log('   Please set these in your Vercel dashboard\n');
}

console.log('🚀 Ready for optimized build');