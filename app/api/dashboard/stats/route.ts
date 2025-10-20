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
    
    // Add caching headers for 5 minutes
    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      'CDN-Cache-Control': 'public, s-maxage=300',
    }
    
    // Optimize queries by using a single transaction
    const [
      roadmaps,
      createdProjects,
      projectMemberships
    ] = await Promise.all([
      // Get user's roadmaps with phases and milestones
      prisma.roadmap.findMany({
        where: {
          userId: userId
        },
        select: {
          id: true,
          title: true,
          phases: true,
          createdAt: true
        }
      }),
      // Get projects where user is creator
      prisma.project.findMany({
        where: {
          creatorId: userId
        },
        select: {
          id: true,
          title: true,
          status: true
        }
      }),
      // Get projects where user is member
      prisma.projectMember.findMany({
        where: {
          userId: userId
        },
        select: {
          project: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      })
    ])
    
    // Calculate active roadmaps and completed milestones
    let activeRoadmaps = 0
    let completedMilestones = 0
    let totalMilestones = 0
    let roadmapsInProgress = 0 // Add this counter
    
    roadmaps.forEach(roadmap => {
      // Parse phases JSON and count milestones
      let phases: any[] = []
      if (typeof roadmap.phases === 'string') {
        try {
          phases = JSON.parse(roadmap.phases)
        } catch (e) {
          phases = []
        }
      } else if (Array.isArray(roadmap.phases)) {
        phases = roadmap.phases
      }
      
      // Count total and completed milestones
      let roadmapTotalMilestones = 0
      let roadmapCompletedMilestones = 0
      
      phases.forEach(phase => {
        if (phase && typeof phase === 'object' && 'milestones' in phase) {
          const phaseObj = phase as { milestones: any[] }
          if (Array.isArray(phaseObj.milestones)) {
            roadmapTotalMilestones += phaseObj.milestones.length
            roadmapCompletedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length
          }
        }
      })
      
      // Add to totals
      totalMilestones += roadmapTotalMilestones
      completedMilestones += roadmapCompletedMilestones
      
      // Count roadmaps in progress (has milestones but not fully completed)
      if (roadmapTotalMilestones > 0 && roadmapCompletedMilestones < roadmapTotalMilestones) {
        activeRoadmaps++
        roadmapsInProgress++ // Increment roadmaps in progress counter
      }
    })
    
    // Create a set to deduplicate projects (in case user is both creator and member)
    const projectSet = new Set()
    const allProjects: { id: string; title: string; status: string }[] = []
    
    // Add created projects
    createdProjects.forEach(project => {
      if (!projectSet.has(project.id)) {
        projectSet.add(project.id)
        allProjects.push(project)
      }
    })
    
    // Add project memberships
    projectMemberships.forEach(pm => {
      if (!projectSet.has(pm.project.id)) {
        projectSet.add(pm.project.id)
        allProjects.push(pm.project)
      }
    })
    
    const totalProjects = allProjects.length
    
    // Count project statuses
    let projectsInProgress = 0
    let projectsCompleted = 0
    
    allProjects.forEach(project => {
      // Add safety checks for project status
      if (project && project.status) {
        const status = project.status.toLowerCase()
        if (status === 'completed') {
          projectsCompleted++
        } else if (status !== 'planning' && status !== 'planned') {
          projectsInProgress++
        }
      }
    })
    
    // Calculate skills learned from completed milestones
    // For simplicity, we'll assume each completed milestone contributes to skill learning
    const skillsLearned = Math.max(0, completedMilestones)
    
    // Calculate career progress (0-100%)
    let careerProgress = 0
    if (totalMilestones > 0) {
      careerProgress = Math.max(0, Math.min(100, Math.round((completedMilestones / totalMilestones) * 100)))
    }
    
    // Calculate progress this month (simplified)
    const oneMonthAgo = new Date()
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30) // More accurate than setMonth
    
    const recentRoadmaps = roadmaps.filter(roadmap => {
      // Add safety checks for roadmap creation date
      if (!roadmap || !roadmap.createdAt) return false
      try {
        const roadmapDate = new Date(roadmap.createdAt)
        // Ensure the date is valid
        return roadmapDate instanceof Date && !isNaN(roadmapDate.getTime()) && roadmapDate >= oneMonthAgo
      } catch (e) {
        return false
      }
    })
    
    let recentCompletedMilestones = 0
    let recentTotalMilestones = 0
    
    recentRoadmaps.forEach(roadmap => {
      let phases: any[] = []
      if (typeof roadmap.phases === 'string') {
        try {
          phases = JSON.parse(roadmap.phases)
        } catch (e) {
          phases = []
        }
      } else if (Array.isArray(roadmap.phases)) {
        phases = roadmap.phases
      }
      
      phases.forEach(phase => {
        if (phase && typeof phase === 'object' && 'milestones' in phase) {
          const phaseObj = phase as { milestones: any[] }
          if (Array.isArray(phaseObj.milestones)) {
            recentTotalMilestones += phaseObj.milestones.length
            recentCompletedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length
          }
        }
      })
    })
    
    // Ensure progress percentage is not negative and capped at 100%
    const progressThisMonth = recentTotalMilestones > 0 
      ? Math.max(0, Math.min(100, Math.round((recentCompletedMilestones / recentTotalMilestones) * 100)))
      : 0
    
    // Transform the data to match the frontend expectations
    const stats = {
      activeRoadmaps: Math.max(0, activeRoadmaps),
      totalProjects: Math.max(0, totalProjects),
      skillsLearned: Math.max(0, skillsLearned),
      careerProgress: Math.max(0, Math.min(100, careerProgress)),
      roadmapsInProgress: Math.max(0, roadmapsInProgress), // Fixed: use correct variable
      projectsCompleted: Math.max(0, projectsCompleted),
      skillsThisMonth: Math.max(0, recentCompletedMilestones),
      progressThisMonth: Math.max(0, progressThisMonth)
    }
    
    return NextResponse.json(stats, { 
      status: 200,
      headers: cacheHeaders
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}