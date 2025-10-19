const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixSpecificUserNames() {
  try {
    // Find users with specific problematic names
    const usersToUpdate = [
      { id: 'user_34CxIwnQEKc6hV7RBp79OWu6K2I', newName: 'User 34CxI' },
      { id: 'user_34D3OluAw1hwgWGJdkCCw5Maqyl', newName: 'User 34D3O' },
      { id: 'user_34D4dFwGFHeVubuRAsZIPDO9YHu', newName: 'User 34D4d' }
    ];
    
    console.log(`Updating ${usersToUpdate.length} specific users...`);
    
    // Update each specific user
    for (const userUpdate of usersToUpdate) {
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