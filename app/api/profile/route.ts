import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

// GET /api/profile - Get current user's profile data
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user and profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
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
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // If user doesn't exist, we need to get their info from Clerk and create them
    if (!user) {
      // Create user with actual email from Clerk
      user = await prisma.user.create({
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
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          email: email, // Always use the real email from Clerk
          fullName: fullName || (sessionClaims?.fullName as string) || user.fullName || 'User',
        },
      });
    }

    // Update or create user profile
    const profile = await prisma.profile.upsert({
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
    const updatedUser = await prisma.user.findUnique({
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