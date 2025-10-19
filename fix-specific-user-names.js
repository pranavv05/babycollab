const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSpecificUserNames() {
  try {
    // Specific users that need better names
    const usersToFix = [
      { id: 'user_34CxIwnQEKc6hV7RBp79OWu6K2I', newName: 'Alex Johnson' },
      { id: 'user_34D3OluAw1hwgWGJdkCCw5Maqyl', newName: 'Sam Wilson' },
      { id: 'user_34D4dFwGFHeVubuRAsZIPDO9YHu', newName: 'Taylor Kim' }
    ];
    
    console.log(`Updating ${usersToFix.length} specific users...`);
    
    // Update each specific user
    for (const userUpdate of usersToFix) {
      const user = await prisma.user.findUnique({
        where: { id: userUpdate.id }
      });
      
      if (user) {
        await prisma.user.update({
          where: { id: userUpdate.id },
          data: { fullName: userUpdate.newName }
        });
        
        console.log(`Updated user ${userUpdate.id}: "${user.fullName}" -> "${userUpdate.newName}"`);
      }
    }
    
    console.log('Finished updating specific user names.');
  } catch (error) {
    console.error('Error updating specific user names:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSpecificUserNames();