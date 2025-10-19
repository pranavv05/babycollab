import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixUserEmails() {
  try {
    // Find all users with placeholder emails
    const usersWithPlaceholderEmails = await prisma.user.findMany({
      where: {
        email: {
          endsWith: '@example.com'
        }
      }
    });

    console.log(`Found ${usersWithPlaceholderEmails.length} users with placeholder emails`);

    // For each user with a placeholder email, we'll need to update their email
    // In a real application, you would need to get the real email from Clerk
    // For now, we'll just log them and note that they need to be updated
    // when they next log in (which will trigger the profile update)

    for (const user of usersWithPlaceholderEmails) {
      console.log(`User ID: ${user.id}`);
      console.log(`Current email: ${user.email}`);
      console.log(`Current name: ${user.fullName}`);
      console.log('---');
    }

    console.log('To fix these users, they need to update their profile by going to the profile page and saving their information.');
    console.log('This will trigger the profile API which will update their email with the real one from Clerk.');

  } catch (error) {
    console.error('Error fixing user emails:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserEmails();