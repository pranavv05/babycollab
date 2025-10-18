import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Fetch project with related data
    const project = await prisma.project.findUnique({
      where: { id: id }
    })
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    // Fetch related data separately
    const [members, creator, files, techStack, joinRequests] = await Promise.all([
      prisma.projectMember.findMany({
        where: { projectId: id },
        include: { user: true }
      }),
      prisma.user.findUnique({
        where: { id: project.creatorId }
      }),
      prisma.projectFile.findMany({
        where: { projectId: id }
      }),
      // Use raw query for tech stack since there seems to be an issue with the Prisma client
      prisma.$queryRaw`SELECT * FROM project_tech WHERE project_id = ${id}`,
      prisma.projectJoinRequest.findMany({
        where: {
          projectId: id,
          status: 'pending'
        },
        include: {
          user: true
        }
      })
    ])
    
    // Extract skills from techStack
    const skills = (techStack as any[]).map((tech: any) => tech.technology);
    
    // Transform join requests
    const transformedRequests = joinRequests.map((request: any) => ({
      id: request.id,
      userId: request.userId,
      name: request.user?.fullName || 'Unknown User',
      avatar: request.user?.fullName ? request.user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'UU',
      message: request.message || '',
      createdAt: request.createdAt.toISOString(),
    }))
    
    // Transform the data to match the frontend expectations
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      fullDescription: project.fullDescription || project.description || '',
      status: project.status,
      dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
      adminId: project.creatorId,
      skills: skills,
      members: members.map((member: any) => ({
        id: member.userId,
        name: member.user?.fullName || 'Unknown',
        avatar: getInitials(member.user?.fullName || 'Unknown'),
        role: member.role || 'member',
      })),
      pendingRequests: transformedRequests,
      files: files.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.type,
        uploadedBy: creator?.fullName || 'Unknown',
        uploadedAt: file.createdAt ? file.createdAt.toISOString() : new Date().toISOString(),
        url: file.url,
      })),
    }
    
    return NextResponse.json(transformedProject)
  } catch (err) {
    console.error('Error fetching project:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// NOTE: Join functionality has been moved to /api/projects/[id]/join/route.ts

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // First check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: id },
    })
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    // Delete the project (this will cascade delete related records due to Prisma schema)
    await prisma.project.delete({
      where: { id: id },
    })
    
    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (err) {
    console.error('Error deleting project:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

// Helper function
function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}