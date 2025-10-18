import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

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

    // Get email from session claims
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
          fullName: fullName || 'User',
        }
      });
    } else if (fullName) {
      // Update user's full name if provided
      user = await prisma.user.update({
        where: { id: userId },
        data: { fullName },
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