// Script to check projects in the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProjects() {
  try {
    console.log('Checking projects in database...');
    
    // Get all projects
    const projects = await prisma.project.findMany({
      include: {
        creator: true,
        techStack: true,
        members: true,
        joinRequests: true
      }
    });
    
    console.log(`Found ${projects.length} projects in database:`);
    
    for (const project of projects) {
      console.log('\n--- Project ---');
      console.log('ID:', project.id);
      console.log('Title:', project.title);
      console.log('Status:', project.status);
      console.log('Is Recruiting:', project.isRecruiting);
      console.log('Creator:', project.creator?.fullName || project.creatorId);
      console.log('Team Size:', project.currentTeamSize, '/', project.maxTeamSize);
      console.log('Created At:', project.createdAt);
      
      // Show tech stack
      if (project.techStack && project.techStack.length > 0) {
        console.log('Tech Stack:', project.techStack.map(t => t.technology).join(', '));
      }
      
      // Show members
      if (project.members && project.members.length > 0) {
        console.log('Members:', project.members.length);
      }
      
      // Show join requests
      if (project.joinRequests && project.joinRequests.length > 0) {
        console.log('Join Requests:', project.joinRequests.length);
        for (const request of project.joinRequests) {
          console.log('  - Request from user:', request.userId, 'Status:', request.status);
        }
      }
    }
    
    // Check for projects that should be discoverable
    const discoverableProjects = await prisma.project.findMany({
      where: {
        isRecruiting: true,
        status: {
          not: 'completed'
        }
      }
    });
    
    console.log(`\nFound ${discoverableProjects.length} discoverable projects`);
    
  } catch (error) {
    console.error('Error checking projects:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkProjects();