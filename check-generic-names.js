const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAllGenericUserNames() {
  try {
    // Find all users
    const users = await prisma.user.findMany();
    
    console.log(`Found ${users.length} users in total.`);
    
    let updatedCount = 0;
    
    // Update each user with a generic name
    for (const user of users) {
      let shouldUpdate = false;
      let newFullName = user.fullName;
      
      // Check if the user has a generic name that should be updated
      const hasGenericName = 
        user.fullName === 'Project Creator' || 
        user.fullName === 'Project Member' || 
        user.fullName === 'User' ||
        user.fullName.startsWith('User-') ||
        user.fullName.startsWith('user_') ||
        (user.fullName.includes('User ') && user.fullName.length < 20) || // Likely a generated name
        (user.fullName.includes('user_') && user.fullName.length > 20); // Long user_ names are usually generated
      
      if (hasGenericName) {
        // For users with generic names, we'll update them when they next log in
        // For now, let's just log which users have generic names
        console.log(`User ${user.id} has generic name: "${user.fullName}"`);
      }
    }
    
    console.log(`Found ${updatedCount} users with generic names that could be updated.`);
    console.log('Note: Generic names will be updated to real names when users next log in and submit a join request or create a project.');
  } catch (error) {
    console.error('Error checking user names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllGenericUserNames();