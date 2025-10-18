const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProjectState() {
  try {
    // Check the specific project
    const project = await prisma.project.findUnique({
      where: { id: '56b06f52-bd09-4f94-95b0-e29c4f641b76' },
      include: {
        members: true,
        joinRequests: true,
      }
    });
    
    if (!project) {
      console.log('Project not found');
      return;
    }
    
    console.log('=== PROJECT INFO ===');
    console.log(`ID: ${project.id}`);
    console.log(`Title: ${project.title}`);
    console.log(`Creator ID: ${project.creatorId}`);
    
    console.log('\n=== PROJECT MEMBERS ===');
    project.members.forEach(member => {
      console.log(`- User ID: ${member.userId}, Role: ${member.role}`);
    });
    
    console.log('\n=== JOIN REQUESTS ===');
    project.joinRequests.forEach(request => {
      console.log(`- User ID: ${request.userId}, Status: ${request.status}`);
    });
    
  } catch (error) {
    console.error('Error checking project state:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProjectState();