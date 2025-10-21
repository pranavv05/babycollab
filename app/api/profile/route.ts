import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import getPrismaClient from '@/lib/db';

// GET /api/profile - Get current user's profile data
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prismaClient = await getPrismaClient();

    // Get real email from Clerk session
    const realEmail = (sessionClaims?.email as string) || `${userId}@example.com`;
    const realName = (sessionClaims?.fullName as string) || 'User';

    // Fetch user and profile data
    let user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    // If user doesn't exist, create them with real data from Clerk
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          id: userId,
          email: realEmail,
          username: realEmail.split('@')[0] || `user_${userId.substring(0, 8)}`,
          fullName: realName,
        },
        include: { profile: true }
      });
    } else {
      // Always ensure we're using real data from Clerk
      // Check if the current email is a placeholder
      const hasPlaceholderEmail = user.email.endsWith('@example.com');
      
      // Check if user has a generic name that should be updated
      const hasGenericName = 
        user.fullName === 'Project Creator' || 
        user.fullName === 'Project Member' || 
        user.fullName === 'User' ||
        user.fullName.startsWith('User-') ||
        user.fullName.startsWith('user_') ||
        (user.fullName.includes('User ') && user.fullName.length < 20) ||
        (user.fullName.includes('user_') && user.fullName.length > 20);
      
      // Update user with real email and name from Clerk if needed
      if (hasPlaceholderEmail || hasGenericName) {
        user = await prismaClient.user.update({
          where: { id: userId },
          data: {
            email: realEmail,
            fullName: realName,
          },
          include: { profile: true }
        });
      }
    }

    return NextResponse.json({ user, profile: user.profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prismaClient = await getPrismaClient();

    // Get the request body
    const body = await req.json();
    
    // Extract profile data
    const { 
      fullName, 
      bio, 
      location, 
      websiteUrl, 
      githubUrl, 
      linkedinUrl,
      twitterUrl,
      currentStatus,
      yearsOfExperience
    } = body;

    // Get email from session claims - this is the real email from Clerk
    const email = (sessionClaims?.email as string) || `${userId}@example.com`;

    // First, check if user exists in our database
    let user = await prismaClient.user.findUnique({
      where: { id: userId }
    });

    // If user doesn't exist, we need to get their info from Clerk and create them
    if (!user) {
      // Create user with actual email from Clerk
      user = await prismaClient.user.create({
        data: {
          id: userId,
          email: email, // Use actual email from Clerk
          username: email.split('@')[0] || `user_${userId.substring(0, 8)}`, // Use email prefix as username
          fullName: fullName || (sessionClaims?.fullName as string) || 'User',
        }
      });
    } else {
      // Always update user's information with real data from Clerk
      // Check if the current email is a placeholder
      const hasPlaceholderEmail = user.email.endsWith('@example.com');
      
      // Also check if user has a generic name that should be updated
      const hasGenericName = 
        user.fullName === 'Project Creator' || 
        user.fullName === 'Project Member' || 
        user.fullName === 'User' ||
        user.fullName.startsWith('User-') ||
        user.fullName.startsWith('user_') ||
        (user.fullName.includes('User ') && user.fullName.length < 20) || // Likely a generated name
        (user.fullName.includes('user_') && user.fullName.length > 20); // Long user_ names are usually generated
      
      // Update user with real email and name from Clerk
      user = await prismaClient.user.update({
        where: { id: userId },
        data: {
          email: email, // Always use the real email from Clerk
          fullName: fullName || (sessionClaims?.fullName as string) || user.fullName || 'User',
        },
      });
    }

    // Update or create user profile
    const profile = await prismaClient.profile.upsert({
      where: { userId },
      update: {
        bio: bio || undefined,
        location: location || undefined,
        websiteUrl: websiteUrl || undefined,
        githubUrl: githubUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        twitterUrl: twitterUrl || undefined,
        currentStatus: currentStatus || undefined,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
        updatedAt: new Date(),
      },
      create: {
        userId,
        bio: bio || undefined,
        location: location || undefined,
        websiteUrl: websiteUrl || undefined,
        githubUrl: githubUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        twitterUrl: twitterUrl || undefined,
        currentStatus: currentStatus || undefined,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      },
    });

    // Return updated user and profile data
    const updatedUser = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    return NextResponse.json({ user: updatedUser, profile }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}