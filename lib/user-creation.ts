import { PrismaClient } from '@prisma/client';

/**
 * Ensures a user exists in the database with proper email and name from Clerk
 * This function should be used in all API routes that might create users
 * 
 * @param prisma - Prisma client instance
 * @param userId - Clerk user ID
 * @param email - User's email from Clerk session claims
 * @param fullName - User's full name from Clerk session claims
 * @returns The user record
 */
export async function ensureUserExists(
  prisma: PrismaClient,
  userId: string,
  email: string,
  fullName: string
) {
  // First, check if user exists in our database
  let user = await prisma.user.findUnique({
    where: { id: userId }
  });

  // If user doesn't exist, create them
  if (!user) {
    // Generate a unique username based on actual email if possible
    let username = email.split('@')[0] || `user_${userId.substring(0, 8)}`;
    let userExists = await prisma.user.findUnique({
      where: { username: username }
    });
    
    // If username exists, append a timestamp to make it unique
    if (userExists) {
      username = `user_${userId.substring(0, 8)}_${Date.now()}`;
    }
    
    user = await prisma.user.create({
      data: {
        id: userId,
        email: email, // Use actual email from Clerk
        username: username,
        fullName: fullName,
      },
    });
  } else {
    // Always update user with real data from Clerk if they have placeholder data
    const hasPlaceholderEmail = user.email.endsWith('@example.com');
    const hasGenericName = 
      user.fullName === 'Project Creator' || 
      user.fullName === 'Project Member' || 
      user.fullName === 'User' ||
      user.fullName.startsWith('User-') ||
      user.fullName.startsWith('user_') ||
      (user.fullName.includes('User ') && user.fullName.length < 20) ||
      (user.fullName.includes('user_') && user.fullName.length > 20);
    
    if (hasPlaceholderEmail || hasGenericName) {
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          email: email, // Use actual email from Clerk
          fullName: fullName,
        },
      });
    }
  }
  
  return user;
}