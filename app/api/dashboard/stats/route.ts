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
      createdProjects,
      projectMemberships
    ] = await Promise.all([
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
    
    // Transform the data to match the frontend expectations
    const stats = {
      totalProjects: Math.max(0, totalProjects),
      projectsCompleted: Math.max(0, projectsCompleted),
      projectsInProgress: Math.max(0, projectsInProgress),
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