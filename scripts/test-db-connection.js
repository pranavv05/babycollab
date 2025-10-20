const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection by fetching the database version
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('Database connection successful!');
    console.log('Database version:', result[0].version);
    
    // Test fetching users count
    const usersCount = await prisma.user.count();
    console.log(`Total users in database: ${usersCount}`);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();