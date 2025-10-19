import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// GET /api/resumes - Get all resumes for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all resumes for the user
    const resumes = await prisma.resume.findMany({
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

// POST /api/resumes - Create a new resume for the authenticated user
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { templateName, content, analysisData, score } = body;
    
    // Create a new resume
    const resume = await prisma.resume.create({
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