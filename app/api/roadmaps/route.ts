import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import getPrismaClient from '@/lib/db';
import { ensureUserExists } from '@/lib/user-creation';

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = getAuth(req);
    console.log('POST /api/roadmaps - Auth user ID:', userId);
    
    if (!userId) {
      console.log('POST /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

    const roadmap = await req.json();
    console.log('POST /api/roadmaps - Received roadmap data:', JSON.stringify(roadmap, null, 2));

    // Validate required fields
    if (!roadmap.title) {
      console.log('POST /api/roadmaps - Title is required');
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Get email and full name from session claims
    const email = (sessionClaims?.email as string) || `${userId}@example.com`;
    const fullName = (sessionClaims?.fullName as string) || 'User';
    
    // Ensure user exists with proper data
    const user = await ensureUserExists(prisma, userId, email, fullName);

    // Create the roadmap
    const newRoadmap = await prisma.roadmap.create({
      data: {
        title: roadmap.title,
        description: roadmap.description || '',
        phases: roadmap.phases || [],
        userId: user.id, // Associate the roadmap with the user
      },
    });

    console.log('POST /api/roadmaps - Created roadmap:', JSON.stringify(newRoadmap, null, 2));
    return NextResponse.json(newRoadmap, { status: 201 });
  } catch (error) {
    console.error('POST /api/roadmaps - Failed to save roadmap:', error);
    return NextResponse.json({ error: 'Failed to save roadmap', details: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roadmapId = searchParams.get('id');
  const limit = searchParams.get('limit');
  
  console.log('GET /api/roadmaps - Request params:', { roadmapId, limit });
  
  // If a roadmap ID is provided, fetch that specific roadmap
  if (roadmapId) {
    return getRoadmapById(req, roadmapId);
  }
  
  // Otherwise, fetch all roadmaps for the user (existing functionality)
  try {
    const { userId } = getAuth(req);
    console.log('GET /api/roadmaps - Auth user ID:', userId);
    
    if (!userId) {
      console.log('GET /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

    // Add caching headers for 5 minutes
    const cacheHeaders = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      'CDN-Cache-Control': 'public, s-maxage=300',
    };

    // Get roadmaps for the user directly through the userId field
    const roadmaps = await prisma.roadmap.findMany({
      where: {
        userId: userId
      },
      take: limit ? Math.max(1, Math.min(100, parseInt(limit) || 10)) : undefined // Limit between 1-100, default 10
    });

    // Transform roadmaps to match the expected frontend structure
    const transformedRoadmaps = roadmaps.map((roadmap: any) => {
      // Calculate progress and milestone info from phases and milestones
      let totalMilestones = 0;
      let completedMilestones = 0;
      
      // Safely handle the phases JSON data
      if (Array.isArray(roadmap.phases)) {
        roadmap.phases.forEach((phase: any) => {
          // Type guard to ensure phase is an object with milestones
          if (phase && typeof phase === 'object' && 'milestones' in phase) {
            const phaseObj = phase as { milestones: any[] };
            if (Array.isArray(phaseObj.milestones)) {
              totalMilestones += phaseObj.milestones.length;
              completedMilestones += phaseObj.milestones.filter(m => m && typeof m === 'object' && m.completed === true).length;
            }
          }
        });
      }
      
      const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
      
      return {
        id: roadmap.id,
        title: roadmap.title,
        phase: "In Progress", // Default value, could be enhanced
        progress: progress,
        milestones: {
          completed: completedMilestones,
          total: totalMilestones
        }
      };
    });

    console.log('GET /api/roadmaps - Fetched roadmaps for user:', userId, JSON.stringify(transformedRoadmaps, null, 2));
    return NextResponse.json(transformedRoadmaps, { 
      status: 200,
      headers: cacheHeaders
    });
  } catch (error) {
    console.error('GET /api/roadmaps - Failed to fetch roadmaps:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmaps', details: (error as Error).message }, { status: 500 });
  }
}

async function getRoadmapById(req: NextRequest, roadmapId: string) {
  try {
    const { userId } = getAuth(req);
    console.log('GET /api/roadmaps/[id] - Auth user ID:', userId);
    
    if (!userId) {
      console.log('GET /api/roadmaps/[id] - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

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
    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('GET /api/roadmaps/[id] - Failed to fetch roadmap:', error);
    return NextResponse.json({ error: 'Failed to fetch roadmap', details: (error as Error).message }, { status: 500 });
  }
}

// Add DELETE endpoint for deleting roadmaps
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    console.log('DELETE /api/roadmaps - Auth user ID:', userId);
    
    if (!userId) {
      console.log('DELETE /api/roadmaps - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the prisma client
    const prisma: any = await getPrismaClient();

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
    
    console.log('DELETE /api/roadmaps - Roadmap to delete:', roadmap);

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
    return NextResponse.json({ error: 'Failed to delete roadmap', details: (error as Error).message }, { status: 500 });
  }
}