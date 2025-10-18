import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/dashboard/connections - Get social connections for the authenticated user
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's social connections
    const connections = await prisma.connection.findMany({
      where: {
        userId: userId
      }
    })
    
    // Transform the data to match the frontend expectations
    const transformedConnections = connections.map((connection: any) => ({
      id: connection.id,
      platform: connection.platform,
      connected: connection.isVerified,
      username: connection.platformUsername
    }))
    
    // Add any missing platforms that the user hasn't connected yet
    const allPlatforms = ['LinkedIn', 'X (Twitter)', 'GitHub', 'Portfolio']
    const existingPlatforms = transformedConnections.map((c: any) => c.platform)
    
    const missingConnections = allPlatforms
      .filter(platform => !existingPlatforms.includes(platform))
      .map(platform => ({
        id: null,
        platform: platform,
        connected: false,
        username: null
      }))
    
    const allConnections = [...transformedConnections, ...missingConnections]
    
    return NextResponse.json(allConnections)
  } catch (error) {
    console.error('Error fetching dashboard connections:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard connections' }, { status: 500 })
  }
}

// POST /api/dashboard/connections - Add or update a social connection for the authenticated user
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { platform, platformUsername, profileUrl } = body
    
    // Create or update connection
    const connection = await prisma.connection.upsert({
      where: {
        userId_platform: {
          userId: userId,
          platform: platform
        }
      },
      update: {
        platformUsername: platformUsername,
        profileUrl: profileUrl,
        isVerified: true,
        connectedAt: new Date()
      },
      create: {
        userId: userId,
        platform: platform,
        platformUsername: platformUsername,
        profileUrl: profileUrl,
        isVerified: true
      }
    })
    
    return NextResponse.json({ 
      message: 'Connection updated successfully',
      connection: {
        id: connection.id,
        platform: connection.platform,
        connected: connection.isVerified,
        username: connection.platformUsername
      }
    })
  } catch (error) {
    console.error('Error updating dashboard connection:', error)
    return NextResponse.json({ error: 'Failed to update dashboard connection' }, { status: 500 })
  }
}

// DELETE /api/dashboard/connections/[id] - Remove a social connection for the authenticated user
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Delete connection
    await prisma.connection.delete({
      where: {
        id: id,
        userId: userId
      }
    })
    
    return NextResponse.json({ message: 'Connection removed successfully' })
  } catch (error) {
    console.error('Error removing dashboard connection:', error)
    return NextResponse.json({ error: 'Failed to remove dashboard connection' }, { status: 500 })
  }
}