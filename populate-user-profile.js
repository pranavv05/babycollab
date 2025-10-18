const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function populateUserProfile() {
  try {
    const userId = 'user_34ClxDLHdxJYxiAcW1KRi4Jo2Bv';
    
    // Update user profile with sample data
    const profile = await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        bio: "Passionate full-stack developer with 3+ years of experience building web applications. Specialized in React, Node.js, and cloud technologies. Always eager to learn new technologies and solve complex problems.",
        location: "Bangalore, India",
        websiteUrl: "https://pranavvatsa.dev",
        githubUrl: "https://github.com/pranavvatsa",
        linkedinUrl: "https://linkedin.com/in/pranavvatsa",
        currentStatus: "Open to new opportunities",
        yearsOfExperience: 3
      },
      create: {
        userId: userId,
        bio: "Passionate full-stack developer with 3+ years of experience building web applications. Specialized in React, Node.js, and cloud technologies. Always eager to learn new technologies and solve complex problems.",
        location: "Bangalore, India",
        websiteUrl: "https://pranavvatsa.dev",
        githubUrl: "https://github.com/pranavvatsa",
        linkedinUrl: "https://linkedin.com/in/pranavvatsa",
        currentStatus: "Open to new opportunities",
        yearsOfExperience: 3
      }
    });
    
    console.log('Profile updated:', profile);
    
    // Add sample skills
    const skills = [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "Next.js",
      "Python",
      "AWS",
      "Docker"
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
        institutionName: "Indian Institute of Technology",
        degree: "Bachelor of Technology",
        fieldOfStudy: "Computer Science and Engineering",
        startDate: new Date("2016-08-01"),
        endDate: new Date("2020-05-01"),
        isCurrent: false,
        description: "Focused on software engineering and distributed systems. Graduated with honors."
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
        companyName: "TechCorp Solutions",
        position: "Senior Software Engineer",
        employmentType: "Full-time",
        startDate: new Date("2020-06-01"),
        endDate: null,
        isCurrent: true,
        description: "Leading frontend development for enterprise SaaS products. Mentoring junior developers and contributing to architecture decisions."
      }
    });
    
    console.log('Experience added:', experience);
    
    console.log('User profile populated successfully!');
  } catch (error) {
    console.error('Error populating user profile:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateUserProfile();