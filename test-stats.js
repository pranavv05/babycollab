const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStats() {
  try {
    // Test the queries used in the stats API route
    const userId = 'user_34D4dFwGFHeVubuRAsZIPDO9YHu'; // Use one of the existing user IDs
    
    // Get user's roadmaps count
    const roadmapsCount = await prisma.roadmap.count({
      where: {
        userId: userId
      }
    });
    console.log('Roadmaps count:', roadmapsCount);
    
    // Get user's projects count (both created and as member)
    const createdProjectsCount = await prisma.project.count({
      where: {
        creatorId: userId
      }
    });
    console.log('Created projects count:', createdProjectsCount);
    
    const projectMembershipsCount = await prisma.projectMember.count({
      where: {
        userId: userId
      }
    });
    console.log('Project memberships count:', projectMembershipsCount);
    
    const totalProjectsCount = createdProjectsCount + projectMembershipsCount;
    console.log('Total projects count:', totalProjectsCount);
    
    // Get user's skills count
    const skillsCount = await prisma.skill.count({
      where: {
        userId: userId
      }
    });
    console.log('Skills count:', skillsCount);
    
    console.log('All queries successful!');
  } catch (error) {
    console.error('Error in stats queries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStats();