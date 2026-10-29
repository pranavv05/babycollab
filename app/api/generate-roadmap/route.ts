import { getGroq } from '@/lib/groq';
import { NextRequest, NextResponse } from 'next/server';
import getPrismaClient from '@/lib/db';

// Initialize Groq

export const maxDuration = 60; 

export async function POST(req: NextRequest) {
  try {
    const { roadmapTitle } = await req.json();

    if (!roadmapTitle) {
      return NextResponse.json({ 
        error: 'Roadmap title is required.',
        userMessage: 'Please provide a roadmap title to generate.'
      }, { status: 400 });
    }

    // --- CACHING STRATEGY ---
    try {
      const prisma = await getPrismaClient();
      console.log(`Checking cache for roadmap: ${roadmapTitle}`);
      
      // Fix: 'phases' is a Json field, not a relation. Do not use 'include'.
      const existingRoadmap = await prisma.roadmap.findFirst({
        where: {
          title: {
            // Use contains/insensitive if possible, but exact match for now to be safe with all drivers
            equals: roadmapTitle,
          }
        }
      });

      if (existingRoadmap) {
        console.log(`Cache hit for: ${roadmapTitle}`);
        
        // Parse the JSON content
        const phases = existingRoadmap.phases as any[];
        
        const roadmapData = JSON.stringify({
          id: existingRoadmap.id,
          title: existingRoadmap.title,
          description: existingRoadmap.description,
          phases: phases
        });

        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(roadmapData));
            controller.close();
          }
        });

        return new NextResponse(stream, {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (dbError) {
      console.warn('Cache check failed, proceeding to generation:', dbError);
    }
    
    // --- GROQ GENERATION ---
    console.log(`Cache miss. Generating with Groq: ${roadmapTitle}`);

    const prompt = `Generate a detailed, personalized career roadmap for a user who wants to learn "${roadmapTitle}". The user is an intermediate learner with a 6-month timeline. Create a roadmap with 3 distinct phases. Each phase should have 3-4 specific milestones. For each milestone, suggest 2-3 learning resources (Documentation, Course, Project). 
    
    Output STRICTLY VALID JSON in this format:
    {
      "title": "${roadmapTitle}",
      "description": "Brief description...",
      "phases": [
        {
          "id": 1,
          "title": "Phase Title",
          "description": "Phase Description",
          "milestones": [
            {
              "id": 101,
              "title": "Milestone Title",
              "completed": false,
              "resources": [
                { "title": "Resource Name", "url": "https://example.com", "type": "Documentation" }
              ]
            }
          ]
        }
      ]
    }`;

    const completion = await getGroq().chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful career coach API that outputs strictly valid JSON.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      stream: true,
      response_format: { type: 'json_object' }
    });
    
    // transform Groq stream to web standard ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error: any) {
    console.error('Groq Generation Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate roadmap.',
      userMessage: 'Service temporarily unavailable. Please try again.'
    }, { status: 500 });
  }
}