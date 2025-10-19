const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUsers() {
  try {
    // Test a simple query
    const users = await prisma.user.findMany();
    console.log('Users:', users.length);
    console.log('User IDs:', users.map(u => u.id));
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUsers();