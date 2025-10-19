const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStatsAPI() {
  try {
    // Use one of the existing user IDs
    const userId = 'user_34D4dFwGFHeVubuRAsZIPDO9YHu';
    
    // Test the same queries as in the API route
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
    
    // Calculate career progress (simplified calculation)
    const careerProgress = Math.min(100, Math.round((roadmapsCount * 20 + totalProjectsCount * 15 + skillsCount * 5) / 3));
    
    // Transform the data to match the frontend expectations
    const stats = {
      activeRoadmaps: roadmapsCount,
      totalProjects: totalProjectsCount,
      skillsLearned: skillsCount,
      careerProgress: careerProgress,
      roadmapsInProgress: Math.max(0, roadmapsCount - 1), // Simplified
      projectsCompleted: Math.max(0, totalProjectsCount - 2), // Simplified
      skillsThisMonth: Math.min(skillsCount, 4), // Simplified
      progressThisMonth: Math.min(100, careerProgress - 56) // Based on the mock data
    };
    
    console.log('Stats:', JSON.stringify(stats, null, 2));
    console.log('All queries successful!');
  } catch (error) {
    console.error('Error in stats queries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStatsAPI();