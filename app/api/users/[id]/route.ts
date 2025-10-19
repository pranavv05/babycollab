import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/users/[id] - Get user profile data
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch user data
    const user = await prisma.user.findUnique({
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
      name: user.fullName || 'User',
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
  } finally {
    await prisma.$disconnect();
  }
}