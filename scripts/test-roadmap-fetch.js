// Test script to check what roadmap data is being returned from the API
const https = require('https');

// This would normally be done through the actual API endpoints
// For now, we'll just verify the Prisma client can connect
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRoadmapFetch() {
  try {
    // Test fetching a specific roadmap
    const roadmapId = process.argv[2]; // Pass roadmap ID as command line argument
    if (!roadmapId) {
      console.log('Please provide a roadmap ID as a command line argument');
      process.exit(1);
    }
    
    console.log(`Fetching roadmap with ID: ${roadmapId}`);
    
    // Test a simple query
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId }
    });
    
    console.log('Roadmap data:');
    console.log(JSON.stringify(roadmap, null, 2));
    
    console.log('\nPhases data type:', typeof roadmap.phases);
    console.log('Phases data:', roadmap.phases);
    
    if (Array.isArray(roadmap.phases)) {
      console.log('Phases is an array with', roadmap.phases.length, 'items');
      roadmap.phases.forEach((phase, index) => {
        console.log(`  Phase ${index}:`, typeof phase);
        if (typeof phase === 'object') {
          console.log(`    Keys:`, Object.keys(phase));
          if (phase.milestones) {
            console.log(`    Milestones:`, Array.isArray(phase.milestones) ? `${phase.milestones.length} items` : typeof phase.milestones);
          }
        }
      });
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

testRoadmapFetch();