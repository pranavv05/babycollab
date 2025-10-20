/**
 * Production database setup script
 * This script should be run after deployment to set up the production database
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupProductionDatabase() {
  try {
    console.log('Setting up production database...')
    
    // Run any necessary database setup operations here
    // For example, creating default records, setting up initial data, etc.
    
    console.log('Production database setup completed successfully!')
  } catch (error) {
    console.error('Error setting up production database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Only run if this script is executed directly
if (require.main === module) {
  setupProductionDatabase()
}

module.exports = { setupProductionDatabase }