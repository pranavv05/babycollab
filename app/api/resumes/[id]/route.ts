import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

// GET /api/resumes/[id] - Get a specific resume by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the resume
    const resume = await prisma.resume.findUnique({
      where: {
        id: id,
        userId: userId,
        isActive: true
      }
    });
    
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    
    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

// PUT /api/resumes/[id] - Update a specific resume by ID
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { templateName, content } = body;
    
    // Check if the resume belongs to the user
    const existingResume = await prisma.resume.findUnique({
      where: {
        id: id,
        userId: userId,
        isActive: true
      }
    });
    
    if (!existingResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    
    // Update the resume
    const updatedResume = await prisma.resume.update({
      where: {
        id: id
      },
      data: {
        templateName,
        content: content ? JSON.parse(JSON.stringify(content)) : null,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({ resume: updatedResume });
  } catch (error) {
    console.error('Error updating resume:', error);
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

// DELETE /api/resumes/[id] - Delete a specific resume by ID
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the resume belongs to the user
    const existingResume = await prisma.resume.findUnique({
      where: {
        id: id,
        userId: userId,
        isActive: true
      }
    });
    
    if (!existingResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    
    // Delete the resume (soft delete by setting isActive to false)
    const deletedResume = await prisma.resume.update({
      where: {
        id: id
      },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });
    
    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}