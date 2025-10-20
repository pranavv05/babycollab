// Script to check what roadmap data is stored in the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRoadmapData() {
  try {
    // Get all roadmaps
    const roadmaps = await prisma.roadmap.findMany({
      take: 5 // Limit to 5 roadmaps
    });
    
    console.log('Found', roadmaps.length, 'roadmaps');
    
    for (const roadmap of roadmaps) {
      console.log('\n--- Roadmap ---');
      console.log('ID:', roadmap.id);
      console.log('Title:', roadmap.title);
      console.log('Description:', roadmap.description);
      console.log('Phases type:', typeof roadmap.phases);
      console.log('Phases:', JSON.stringify(roadmap.phases, null, 2));
      
      if (Array.isArray(roadmap.phases)) {
        console.log('Number of phases:', roadmap.phases.length);
        for (let i = 0; i < roadmap.phases.length; i++) {
          const phase = roadmap.phases[i];
          console.log(`  Phase ${i}:`, typeof phase);
          if (typeof phase === 'object' && phase !== null) {
            console.log(`    Title:`, phase.title || phase.name);
            console.log(`    Description:`, phase.description || phase.duration);
            if (phase.milestones) {
              console.log(`    Milestones:`, Array.isArray(phase.milestones) ? `${phase.milestones.length} items` : typeof phase.milestones);
            }
          }
        }
      }
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkRoadmapData();