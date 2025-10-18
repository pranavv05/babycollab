import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'
import { getAuth } from "@clerk/nextjs/server"

const prisma = new PrismaClient()

// GET /api/projects/[id]/messages - Get all messages for a project
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is a member of the project
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });
    
    if (!projectMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Fetch messages for the project
    const messages = await prisma.projectMessage.findMany({
      where: { projectId: id },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
    
    // Transform messages to match frontend expectations
    const transformedMessages = messages.map((msg) => ({
      id: msg.id,
      userId: msg.userId,
      userName: msg.user?.fullName || msg.user?.username || 'Unknown User',
      userAvatar: msg.user?.fullName ? msg.user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2) : (msg.user?.username ? msg.user.username.substring(0, 2).toUpperCase() : 'UU'),
      message: msg.message,
      timestamp: msg.createdAt.toISOString(),
      type: msg.type,
      fileName: msg.fileName,
      fileSize: msg.fileSize,
    }));
    
    return NextResponse.json(transformedMessages);
  } catch (err) {
    console.error('Error fetching project messages:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// POST /api/projects/[id]/messages - Create a new message
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { message, type, fileName, fileSize } = body;
    
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is a member of the project
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: userId,
        },
      },
    });
    
    if (!projectMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Create the message
    const newMessage = await prisma.projectMessage.create({
      data: {
        projectId: id,
        userId: userId,
        message: message,
        type: type || 'text',
        fileName: fileName || null,
        fileSize: fileSize || null,
      },
      include: { user: true },
    });
    
    // Transform message to match frontend expectations
    const transformedMessage = {
      id: newMessage.id,
      userId: newMessage.userId,
      userName: newMessage.user?.fullName || newMessage.user?.username || 'Unknown User',
      userAvatar: newMessage.user?.fullName ? newMessage.user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2) : (newMessage.user?.username ? newMessage.user.username.substring(0, 2).toUpperCase() : 'UU'),
      message: newMessage.message,
      timestamp: newMessage.createdAt.toISOString(),
      type: newMessage.type,
      fileName: newMessage.fileName,
      fileSize: newMessage.fileSize,
    };
    
    return NextResponse.json(transformedMessage);
  } catch (err) {
    console.error('Error creating project message:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}