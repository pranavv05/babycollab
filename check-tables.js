const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTables() {
  try {
    const tables = await prisma.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Tables in database:', tables);
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();