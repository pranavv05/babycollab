const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRoadmaps() {
  try {
    // Check the roadmaps table structure
    const result = await prisma.$queryRawUnsafe('PRAGMA table_info(roadmaps)');
    console.log('roadmaps table structure:', result);
    
    // Check if there are any roadmaps in the database
    const count = await prisma.roadmap.count();
    console.log('Total roadmaps:', count);
    
    // Check a specific user's roadmaps
    const userId = 'user_34D4dFwGFHeVubuRAsZIPDO9YHu';
    const userRoadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      }
    });
    console.log('User roadmaps:', userRoadmaps);
  } catch (error) {
    console.error('Error checking roadmaps:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoadmaps();