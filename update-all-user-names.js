const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAllUserNames() {
  try {
    // Find users with generic names
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
        (user.fullName.includes('User ') && user.fullName.length < 30); // Likely a generated name
      
      if (hasGenericName) {
        // Create a better name based on email or ID
        if (user.email && user.email !== `${user.id}@example.com`) {
          // Try to create a name from email
          const emailName = user.email.split('@')[0];
          if (emailName && emailName.length > 1) {
            // Capitalize first letter
            newFullName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          } else {
            newFullName = `User ${user.id.substring(0, 8)}`;
          }
        } else {
          // Create a name based on ID
          newFullName = `User ${user.id.substring(0, 8)}`;
        }
        
        shouldUpdate = true;
      }
      
      // Update the user if needed
      if (shouldUpdate) {
        await prisma.user.update({
          where: { id: user.id },
          data: { fullName: newFullName }
        });
        
        console.log(`Updated user ${user.id}: "${user.fullName}" -> "${newFullName}"`);
        updatedCount++;
      }
    }
    
    console.log(`Finished updating user names. Updated ${updatedCount} users.`);
  } catch (error) {
    console.error('Error updating user names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllUserNames();