import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/dashboard/roadmaps - Get active roadmaps for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's active roadmaps
    const userRoadmaps = await prisma.userRoadmap.findMany({
      where: {
        userId: userId,
        status: {
          in: ['in_progress', 'active']
        }
      },
      include: {
        roadmap: {
          include: {
            milestones: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 5 // Get only the most recent 5 roadmaps
    })
    
    // Transform the data to match the frontend expectations
    const transformedRoadmaps = userRoadmaps.map((userRoadmap: any) => {
      const roadmap = userRoadmap.roadmap
      const milestones = roadmap.milestones
      
      // Calculate progress
      const totalMilestones = milestones.length
      const completedMilestones = milestones.filter((m: any) => 
        userRoadmap.milestoneProgress.some((mp: any) => 
          mp.milestoneId === m.id && mp.isCompleted
        )
      ).length
      
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
      
      // Calculate estimated time left (simplified)
      const daysSinceStart = Math.ceil((Date.now() - new Date(userRoadmap.startedAt).getTime()) / (1000 * 60 * 60 * 24))
      const estimatedTotalDays = daysSinceStart > 0 && progress > 0 
        ? Math.ceil((daysSinceStart * 100) / progress) 
        : 30
      
      const daysLeft = Math.max(0, estimatedTotalDays - daysSinceStart)
      const dueDate = daysLeft > 0 ? `${daysLeft} days left` : 'Nearly complete'
      
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