const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAlexDetails() {
  try {
    // Check a specific user with pending join requests
    const userId = 'user_34CxIwnQEKc6hV7RBp79OWu6K2I';
    
    // Fetch user data with all related information
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: true,
        education: true,
        experience: true,
      }
    });
    
    console.log('User Data:');
    console.log('ID:', user.id);
    console.log('Name:', user.fullName);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Created At:', user.createdAt);
    
    console.log('\nProfile Data:');
    if (user.profile) {
      console.log('Bio:', user.profile.bio);
      console.log('Location:', user.profile.location);
      console.log('Website URL:', user.profile.websiteUrl);
      console.log('GitHub URL:', user.profile.githubUrl);
      console.log('LinkedIn URL:', user.profile.linkedinUrl);
    } else {
      console.log('No profile data found');
    }
    
    console.log('\nSkills:');
    if (user.skills && user.skills.length > 0) {
      user.skills.forEach((skill, index) => {
        console.log(`${index + 1}. ${skill.skillName}`);
      });
    } else {
      console.log('No skills found');
    }
    
    console.log('\nEducation:');
    if (user.education && user.education.length > 0) {
      user.education.forEach((edu, index) => {
        console.log(`${index + 1}. ${edu.degree} at ${edu.institutionName}`);
      });
    } else {
      console.log('No education found');
    }
    
    console.log('\nExperience:');
    if (user.experience && user.experience.length > 0) {
      user.experience.forEach((exp, index) => {
        console.log(`${index + 1}. ${exp.position} at ${exp.companyName}`);
      });
    } else {
      console.log('No experience found');
    }
    
    // Check if user has any pending join requests
    const joinRequests = await prisma.projectJoinRequest.findMany({
      where: {
        userId: userId,
        status: 'pending'
      },
      include: {
        project: true
      }
    });
    
    console.log('\nPending Join Requests:');
    if (joinRequests.length > 0) {
      joinRequests.forEach((request, index) => {
        console.log(`${index + 1}. Project: ${request.project.title}`);
      });
    } else {
      console.log('No pending join requests found');
    }
  } catch (error) {
    console.error('Error checking user details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAlexDetails();