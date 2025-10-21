import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'

// GET /api/dashboard/roadmaps - Get active roadmaps for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
    // Get user's roadmaps
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5 // Get only the most recent 5 roadmaps
    })
    
    // Transform the data to match the frontend expectations
    const transformedRoadmaps = roadmaps.map((roadmap: any) => {
      // Calculate progress from phases and milestones
      let totalMilestones = 0
      let completedMilestones = 0
      
      // Safely handle the phases JSON data
      if (Array.isArray(roadmap.phases)) {
        roadmap.phases.forEach((phase: any) => {
          // Type guard to ensure phase is an object with milestones
          if (phase && typeof phase === 'object' && 'milestones' in phase) {
            const phaseObj = phase as { milestones: any[] }
            if (Array.isArray(phaseObj.milestones)) {
              totalMilestones += phaseObj.milestones.length
              completedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length
            }
          }
        })
      }
      
      const progress = totalMilestones > 0 
        ? Math.round((completedMilestones / totalMilestones) * 100) 
        : 0
      
      // Determine phase based on progress
      let phase = 'Foundation'
      if (progress >= 80) {
        phase = 'Advanced'
      } else if (progress >= 50) {
        phase = 'Intermediate'
      }
      
      // For due date, we'll use a simple approach since we don't have start dates
      const dueDate = progress < 100 ? 'In Progress' : 'Completed'
      
      return {
        id: roadmap.id,
        title: roadmap.title,
        progress: progress,
        phase: phase,
        dueDate: dueDate,
        milestones: {
          completed: completedMilestones,
          total: totalMilestones
        }
      }
    })
    
    return NextResponse.json(transformedRoadmaps)
  } catch (error) {
    console.error('Error fetching dashboard roadmaps:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard roadmaps' }, { status: 500 })
  }
}