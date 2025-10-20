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
    
    // Get user's roadmaps directly from the Roadmap model
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
      // Since we don't have milestone data in this model, we'll create default values
      const totalMilestones = 0
      const completedMilestones = 0
      const progress = 0
      
      // Determine phase based on progress (default to Foundation)
      let phase = 'Foundation'
      
      // Calculate estimated time left (simplified)
      const createdAt = roadmap.createdAt || new Date()
      const daysSinceStart = Math.ceil((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
      const estimatedTotalDays = 30 // Default value
      
      const daysLeft = Math.max(0, estimatedTotalDays - daysSinceStart)
      const dueDate = daysLeft > 0 ? `${daysLeft} days left` : 'Nearly complete'
      
      return {
        id: roadmap.id,
        title: roadmap.title || 'Untitled Roadmap',
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
  } finally {
    await prisma.$disconnect()
  }
}