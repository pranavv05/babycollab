const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserEmails() {
  try {
    console.log('Starting to fix user emails...');
    
    // Find users with placeholder emails
    const users = await prisma.user.findMany({
      where: {
        email: {
          endsWith: '@example.com'
        }
      }
    });
    
    console.log(`Found ${users.length} users with placeholder emails.`);
    
    let updatedCount = 0;
    
    // For each user with a placeholder email, we would ideally:
    // 1. Look up their actual email from Clerk (but we can't do that in this script)
    // 2. For now, we'll just log them and note that they need to update their emails
    
    for (const user of users) {
      console.log(`User ID: ${user.id}`);
      console.log(`  Current email: ${user.email}`);
      console.log(`  Username: ${user.username}`);
      console.log(`  Full name: ${user.fullName}`);
      console.log('---');
      
      // In a real scenario, we would integrate with Clerk's API to get the actual email
      // For now, we're just identifying the users who need to be fixed
      updatedCount++;
    }
    
    console.log(`Identified ${updatedCount} users with placeholder emails.`);
    console.log('To fix these emails, users need to update their profiles through the application.');
    
  } catch (error) {
    console.error('Error fixing user emails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserEmails();