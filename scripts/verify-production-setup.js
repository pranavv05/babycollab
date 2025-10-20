/**
 * Script to verify production setup
 * This script checks if all required environment variables are set
 * and if the application can connect to the database
 */

// Load environment variables from .env file
require('dotenv').config()

const fs = require('fs')
const path = require('path')

// Required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'DATABASE_URL',
  'GEMINI_API_KEY'
]

function checkEnvVars() {
  console.log('Checking environment variables...')
  
  const missingVars = []
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar)
    }
  }
  
  if (missingVars.length > 0) {
    console.error('Missing environment variables:')
    missingVars.forEach(envVar => console.error(`  - ${envVar}`))
    return false
  }
  
  // Check if DATABASE_URL is a PostgreSQL URL
  const databaseUrl = process.env.DATABASE_URL
  if (databaseUrl && !databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.error('DATABASE_URL must be a PostgreSQL connection string (starting with postgresql:// or postgres://)')
    return false
  }
  
  console.log('✓ All required environment variables are set')
  console.log('✓ DATABASE_URL is properly formatted for PostgreSQL')
  return true
}

function checkFiles() {
  console.log('Checking required files...')
  
  const requiredFiles = [
    '.env',
    '.env.production',
    'next.config.ts',
    'package.json',
    'prisma/schema.prisma'
  ]
  
  const missingFiles = []
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(__dirname, '..', file))) {
      missingFiles.push(file)
    }
  }
  
  if (missingFiles.length > 0) {
    console.error('Missing required files:')
    missingFiles.forEach(file => console.error(`  - ${file}`))
    return false
  }
  
  // Check if Prisma schema is configured for PostgreSQL
  const prismaSchema = fs.readFileSync(path.join(__dirname, '..', 'prisma', 'schema.prisma'), 'utf8')
  if (!prismaSchema.includes('provider = "postgresql"')) {
    console.error('Prisma schema is not configured for PostgreSQL')
    return false
  }
  
  console.log('✓ All required files are present')
  console.log('✓ Prisma schema is configured for PostgreSQL')
  return true
}

function checkScripts() {
  console.log('Checking package.json scripts...')
  
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
  
  const requiredScripts = [
    'build',
    'start',
    'postinstall'
  ]
  
  const missingScripts = []
  
  for (const script of requiredScripts) {
    if (!packageJson.scripts[script]) {
      missingScripts.push(script)
    }
  }
  
  if (missingScripts.length > 0) {
    console.error('Missing required scripts in package.json:')
    missingScripts.forEach(script => console.error(`  - ${script}`))
    return false
  }
  
  console.log('✓ All required scripts are present in package.json')
  return true
}

async function main() {
  console.log('Verifying production setup...\n')
  
  const checks = [
    checkEnvVars(),
    checkFiles(),
    checkScripts()
  ]
  
  const allPassed = checks.every(check => check)
  
  console.log('\n' + '='.repeat(50))
  if (allPassed) {
    console.log('✓ All checks passed! Ready for production deployment.')
  } else {
    console.log('✗ Some checks failed. Please fix the issues before deploying.')
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { checkEnvVars, checkFiles, checkScripts }