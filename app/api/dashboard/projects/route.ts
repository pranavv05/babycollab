import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/dashboard/projects - Get recent projects for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's projects (both created and as member)
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { members: { some: { userId: userId } } }
        ]
      },
      include: {
        members: true,
        techStack: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5 // Get only the most recent 5 projects
    })
    
    // Transform the data to match the frontend expectations
    const transformedProjects = projects.map((project: any) => {
      // Determine status color based on project status
      let statusColor = 'text-muted-foreground'
      switch (project.status.toLowerCase()) {
        case 'active':
        case 'in progress':
          statusColor = 'text-success'
          break
        case 'planning':
          statusColor = 'text-warning'
          break
        case 'review':
          statusColor = 'text-primary'
          break
        case 'completed':
          statusColor = 'text-success'
          break
        case 'on hold':
          statusColor = 'text-warning'
          break
      }
      
      return {
        id: project.id,
        title: project.title,
        status: project.status,
        members: project.members.length,
        dueDate: project.dueDate ? `Due in ${Math.ceil((new Date(project.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days` : 'No due date',
        statusColor: statusColor
      }
    })
    
    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error('Error fetching dashboard projects:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard projects' }, { status: 500 })
  }
}