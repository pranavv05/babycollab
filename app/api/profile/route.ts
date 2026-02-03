import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import getPrismaClient from '@/lib/db';
import { ensureUserExists } from '@/lib/user-creation';
import { updateUserWithRealData } from '@/lib/user-data-updater';
import { ProfileUpdateSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

// GET /api/profile - Get current user's profile data
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Get the prisma client
    const prismaClient = await getPrismaClient();

    // Get real email from Clerk session
    const sessionEmail = sessionClaims?.email as string;
    const sessionFullName = sessionClaims?.fullName as string;
    
    // Use fallbacks only if we absolutely don't have real data from Clerk
    const realEmail = sessionEmail || `${userId}@example.com`;
    const realName = sessionFullName || 'User';
    
    // Ensure user exists with proper data
    await ensureUserExists(prismaClient, userId, realEmail, realName);
    
    // Try to update user with real data if they have placeholder data
    await updateUserWithRealData(prismaClient, userId, sessionEmail, sessionFullName);
    
    // Fetch full user data with relations
    const fullUser = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { 
        profile: true,
        education: true,
        experience: true,
        skills: true
      }
    });

    // Calculate stats
    // Use concurrent queries for better performance
    const [projectsJoined, roadmapsCreated] = await Promise.all([
      prismaClient.projectMember.count({
        where: { userId: userId }
      }),
      prismaClient.roadmap.count({
        where: { userId: userId }
      })
    ]);
    
    // Count completed tasks from milestone progress
    // Since the milestone_progress model is not available in Prisma, we'll set this to 0 for now
    const tasksCompleted = 0;

    return successResponse({ 
      user: fullUser, 
      profile: fullUser?.profile,
      stats: {
        projectsJoined,
        roadmapsCreated,
        tasksCompleted,
        joinedDate: fullUser?.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return errorResponse('Failed to fetch profile', 500);
  }
}

export async function PUT(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    // Get the prisma client
    const prismaClient = await getPrismaClient();

    // Get the request body
    const body = await req.json();
    
    // Validate with Zod
    const validationResult = ProfileUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return errorResponse('Validation failed', 400, validationResult.error.format());
    }
    
    // Extract validated profile data
    const { 
      fullName, 
      bio, 
      location, 
      websiteUrl, 
      githubUrl, 
      linkedinUrl,
      twitterUrl,
      currentStatus,
      yearsOfExperience,
      education,
      experience,
      skills
    } = validationResult.data;

    // Get email from session claims - this is the real email from Clerk
    const sessionEmail = sessionClaims?.email as string;
    const sessionFullName = sessionClaims?.fullName as string;
    
    // Use fallbacks only if we absolutely don't have real data from Clerk
    const email = sessionEmail || `${userId}@example.com`;
    const realName = fullName || sessionFullName || 'User';
    
    // Ensure user exists with proper data
    const user = await ensureUserExists(prismaClient, userId, email, realName);
    
    // Try to update user with real data if they have placeholder data
    await updateUserWithRealData(prismaClient, userId, sessionEmail, sessionFullName);

    // Update or create user profile
    const profile = await prismaClient.profile.upsert({
      where: { userId },
      update: {
        bio,
        location,
        websiteUrl,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        currentStatus,
        yearsOfExperience,
        updatedAt: new Date(),
      },
      create: {
        userId,
        bio,
        location,
        websiteUrl,
        githubUrl,
        linkedinUrl,
        twitterUrl,
        currentStatus,
        yearsOfExperience,
      },
    });

    // Update education records
    if (education && Array.isArray(education)) {
      // Transaction would be better here but we'll stick to simple logic for now
      // Delete existing education records
      await prismaClient.education.deleteMany({
        where: { userId }
      });
      
      // Create new education records
      if (education.length > 0) {
        await prismaClient.education.createMany({
          data: education.map((edu) => ({
            userId,
            institutionName: edu.institutionName || edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.fieldOfStudy || '',
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate ? new Date(edu.endDate) : null,
            isCurrent: edu.isCurrent || false,
            description: edu.description || ''
          }))
        });
      }
    }

    // Update experience records
    if (experience && Array.isArray(experience)) {
      // Delete existing experience records
      await prismaClient.experience.deleteMany({
        where: { userId }
      });
      
      // Create new experience records
      if (experience.length > 0) {
        await prismaClient.experience.createMany({
          data: experience.map((exp) => ({
            userId,
            companyName: exp.companyName || exp.company || '',
            position: exp.position || exp.title || '',
            employmentType: exp.employmentType || '',
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            isCurrent: exp.isCurrent || false,
            description: exp.description || ''
          }))
        });
      }
    }

    // Update skills records
    if (skills && Array.isArray(skills)) {
      // Delete existing skill records
      await prismaClient.skill.deleteMany({
        where: { userId }
      });
      
      // Create new skill records
      if (skills.length > 0) {
        await prismaClient.skill.createMany({
          data: skills
            .filter((skill) => skill && skill.trim() !== '')
            .map((skill) => ({
              userId,
              skillName: skill.trim()
            }))
        });
      }
    }

    // Return updated user and profile data
    const updatedUser = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { 
        profile: true,
        education: true,
        experience: true,
        skills: true
      }
    });

    return successResponse({ user: updatedUser, profile });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return errorResponse('User already exists with this email', 409);
    }
    
    return errorResponse('Failed to update profile', 500);
  }
}