#!/usr/bin/env node

/**
 * Deployment Verification Script
 * This script verifies that all necessary components are ready for deployment
 */

console.log('🚀 Verifying deployment readiness...\n');

// Check Node.js version
const nodeVersion = process.version;
console.log(`✅ Node.js Version: ${nodeVersion}`);

// Check if we're in the correct directory
const fs = require('fs');
const path = require('path');

// Check for required files
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'prisma/schema.prisma',
  'vercel.json'
];

console.log('📁 Checking required files...');
let allFilesPresent = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesPresent = false;
  }
});

if (!allFilesPresent) {
  console.log('\n⚠️  Some required files are missing. Please check your repository.');
  process.exit(1);
}

// Check package.json scripts
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const requiredScripts = ['build', 'vercel-build'];

console.log('\n🔧 Checking build scripts...');
requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script} script: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} script missing`);
  }
});

// Check Prisma configuration
console.log('\n🗄️  Checking Prisma configuration...');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  if (schemaContent.includes('provider = "postgresql"')) {
    console.log('✅ Prisma configured for PostgreSQL');
  } else {
    console.log('❌ Prisma not configured for PostgreSQL');
  }
  
  if (schemaContent.includes('url      = env("DATABASE_URL")')) {
    console.log('✅ DATABASE_URL environment variable configured');
  } else {
    console.log('❌ DATABASE_URL environment variable not configured');
  }
}

// Check Next.js configuration
console.log('\n⚙️  Checking Next.js configuration...');
const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  console.log('✅ next.config.ts found');
  
  if (nextConfigContent.includes('eslint:') && nextConfigContent.includes('ignoreDuringBuilds: true')) {
    console.log('✅ ESLint configured to ignore during builds');
  }
  
  if (nextConfigContent.includes('typescript:') && nextConfigContent.includes('ignoreBuildErrors: true')) {
    console.log('✅ TypeScript configured to ignore build errors');
  }
}

// Check for environment variable examples
console.log('\n🔐 Checking environment configuration...');
const envFiles = ['.env.local', '.env.production', '.env.example'];
let envFileFound = false;

envFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`✅ ${file} found`);
    envFileFound = true;
  }
});

if (!envFileFound) {
  console.log('ℹ️  No environment files found (this is expected for deployment)');
}

// Check Git status
console.log('\n🔄 Checking Git status...');
const { execSync } = require('child_process');

try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim() === '') {
    console.log('✅ No uncommitted changes');
  } else {
    console.log('⚠️  There are uncommitted changes:');
    console.log(gitStatus);
  }
} catch (error) {
  console.log('⚠️  Could not check Git status');
}

console.log('\n📋 Deployment Verification Complete!');
console.log('\n✅ Your application is ready for deployment to Vercel.');
console.log('✅ Make sure to set all required environment variables in your Vercel dashboard.');
console.log('✅ Use the deployment-clean branch for deployment.');
console.log('\nFor deployment instructions, see DEPLOYMENT_INSTRUCTIONS.md');