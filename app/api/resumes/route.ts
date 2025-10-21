import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'
import { ensureUserExists } from '@/lib/user-creation'

// POST /api/resumes - Create a new resume for the authenticated user
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId, sessionClaims } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prismaClient = await getPrismaClient();
    
    // Ensure user exists in database before creating resume
    const email = (sessionClaims?.email as string) || `${userId}@example.com`;
    const fullName = (sessionClaims?.fullName as string) || 'User';
    const user = await ensureUserExists(prismaClient, userId, email, fullName);

    const body = await req.json();
    const { templateName, content, analysisData, score } = body;
    
    // Create a new resume
    const resume = await prismaClient.resume.create({
      data: {
        userId,
        templateName: templateName || 'Default Resume',
        content: content ? JSON.parse(JSON.stringify(content)) : null,
        isActive: true
      }
    });
    
    return NextResponse.json({ resume, analysisData, score });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}

// GET /api/resumes - Get all resumes for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prismaClient = await getPrismaClient();
    
    // Get all resumes for the user
    const resumes = await prismaClient.resume.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}