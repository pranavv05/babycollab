const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSchema() {
  try {
    // Check if the tables used in the stats API exist
    const tables = [
      'user_roadmaps',
      'projects',
      'project_members',
      'skills'
    ];
    
    for (const table of tables) {
      try {
        const result = await prisma.$queryRawUnsafe(`PRAGMA table_info(${table})`);
        console.log(`${table} table exists:`);
        console.log(result);
        console.log('---');
      } catch (error) {
        console.log(`Error checking ${table} table:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();