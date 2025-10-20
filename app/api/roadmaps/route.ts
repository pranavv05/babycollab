import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { prepareRoadmapForDatabase, transformRoadmapForFrontend } from '@/lib/roadmap-utils';

// Use a single Prisma instance
const prisma = new PrismaClient();

// Helper function to handle Netlify-specific issues
async function handleNetlifyRequest(req: NextRequest) {
  // For Netlify, we need to ensure the request URL is properly formatted
  const url = new URL(req.url);
  console.log('Netlify request URL:', url.toString());
  
  return url;
}

export async function POST(req: NextRequest) {
  try {
    // Handle Netlify-specific request formatting
    await handleNetlifyRequest(req);
    
    const auth = getAuth(req);
    const { userId, sessionClaims } = auth;
    console.log('POST /api/roadmaps - Auth result:', JSON.stringify(auth, null, 2));
    
    if (!userId) {
      console.log('POST /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roadmap = await req.json();
    console.log('POST /api/roadmaps - Received roadmap data:', JSON.stringify(roadmap, null, 2));

    // Validate required fields
    if (!roadmap.title) {
      console.log('POST /api/roadmaps - Title is required');
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // First, check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    console.log('POST /api/roadmaps - Existing user:', JSON.stringify(user, null, 2));

    // If user doesn't exist, create them with actual email from Clerk
    if (!user) {
      console.log('POST /api/roadmaps - Creating new user for ID:', userId);
      
      // Get email and full name from session claims
      const email = (sessionClaims?.email as string) || `${userId}@example.com`;
      const fullName = (sessionClaims?.fullName as string) || 'User';
      
      user = await prisma.user.create({
        data: {
          id: userId,
          email: email, // Use actual email from Clerk
          username: email.split('@')[0] || `user_${userId.substring(0, 8)}`, // Use email prefix as username
          fullName: fullName,
        }
      });
      console.log('POST /api/roadmaps - Created new user:', JSON.stringify(user, null, 2));
    }

    // Prepare the roadmap data for saving using our utility function
    const preparedRoadmap = prepareRoadmapForDatabase(roadmap);
    console.log('POST /api/roadmaps - Prepared roadmap data:', JSON.stringify(preparedRoadmap, null, 2));
    
    // Create the roadmap
    const newRoadmap = await prisma.roadmap.create({
      data: {
        title: preparedRoadmap.title,
        description: preparedRoadmap.description,
        phases: preparedRoadmap.phases, // This will be automatically converted to JSON by Prisma
        userId: user.id, // Associate the roadmap with the user
      },
    });

    console.log('POST /api/roadmaps - Created roadmap:', JSON.stringify(newRoadmap, null, 2));
    
    // Transform the roadmap for frontend use before sending
    const transformedRoadmap = transformRoadmapForFrontend(newRoadmap);
    console.log('POST /api/roadmaps - Transformed roadmap for frontend:', JSON.stringify(transformedRoadmap, null, 2));
    
    return NextResponse.json(transformedRoadmap, { status: 201 });
  } catch (error) {
    console.error('POST /api/roadmaps - Failed to save roadmap:', error);
    return NextResponse.json({ 
      error: 'Failed to save roadmap', 
      details: (error as Error).message,
      // Add more context for debugging in production
      timestamp: new Date().toISOString(),
      endpoint: 'POST /api/roadmaps'
    }, { status: 500 });
  } finally {
    // Ensure Prisma client is properly disconnected in serverless environments
    await prisma.$disconnect().catch(() => {
      // Ignore disconnection errors in serverless environments
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Handle Netlify-specific request formatting
    await handleNetlifyRequest(req);
    
    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get('id');
    const limit = searchParams.get('limit');
    
    console.log('GET /api/roadmaps - Request params:', { roadmapId, limit });
    
    // If a roadmap ID is provided, fetch that specific roadmap
    if (roadmapId) {
      return getRoadmapById(req, roadmapId);
    }
    
    // Otherwise, fetch all roadmaps for the user (existing functionality)
    const auth = getAuth(req);
    const { userId } = auth;
    console.log('GET /api/roadmaps - Auth result:', JSON.stringify(auth, null, 2));
    
    if (!userId) {
      console.log('GET /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get roadmaps for the user directly through the userId field
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      },
      take: limit ? Math.max(1, Math.min(100, parseInt(limit) || 10)) : undefined, // Limit between 1-100, default 10
      orderBy: {
        createdAt: 'desc' // Order by creation date, newest first
      }
    });

    console.log('GET /api/roadmaps - Fetched roadmaps from database:', JSON.stringify(roadmaps, null, 2));

    // Transform roadmaps to match the expected frontend structure
    const transformedRoadmaps = roadmaps.map(roadmap => {
      // Transform using our utility function
      const transformed = transformRoadmapForFrontend(roadmap);
      
      // Calculate progress and milestone info from phases and milestones
      let totalMilestones = 0;
      let completedMilestones = 0;
      
      // Safely handle the phases data
      let normalizedPhases = [];
      if (Array.isArray(transformed.phases)) {
        normalizedPhases = transformed.phases;
      } else if (transformed.phases && typeof transformed.phases === 'object') {
        // If it's an object, convert to array
        normalizedPhases = Object.values(transformed.phases);
      }
      
      normalizedPhases.forEach((phase: any) => {
        // Type guard to ensure phase is an object with milestones
        if (phase && typeof phase === 'object' && 'milestones' in phase) {
          const phaseObj = phase as { milestones: any[] };
          if (Array.isArray(phaseObj.milestones)) {
            totalMilestones += phaseObj.milestones.length;
            completedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length;
          }
        }
      });
      
      const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
      
      return {
        id: transformed.id,
        title: transformed.title,
        description: transformed.description,
        phase: "In Progress", // Default value, could be enhanced
        progress: progress,
        milestones: {
          completed: completedMilestones,
          total: totalMilestones
        },
        createdAt: transformed.createdAt
      };
    });

    console.log('GET /api/roadmaps - Transformed roadmaps for frontend:', JSON.stringify(transformedRoadmaps, null, 2));
    return NextResponse.json(transformedRoadmaps, { 
      status: 200
    });
  } catch (error) {
    console.error('GET /api/roadmaps - Failed to fetch roadmaps:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch roadmaps', 
      details: (error as Error).message,
      // Add more context for debugging in production
      timestamp: new Date().toISOString(),
      endpoint: 'GET /api/roadmaps'
    }, { status: 500 });
  } finally {
    // Ensure Prisma client is properly disconnected in serverless environments
    await prisma.$disconnect().catch(() => {
      // Ignore disconnection errors in serverless environments
    });
  }
}

async function getRoadmapById(req: NextRequest, roadmapId: string) {
  try {
    const auth = getAuth(req);
    const { userId } = auth;
    console.log('GET /api/roadmaps/[id] - Auth result:', JSON.stringify(auth, null, 2));
    
    if (!userId) {
      console.log('GET /api/roadmaps/[id] - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`GET /api/roadmaps/[id] - Fetching roadmap with ID: ${roadmapId} for user: ${userId}`);

    // Check if the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });

    if (!roadmap) {
      console.log(`GET /api/roadmaps/[id] - Roadmap not found or not owned by user. ID: ${roadmapId}, User: ${userId}`);
      // Let's also check if the roadmap exists at all (not owned by this user)
      const anyRoadmap = await prisma.roadmap.findUnique({
        where: { 
          id: roadmapId
        }
      });
      
      if (anyRoadmap) {
        console.log(`GET /api/roadmaps/[id] - Roadmap exists but is owned by another user. Owner: ${anyRoadmap.userId}`);
        return NextResponse.json({ error: 'Roadmap not found or not accessible' }, { status: 404 });
      } else {
        console.log(`GET /api/roadmaps/[id] - Roadmap does not exist in database`);
        return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
      }
    }

    console.log('GET /api/roadmaps/[id] - Fetched roadmap:', JSON.stringify(roadmap, null, 2));
    // Transform the roadmap for frontend use before sending using our utility function
    const transformedRoadmap = transformRoadmapForFrontend(roadmap);
    console.log('GET /api/roadmaps/[id] - Transformed roadmap for frontend:', JSON.stringify(transformedRoadmap, null, 2));
    
    return NextResponse.json(transformedRoadmap);
  } catch (error) {
    console.error('GET /api/roadmaps/[id] - Failed to fetch roadmap:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch roadmap', 
      details: (error as Error).message,
      // Add more context for debugging in production
      timestamp: new Date().toISOString(),
      endpoint: 'GET /api/roadmaps/[id]',
      roadmapId: roadmapId
    }, { status: 500 });
  } finally {
    // Ensure Prisma client is properly disconnected in serverless environments
    await prisma.$disconnect().catch(() => {
      // Ignore disconnection errors in serverless environments
    });
  }
}

// Add DELETE endpoint for deleting roadmaps
export async function DELETE(req: NextRequest) {
  try {
    // Handle Netlify-specific request formatting
    await handleNetlifyRequest(req);
    
    const auth = getAuth(req);
    const { userId } = auth;
    console.log('DELETE /api/roadmaps - Auth result:', JSON.stringify(auth, null, 2));
    
    if (!userId) {
      console.log('DELETE /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get('id');
    console.log('DELETE /api/roadmaps - Roadmap ID to delete:', roadmapId);

    if (!roadmapId) {
      console.log('DELETE /api/roadmaps - Roadmap ID is required');
      return NextResponse.json({ error: 'Roadmap ID is required' }, { status: 400 });
    }

    // Check if the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });
    
    console.log('DELETE /api/roadmaps - Roadmap to delete:', JSON.stringify(roadmap, null, 2));

    if (!roadmap) {
      console.log('DELETE /api/roadmaps - Roadmap not found or not owned by user');
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    // Delete the roadmap
    await prisma.roadmap.delete({
      where: { id: roadmapId }
    });
    
    console.log('DELETE /api/roadmaps - Roadmap deleted successfully');

    return NextResponse.json({ message: 'Roadmap deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/roadmaps - Failed to delete roadmap:', error);
    return NextResponse.json({ 
      error: 'Failed to delete roadmap', 
      details: (error as Error).message,
      // Add more context for debugging in production
      timestamp: new Date().toISOString(),
      endpoint: 'DELETE /api/roadmaps'
    }, { status: 500 });
  } finally {
    // Ensure Prisma client is properly disconnected in serverless environments
    await prisma.$disconnect().catch(() => {
      // Ignore disconnection errors in serverless environments
    });
  }
}