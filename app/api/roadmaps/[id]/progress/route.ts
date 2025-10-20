import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { use } from 'react';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params object to properly access its properties
    const unwrappedParams = await params;
    const roadmapId = unwrappedParams.id;
    
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { milestoneId, completed } = await req.json();
    
    // Find the roadmap to ensure it belongs to the user
    const roadmap = await prisma.roadmap.findUnique({
      where: { 
        id: roadmapId,
        userId: userId 
      }
    });

    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found or not accessible' }, { status: 404 });
    }

    // Update the milestone progress in the roadmap's phases data
    // Since the phases are stored as JSON, we need to update the specific milestone
    const updatedPhases = Array.isArray(roadmap.phases) ? roadmap.phases.map((phase: any) => {
      if (phase && typeof phase === 'object' && Array.isArray(phase.milestones)) {
        const updatedMilestones = phase.milestones.map((milestone: any) => {
          if (milestone && typeof milestone === 'object' && milestone.id === milestoneId) {
            return { ...milestone, completed };
          }
          return milestone;
        });
        return { ...phase, milestones: updatedMilestones };
      }
      return phase;
    }) : [];

    // Update the roadmap with the modified phases
    const updatedRoadmap = await prisma.roadmap.update({
      where: { id: roadmapId },
      data: { phases: updatedPhases }
    });

    return NextResponse.json({ message: 'Progress updated successfully', roadmap: updatedRoadmap });
  } catch (error) {
    console.error('Failed to update roadmap progress:', error);
    return NextResponse.json({ error: 'Failed to update progress', details: (error as Error).message }, { status: 500 });
  }
}