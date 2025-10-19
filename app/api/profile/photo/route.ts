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
    
    // Extract avatar URL
    const { avatarUrl } = body;

    // Get email from session claims
    const email = (sessionClaims?.email as string) || `${userId}@example.com`;

    // First, check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // If user doesn't exist, create a basic user record
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: email, // Use actual email from Clerk
          username: email.split('@')[0] || `user_${userId.substring(0, 8)}`, // Use email prefix as username
          fullName: 'User',
        }
      });
    }

    // Update user's avatar URL
    user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    // Return updated user data
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating profile photo:', error);
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
    }
    
    return NextResponse.json({ error: 'Failed to update profile photo' }, { status: 500 });
  }
}