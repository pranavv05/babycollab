const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    // Get all users
    const users = await prisma.user.findMany();
    console.log('All users:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Name: ${user.fullName}, Email: ${user.email}`);
    });
    
    // Get all join requests
    const joinRequests = await prisma.projectJoinRequest.findMany({
      include: {
        user: true
      }
    });
    console.log('\nAll join requests:');
    joinRequests.forEach(request => {
      console.log(`- Request ID: ${request.id}, User: ${request.user?.fullName} (${request.userId}), Status: ${request.status}`);
    });
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();