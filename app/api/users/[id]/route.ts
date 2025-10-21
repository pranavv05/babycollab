import { NextResponse } from "next/server";
import getPrismaClient from '@/lib/db';
import { getAuth } from '@clerk/nextjs/server';

// GET /api/users/[id] - Get user profile data
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Fetch user data
    let user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        profile: true,
        skills: true,
        education: true,
        experience: true,
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if user has placeholder data that should be updated
    const hasPlaceholderEmail = user.email.endsWith('@example.com');
    const hasGenericName = 
      user.fullName === 'Project Creator' || 
      user.fullName === 'Project Member' || 
      user.fullName === 'User' ||
      user.fullName.startsWith('User-') ||
      user.fullName.startsWith('user_') ||
      (user.fullName.includes('User ') && user.fullName.length < 20) ||
      (user.fullName.includes('user_') && user.fullName.length > 20);
    
    // Update user with real data if needed
    if (hasPlaceholderEmail || hasGenericName) {
      // Try to get real data from the requesting user's session if they're the same user
      const { userId, sessionClaims } = getAuth(req as any);
      
      if (userId === id) {
        // This is the user requesting their own data, update with real info from session
        const realEmail = (sessionClaims?.email as string) || user.email;
        const realName = (sessionClaims?.fullName as string) || user.fullName || 'User';
        
        user = await prisma.user.update({
          where: { id: id },
          data: {
            email: realEmail,
            fullName: realName,
          },
          include: {
            profile: true,
            skills: true,
            education: true,
            experience: true,
          }
        });
      }
    }
    
    // Calculate stats
    const projectsJoined = await prisma.projectMember.count({
      where: { userId: id }
    });
    
    const roadmapsCreated = await prisma.roadmap.count({
      where: { userId: id }
    });
    
    // Count completed tasks from milestone progress
    // Since the milestone_progress model is not available in Prisma, we'll set this to 0 for now
    const tasksCompleted = 0;
    
    // Transform the data to match the frontend expectations
    const transformedUser = {
      id: user.id,
      name: user.fullName || user.username || 'User',
      email: user.email,
      avatar: user.avatarUrl, // Include the avatar URL directly
      role: user.role,
      bio: user.profile?.bio || '',
      location: user.profile?.location || '',
      websiteUrl: user.profile?.websiteUrl || '',
      githubUrl: user.profile?.githubUrl || '',
      linkedinUrl: user.profile?.linkedinUrl || '',
      twitterUrl: user.profile?.twitterUrl || '',
      currentStatus: user.profile?.currentStatus || '',
      yearsOfExperience: user.profile?.yearsOfExperience || 0,
      skills: user.skills.map(skill => skill.skillName),
      education: user.education.map(edu => ({
        id: edu.id,
        institutionName: edu.institutionName,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        isCurrent: edu.isCurrent,
        description: edu.description,
      })),
      experience: user.experience.map(exp => ({
        id: exp.id,
        companyName: exp.companyName,
        position: exp.position,
        employmentType: exp.employmentType,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrent: exp.isCurrent,
        description: exp.description,
      })),
      stats: {
        projectsJoined: projectsJoined,
        roadmapsCreated: roadmapsCreated,
        tasksCompleted: tasksCompleted,
        joinedDate: user.createdAt.toISOString(),
      }
    };
    
    return NextResponse.json(transformedUser);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update user profile data (for self-updates)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId || userId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: body.fullName,
        email: body.email,
      },
    });
    
    // Update or create user profile
    const userProfile = await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        bio: body.bio,
        location: body.location,
      },
      create: {
        userId: userId,
        bio: body.bio,
        location: body.location,
      },
    });
    
    return NextResponse.json({ 
      message: "Profile updated successfully",
      user: updatedUser,
      profile: userProfile
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}