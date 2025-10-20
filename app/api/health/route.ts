import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connectivity
    const dbTest = await prisma.$queryRaw`SELECT 1 as connected`
    
    // Test specific table access
    const userCount = await prisma.user.count()
    const projectCount = await prisma.project.count()
    const roadmapCount = await prisma.roadmap.count()
    
    // Get database connection info (without sensitive data)
    const databaseUrl = process.env.DATABASE_URL
    const dbHost = databaseUrl ? databaseUrl.split('@')[1]?.split(':')[0] : 'Unknown'
    
    return NextResponse.json({ 
      success: true, 
      message: 'All systems operational',
      database: {
        connected: true,
        host: dbHost,
        userCount,
        projectCount,
        roadmapCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Health check failed',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message
      } : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}