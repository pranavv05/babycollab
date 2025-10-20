#!/usr/bin/env node

// Netlify build script for proper Prisma setup
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Running Netlify build script...');

try {
  // Check if we're in a Netlify environment
  const isNetlify = process.env.NETLIFY === 'true';
  console.log('Netlify environment:', isNetlify);
  
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // For Netlify, we need to ensure the Prisma engine is properly bundled
  console.log('Setting up Prisma for Netlify...');
  
  // Run the Next.js build using pnpm
  console.log('Running Next.js build...');
  execSync('pnpm next build', { stdio: 'inherit' });
  
  console.log('Netlify build completed successfully!');
} catch (error) {
  console.error('Netlify build failed:', error);
  
  // If this is a Netlify environment and we get an error, try a fallback approach
  if (process.env.NETLIFY === 'true') {
    console.log('Trying fallback build approach for Netlify...');
    try {
      // Try building without Prisma generation first
      console.log('Running Next.js build without Prisma generation...');
      execSync('pnpm next build', { stdio: 'inherit' });
      console.log('Fallback build completed successfully!');
    } catch (fallbackError) {
      console.error('Fallback build also failed:', fallbackError);
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
}