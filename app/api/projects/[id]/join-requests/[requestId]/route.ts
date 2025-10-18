import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// POST /api/projects/[id]/join-requests/[requestId] - Accept or reject a join request
export async function POST(req: Request, { params }: { params: Promise<{ id: string; requestId: string }> }) {
  try {
    const { id, requestId } = await params;
    const body = await req.json()
    const { action } = body // 'accept' or 'reject'
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the user is the project creator/admin
    const project = await prisma.project.findUnique({
      where: { 
        id: id
      }
    });
    
    // If project doesn't exist or user is not the creator, return error
    if (!project || project.creatorId !== userId) {
      return NextResponse.json({ error: 'Project not found or you are not authorized to manage this project' }, { status: 404 });
    }
    
    // Find the join request
    const joinRequest = await prisma.projectJoinRequest.findUnique({
      where: {
        id: requestId,
        projectId: id
      },
      include: {
        user: true,
        project: true
      }
    })
    
    if (!joinRequest) {
      return NextResponse.json({ error: 'Join request not found' }, { status: 404 })
    }
    
    if (action === 'accept') {
      // Add user as project member
      await prisma.projectMember.create({
        data: {
          projectId: id,
          userId: joinRequest.userId,
          role: 'Member'
        }
      })
      
      // Update the join request status
      await prisma.projectJoinRequest.update({
        where: { id: requestId },
        data: { status: 'approved' }
      })
      
      // Update project team size
      await prisma.project.update({
        where: { id: id },
        data: {
          currentTeamSize: {
            increment: 1
          }
        }
      })
      
      // In a real app, you would send a notification to the user here
      
      return NextResponse.json({ message: 'User added to project successfully' })
    } else if (action === 'reject') {
      // Update the join request status
      await prisma.projectJoinRequest.update({
        where: { id: requestId },
        data: { status: 'rejected' }
      })
      
      // In a real app, you would send a notification to the user here
      
      return NextResponse.json({ message: 'Join request rejected' })
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error processing join request:', error)
    return NextResponse.json({ error: 'Failed to process join request' }, { status: 500 })
  }
}