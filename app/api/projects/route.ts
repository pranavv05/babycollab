import { NextResponse } from 'next/server'
import { getAuth } from '@clerk/nextjs/server'
import { getUserDisplayInfo } from '@/lib/user-utils'
import getPrismaClient from '@/lib/db'
import { ensureUserExists } from '@/lib/user-creation'
import { updateUserWithRealData } from '@/lib/user-data-updater'
import { z } from 'zod'

// Schema for project creation
const CreateProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  skills: z.array(z.string()).optional(),
  teamSize: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
        if (val.includes('-')) {
            const parts = val.split('-');
            return parseInt(parts[1]) || 5;
        }
        return parseInt(val) || 5;
    }
    return 5;
  }),
  dueDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  files: z.array(z.object({
    name: z.string(),
    dataUrl: z.string(),
    size: z.number(),
    type: z.string()
  })).optional()
});

// GET /api/projects - Get projects the user is part of or can discover
export async function GET(req: Request) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req as any);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    // Get the limit and type parameters from the query string
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit');
    const type = url.searchParams.get('type') || 'member'; // 'member' or 'discover'
    
    // Reduce caching for discover projects to ensure new projects appear quickly
    // Member projects can be cached longer since they change less frequently
    const cacheDuration = type === 'member' ? 60 : 0; // 1 min for member, no cache for discover
    const cacheHeaders = {
      'Cache-Control': `no-cache, no-store, must-revalidate`,
      'CDN-Cache-Control': `no-cache`,
      'Pragma': 'no-cache',
      'Expires': '0'
    };
    
    
    if (type === 'member') {
      // Fetch projects where the user is either the creator or a member
      // Optimized query to fetch everything in one go
      const [projectMemberships, createdProjects] = await Promise.all([
        prisma.projectMember.findMany({
          where: {
            userId: userId
          },
          include: {
            project: {
              include: {
                creator: true,
                files: true,
                techStack: true, // Fetch tech stack directly
                members: { // Fetch members directly
                    include: {
                        user: true
                    },
                    take: 5
                }
              }
            },
            user: true
          },
          take: limit ? Math.min(parseInt(limit), 10) : undefined
        }),
        prisma.project.findMany({
          where: {
            creatorId: userId
          },
          include: {
            creator: true,
            files: true,
            techStack: true, // Fetch tech stack directly
            members: { // Fetch members directly
                include: {
                    user: true
                },
                take: 5
            }
          },
          take: limit ? Math.min(parseInt(limit), 10) : undefined
        })
      ]);
      
      // Combine and deduplicate projects
      const allProjectsMap = new Map();
      
      // Add projects from memberships
      projectMemberships.forEach(pm => {
        allProjectsMap.set(pm.project.id, pm.project);
      });
      
      // Add created projects (these should also be considered as member projects)
      createdProjects.forEach(project => {
        // Make sure created projects are also in the map
        if (!allProjectsMap.has(project.id)) {
          allProjectsMap.set(project.id, project);
        }
      });
      
      // Convert map back to array
      const allProjects = Array.from(allProjectsMap.values());
      
      // Transform the data to match the frontend expectations
      // No more await inside map!
      const transformedProjects = allProjects.map((project: any) => {
        // Extract skills from techStack
        const skills = project.techStack ? project.techStack.map((tech: any) => tech.technology) : [];
        
        // Get admin display info
        const adminInfo = getUserDisplayInfo(project.creator);
        
        // Get project members from the included relation
        const members: { name: string; avatar: string }[] = (project.members || [])
          .map((pm: any) => {
            const memberInfo = getUserDisplayInfo(pm.user);
            return {
              name: memberInfo.name,
              avatar: memberInfo.avatarUrl || memberInfo.initials,
            }
          });
        
        // Add creator as a member if not already included
        const creatorInfo = getUserDisplayInfo(project.creator);
        if (!members.some(m => m.name === creatorInfo.name)) {
          members.unshift({
            name: creatorInfo.name,
            avatar: creatorInfo.avatarUrl || creatorInfo.initials,
          });
        }
        
        return {
          id: project.id,
          title: project.title,
          description: project.description || '',
          fullDescription: project.fullDescription || project.description || '',
          status: project.status,
          statusColor: getStatusColor(project.status),
          isMember: true, // User is definitely a member since we filtered for that
          admin: {
            id: project.creatorId,
            name: adminInfo.name,
            avatar: adminInfo.avatarUrl || adminInfo.initials,
          },
          members: members,
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
      
      return NextResponse.json(transformedProjects, { 
        status: 200,
        headers: cacheHeaders
      })
    } else {
      // Discover projects - get projects where the user is NOT a member or creator
      // First, get all projects the user is a member of
      const [projectMemberships, createdProjects] = await Promise.all([
        prisma.projectMember.findMany({
          where: { userId: userId },
          select: { projectId: true }
        }),
        prisma.project.findMany({
          where: { creatorId: userId },
          select: { id: true }
        })
      ]);
      
      const memberProjectIds = new Set<string>();
      
      // Get projects where user is a member
      projectMemberships.forEach(pm => memberProjectIds.add(pm.projectId));
      
      // Get projects where user is the creator
      createdProjects.forEach(p => memberProjectIds.add(p.id));
      
      // Optimization: Fetch discoverable projects directly rather than fetching all and filtering in memory
      // This is much more efficient as the DB grows
      const allProjects = await prisma.project.findMany({
        where: {
          id: {
            notIn: Array.from(memberProjectIds)
          },
          // We can't easily filter by "isRecruiting" here if we want to match the original logic perfectly
          // but typically we'd detailed filters here. 
          // For now, let's keep the exclusion logic simple.
        },
        include: {
          creator: true,
          files: true,
          techStack: true, // Fetch tech stack
          members: { // Fetch members to show who is in it
            include: { user: true },
            take: 4
          }
        },
        take: limit ? Math.min(parseInt(limit), 50) : 50,
        orderBy: {
          createdAt: 'desc' // Order by creation date, newest first
        }
      });

      
      // Transform the data to match the frontend expectations
      // No more await inside map!
      const transformedProjects = allProjects.map((project: any) => {
        // Extract skills from techStack
        const skills = project.techStack ? project.techStack.map((tech: any) => tech.technology) : [];
        
        // Get admin display info
        const adminInfo = getUserDisplayInfo(project.creator);
        
        // Get project members for display (first few members with avatars)
        const members: { name: string; avatar: string }[] = (project.members || []).map((pm: any) => {
          const memberInfo = getUserDisplayInfo(pm.user);
          return {
            name: memberInfo.name,
            avatar: memberInfo.avatarUrl || memberInfo.initials,
          };
        });
        
        // Add creator as a member if not already included
        const creatorInfo = getUserDisplayInfo(project.creator);
        if (!members.some(m => m.name === creatorInfo.name)) {
          members.unshift({
            name: creatorInfo.name,
            avatar: creatorInfo.avatarUrl || creatorInfo.initials,
          });
          // Limit to 4 members total
          if (members.length > 4) {
            members.pop();
          }
        }
        
        return {
          id: project.id,
          title: project.title,
          description: project.description || '',
          fullDescription: project.fullDescription || project.description || '',
          status: project.status,
          statusColor: getStatusColor(project.status),
          isMember: false, // User is NOT a member of these projects
          admin: {
            id: project.creatorId,
            name: adminInfo.name,
            avatar: adminInfo.avatarUrl || adminInfo.initials,
          },
          members: members,
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
      
      return NextResponse.json(transformedProjects, { 
        status: 200,
        headers: cacheHeaders
      })
    }
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
    
    // Get the prisma client
    const prisma = await getPrismaClient();
    
    const body = await req.json()
    
    // Validate input with Zod
    const validationResult = CreateProjectSchema.safeParse(body);
    
    if (!validationResult.success) {
        return NextResponse.json({ 
            error: 'Validation failed', 
            details: validationResult.error.format() 
        }, { status: 400 });
    }

    const { title, description, skills, teamSize, dueDate, files } = validationResult.data;
    
    
    // Get user info from Clerk session claims
    const { sessionClaims } = getAuth(req as any);
    
    // Try to get real email and name from Clerk session
    let email = (sessionClaims?.email as string);
    let fullName = (sessionClaims?.fullName as string);
    
    // Use fallbacks only if absolutely necessary
    email = email || `${userId}@example.com`;
    fullName = fullName || 'User';
    
    // Ensure user exists with proper data
    const creator = await ensureUserExists(prisma, userId, email, fullName);
    
    // Try to update user with real data if they have placeholder data
    await updateUserWithRealData(prisma, userId, email, fullName);
    
    // Create the project
    
    const project: any = await prisma.project.create({
      data: {
        title,
        description,
        fullDescription: description,
        status: 'planning',
        difficultyLevel: 'intermediate',
        maxTeamSize: teamSize,
        currentTeamSize: 1,
        creatorId: creator.id,
        isRecruiting: true, // New projects are recruiting by default
      },
    })
    
    
    // Add creator as project member
    const projectMember = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: creator.id,
        role: 'Owner',
      },
    });
    
    // Create tech stack items
    if (skills && skills.length > 0) {
      // Create tech stack items using Prisma client instead of raw queries
      for (const skill of skills) {
        await prisma.projectTech.create({
          data: {
            projectId: project.id,
            technology: skill,
          }
        });
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
        id: creator.id,
        name: creator.fullName || creator.username || 'Unknown User',
        avatar: creator.avatarUrl || getInitials(creator.fullName || creator.username || 'Unknown User'),
      },
      members: [{
        name: creator.fullName || creator.username || 'Unknown User',
        avatar: creator.avatarUrl || getInitials(creator.fullName || creator.username || 'Unknown User'),
      }],
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
  if (!name) return 'UU';
  
  // Remove any non-printable characters
  const cleanName = name.replace(/[^\x20-\x7E]/g, '');
  
  if (!cleanName.trim()) return 'UU';
  
  return cleanName
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}