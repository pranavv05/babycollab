const { PrismaClient } = require('@prisma/client');

async function verifyDatabase() {
  const prisma = new PrismaClient();
  
  try {
    // Test database connection
    console.log('Testing database connection...');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Database connection successful');
    console.log('Sample user:', users[0]);
    
    // Test roadmap table
    console.log('Testing roadmap table...');
    const roadmaps = await prisma.roadmap.findMany({ take: 1 });
    console.log('Roadmap table accessible');
    console.log('Sample roadmap:', roadmaps[0]);
    
    console.log('Database verification completed successfully');
  } catch (error) {
    console.error('Database verification failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();