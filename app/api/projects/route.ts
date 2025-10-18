import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getAuth } from '@clerk/nextjs/server'

const prisma = new PrismaClient()

// GET /api/projects - Get all projects
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    // Fetch projects with members and creator
    const projects = await prisma.project.findMany({
      include: {
        members: true,
        creator: true,
        files: true,
      }
    })
    
    // For each project, fetch its tech stack separately
    const projectsWithTech = await Promise.all(
      projects.map(async (project: any) => {
        // Use Prisma's findMany instead of raw query to avoid SQLite uuid() function issues
        const techStack = await prisma.$queryRawUnsafe(`SELECT * FROM project_tech WHERE project_id = '${project.id}'`) as any[];
        return { ...project, techStack };
      })
    );
    
    // Transform the data to match the frontend expectations
    const transformedProjects = projectsWithTech.map((project: any) => {
      // Extract skills from techStack
      const skills = project.techStack.map((tech: any) => tech.technology);
      
      return {
        id: project.id,
        title: project.title,
        description: project.description || '',
        fullDescription: project.fullDescription || project.description || '',
        status: project.status,
        statusColor: getStatusColor(project.status),
        isMember: userId ? project.members.some((member: any) => member.userId === userId) : false,
        admin: {
          name: project.creator?.fullName || project.creator?.username || 'Unknown User',
          avatar: getInitials(project.creator?.fullName || project.creator?.username || 'Unknown User'),
        },
        members: project.members.map((member: any) => ({
          name: member.role === 'Owner' ? (project.creator?.fullName || project.creator?.username || 'Project Creator') : 'Project Member',
          avatar: member.role === 'Owner' ? getInitials(project.creator?.fullName || project.creator?.username || 'Project Creator') : 'PM',
        })),
        tasks: { todo: 0, inProgress: 0, done: 0 }, // These would be calculated from actual tasks
        dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
        createdAt: project.createdAt.toISOString(),
        skills: skills,
        teamSize: project.currentTeamSize,
        openPositions: Math.max(0, (project.maxTeamSize || 0) - project.currentTeamSize),
        goals: [], // These would come from project goals in the database
        files: project.files.map((file: any) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
        })) || [],
      }
    })
    
    return NextResponse.json(transformedProjects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects - Create a new project
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json()
    const { title, description, skills, teamSize, dueDate, files } = body
    
    // Parse team size
    let maxTeamSize = 5
    if (teamSize) {
      if (typeof teamSize === 'string' && teamSize.includes('-')) {
        const parts = teamSize.split('-')
        maxTeamSize = parseInt(parts[1]) || 5
      } else if (typeof teamSize === 'string') {
        maxTeamSize = parseInt(teamSize) || 5
      } else {
        maxTeamSize = teamSize
      }
    }
    
    // First, check if user exists in our database
    let creator = await prisma.user.findUnique({
      where: { id: userId }
    });

    // If user doesn't exist, create them
    if (!creator) {
      // Get user info from Clerk session claims
      const { sessionClaims } = getAuth(req as any);
      const email = (sessionClaims?.email as string) || `${userId}@example.com`;
      const fullName = (sessionClaims?.fullName as string) || 'User';
      
      // Generate a unique username
      let username = email.split('@')[0] || `user_${userId.substring(0, 8)}`;
      let userExists = await prisma.user.findUnique({
        where: { username: username }
      });
      
      // If username exists, append a timestamp to make it unique
      if (userExists) {
        username = `user_${userId.substring(0, 8)}_${Date.now()}`;
      }
      
      creator = await prisma.user.create({
        data: {
          id: userId,
          email: email,
          username: username,
          fullName: fullName,
        },
      });
    }
    
    // Create the project
    const project: any = await prisma.project.create({
      data: {
        title,
        description,
        fullDescription: description,
        status: 'planning',
        difficultyLevel: 'intermediate',
        maxTeamSize,
        currentTeamSize: 1,
        creatorId: creator.id,
      },
    })
    
    // Add creator as project member
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: creator.id,
        role: 'Owner',
      },
    })
    
    // Create tech stack items
    if (skills && skills.length > 0) {
      // Create tech stack items using a loop instead of raw queries
      for (const skill of skills) {
        await prisma.$executeRawUnsafe(`INSERT INTO project_tech (id, project_id, technology) VALUES (lower(hex(randomblob(16))), '${project.id}', '${skill}')`);
      }
    }
    
    // Create project files if provided
    if (files && files.length > 0) {
      for (const file of files) {
        await prisma.projectFile.create({
          data: {
            name: file.name,
            url: file.dataUrl, // In a real app, you'd upload to storage and get a URL
            size: file.size,
            type: file.type,
            projectId: project.id,
          },
        })
      }
    }
    
    // Transform the project to match frontend expectations
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description || '',
      fullDescription: project.fullDescription || project.description || '',
      status: project.status,
      statusColor: getStatusColor(project.status),
      isMember: true, // Creator is automatically a member
      admin: {
        name: creator.fullName || creator.username || 'Project Creator',
        avatar: getInitials(creator.fullName || creator.username || 'Project Creator'),
      },
      members: [{
        name: creator.fullName || creator.username || 'Project Creator',
        avatar: getInitials(creator.fullName || creator.username || 'Project Creator'),
      }],
      tasks: { todo: 0, inProgress: 0, done: 0 },
      dueDate: project.dueDate ? project.dueDate.toISOString() : undefined,
      createdAt: project.createdAt.toISOString(),
      skills: skills || [],
      teamSize: project.currentTeamSize,
      openPositions: Math.max(0, (project.maxTeamSize || 0) - project.currentTeamSize),
      goals: [],
      files: files ? files.map((file: any) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.dataUrl,
      })) : [],
    }
    
    return NextResponse.json(transformedProject)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project: ' + (error as Error).message }, { status: 500 })
  }
}

// Helper functions
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in progress':
      return 'text-success'
    case 'planning':
      return 'text-muted-foreground'
    case 'review':
      return 'text-primary'
    case 'completed':
      return 'text-success'
    case 'on hold':
      return 'text-warning'
    default:
      return 'text-muted-foreground'
  }
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}