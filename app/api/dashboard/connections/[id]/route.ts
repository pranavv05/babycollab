import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import getPrismaClient from '@/lib/db'

// DELETE /api/dashboard/connections/[id] - Remove a social connection for the authenticated user
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient()
    
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
