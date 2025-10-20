const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRoadmap() {
  try {
    // Get the first roadmap from the database
    const roadmap = await prisma.roadmap.findFirst();
    
    if (roadmap) {
      console.log('Roadmap ID:', roadmap.id);
      console.log('Roadmap Title:', roadmap.title);
      console.log('Roadmap Phases Type:', typeof roadmap.phases);
      console.log('Roadmap Phases:', JSON.stringify(roadmap.phases, null, 2));
    } else {
      console.log('No roadmaps found in the database');
    }
  } catch (error) {
    console.error('Error fetching roadmap:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoadmap();