const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateAlexProfile() {
  try {
    const userId = 'user_34CxIwnQEKc6hV7RBp79OWu6K2I';
    
    // Update user profile with sample data
    const profile = await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        bio: "Frontend developer specializing in React and Vue.js. Passionate about creating intuitive user interfaces and improving user experience. Open source contributor and technical writer.",
        location: "San Francisco, CA",
        websiteUrl: "https://alexjohnson.dev",
        githubUrl: "https://github.com/alexjohnson",
        linkedinUrl: "https://linkedin.com/in/alexjohnson",
        currentStatus: "Actively seeking new opportunities",
        yearsOfExperience: 4
      },
      create: {
        userId: userId,
        bio: "Frontend developer specializing in React and Vue.js. Passionate about creating intuitive user interfaces and improving user experience. Open source contributor and technical writer.",
        location: "San Francisco, CA",
        websiteUrl: "https://alexjohnson.dev",
        githubUrl: "https://github.com/alexjohnson",
        linkedinUrl: "https://linkedin.com/in/alexjohnson",
        currentStatus: "Actively seeking new opportunities",
        yearsOfExperience: 4
      }
    });
    
    console.log('Profile updated:', profile);
    
    // Add sample skills
    const skills = [
      "React",
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "CSS",
      "HTML",
      "Redux",
      "Webpack"
    ];
    
    // Clear existing skills for this user
    await prisma.skill.deleteMany({
      where: { userId: userId }
    });
    
    // Add new skills
    for (const skillName of skills) {
      await prisma.skill.create({
        data: {
          userId: userId,
          skillName: skillName
        }
      });
    }
    
    console.log('Skills added');
    
    // Add sample education
    // Clear existing education for this user
    await prisma.education.deleteMany({
      where: { userId: userId }
    });
    
    const education = await prisma.education.create({
      data: {
        userId: userId,
        institutionName: "Stanford University",
        degree: "Master of Science",
        fieldOfStudy: "Computer Science",
        startDate: new Date("2014-09-01"),
        endDate: new Date("2016-06-01"),
        isCurrent: false,
        description: "Specialized in Human-Computer Interaction and Web Technologies."
      }
    });
    
    console.log('Education added:', education);
    
    // Add sample experience
    // Clear existing experience for this user
    await prisma.experience.deleteMany({
      where: { userId: userId }
    });
    
    const experience = await prisma.experience.create({
      data: {
        userId: userId,
        companyName: "InnovateTech",
        position: "Senior Frontend Engineer",
        employmentType: "Full-time",
        startDate: new Date("2016-07-01"),
        endDate: new Date("2023-05-01"),
        isCurrent: false,
        description: "Led frontend development for multiple product lines. Mentored junior developers and established frontend best practices."
      }
    });
    
    console.log('Experience added:', experience);
    
    console.log('Alex profile populated successfully!');
  } catch (error) {
    console.error('Error populating Alex profile:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateAlexProfile();