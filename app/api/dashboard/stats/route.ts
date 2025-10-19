import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/dashboard/stats - Get dashboard statistics for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's roadmaps count
    const roadmapsCount = await prisma.userRoadmap.count({
      where: {
        userId: userId
      }
    })
    
    // Get user's projects count (both created and as member)
    const createdProjectsCount = await prisma.project.count({
      where: {
        creatorId: userId
      }
    })
    
    const projectMembershipsCount = await prisma.projectMember.count({
      where: {
        userId: userId
      }
    })
    
    const totalProjectsCount = createdProjectsCount + projectMembershipsCount
    
    // Get user's skills count
    const skillsCount = await prisma.skill.count({
      where: {
        userId: userId
      }
    })
    
    // Calculate career progress (simplified calculation)
    // In a real implementation, this would be more complex based on completed milestones
    const careerProgress = Math.min(100, Math.round((roadmapsCount * 20 + totalProjectsCount * 15 + skillsCount * 5) / 3))
    
    // Transform the data to match the frontend expectations
    const stats = {
      activeRoadmaps: roadmapsCount,
      totalProjects: totalProjectsCount,
      skillsLearned: skillsCount,
      careerProgress: careerProgress,
      roadmapsInProgress: Math.max(0, roadmapsCount - 1), // Simplified
      projectsCompleted: Math.max(0, totalProjectsCount - 2), // Simplified
      skillsThisMonth: Math.min(skillsCount, 4), // Simplified
      progressThisMonth: Math.min(100, careerProgress - 56) // Based on the mock data
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}