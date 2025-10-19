import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    console.log('PUT /api/roadmaps/[id]/progress - Auth user ID:', userId);
    
    if (!userId) {
      console.log('PUT /api/roadmaps/[id]/progress - Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roadmapId = params.id;
    const { milestoneId, completed } = await req.json();
    
    console.log('PUT /api/roadmaps/[id]/progress - Request data:', { roadmapId, milestoneId, completed });

    // Check if the roadmap belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });

    if (!roadmap) {
      console.log('PUT /api/roadmaps/[id]/progress - Roadmap not found or not owned by user');
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    // Parse the phases JSON data
    let updatedPhases: any[] = [];
    if (typeof roadmap.phases === 'string') {
      try {
        updatedPhases = JSON.parse(roadmap.phases);
      } catch (e) {
        updatedPhases = [];
      }
    } else if (Array.isArray(roadmap.phases)) {
      updatedPhases = [...roadmap.phases];
    }
    
    // Find and update the specific milestone
    let milestoneFound = false;
    for (const phase of updatedPhases) {
      if (phase && typeof phase === 'object' && 'milestones' in phase) {
        const phaseObj = phase as { milestones: any[] };
        if (Array.isArray(phaseObj.milestones)) {
          for (let i = 0; i < phaseObj.milestones.length; i++) {
            if (phaseObj.milestones[i] && phaseObj.milestones[i].id === milestoneId) {
              phaseObj.milestones[i].completed = completed;
              milestoneFound = true;
              break;
            }
          }
        }
        if (milestoneFound) break;
      }
    }

    if (!milestoneFound) {
      console.log('PUT /api/roadmaps/[id]/progress - Milestone not found');
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    // Update the roadmap in the database
    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: {
        phases: updatedPhases
      }
    });

    console.log('PUT /api/roadmaps/[id]/progress - Roadmap updated successfully:', JSON.stringify(updatedRoadmap, null, 2));
    
    // Calculate new progress
    let totalMilestones = 0;
    let completedMilestones = 0;
    
    if (Array.isArray(updatedRoadmap.phases)) {
      let phasesArray = updatedRoadmap.phases;
      if (typeof updatedRoadmap.phases === 'string') {
        try {
          phasesArray = JSON.parse(updatedRoadmap.phases);
        } catch (e) {
          phasesArray = [];
        }
      }
      
      phasesArray.forEach(phase => {
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
    
    return NextResponse.json({ 
      message: 'Progress updated successfully',
      progress: progress,
      milestones: {
        completed: completedMilestones,
        total: totalMilestones
      }
    });
  } catch (error) {
    console.error('PUT /api/roadmaps/[id]/progress - Failed to update progress:', error);
    return NextResponse.json({ error: 'Failed to update progress', details: (error as Error).message }, { status: 500 });
  }
}