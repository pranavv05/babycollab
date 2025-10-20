import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

// Only initialize if API key is present
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('GEMINI_API_KEY is not set. Roadmap generation will not work.');
}

// Define the desired structured output format for the AI roadmap
const jsonSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "A unique identifier for the roadmap, e.g., 'ai-roadmap-123'." },
    title: { type: "string", description: "The main title of the generated roadmap." },
    description: { type: "string", description: "A brief, engaging description of what the roadmap covers." },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number", description: "A unique numeric ID for the phase, e.g., 1, 2, 3." },
          title: { type: "string", description: "The title of this phase, e.g., 'Phase 1: Foundational Core'." },
          description: { type: "string", description: "A short description of the phase's objectives." },
          milestones: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number", description: "A unique numeric ID for the milestone, e.g., 101, 102." },
                title: { type: "string", description: "The specific goal for this milestone, e.g., 'Master JavaScript Fundamentals'." },
                description: { type: "string", description: "A brief explanation of what this milestone entails." },
                skills: { 
                  type: "array", 
                  items: { type: "string" }, 
                  description: "A list of specific skills to be learned or practiced." 
                },
                resources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "The title of the resource, e.g., 'MDN JavaScript Guide'." },
                      url: { type: "string", description: "A direct URL to the resource." },
                      type: { 
                        type: "string", 
                        enum: ["Documentation", "Course", "Tutorial", "Video", "Book", "Article", "Practice"],
                        description: "The type of learning resource." 
                      }
                    },
                    required: ["title", "url", "type"]
                  }
                }
              },
              required: ["id", "title", "description", "skills", "resources"]
            }
          }
        },
        required: ["id", "title", "description", "milestones"]
      }
    }
  },
  required: ["id", "title", "description", "phases"]
};

export async function POST(req: NextRequest) {
  // Check if API key is set
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'GEMINI_API_KEY is not configured. Please check environment variables.' 
    }, { status: 500 });
  }

  // Check if ai client is initialized
  if (!ai) {
    return NextResponse.json({ 
      error: 'AI client is not initialized. Please check GEMINI_API_KEY configuration.' 
    }, { status: 500 });
  }

  try {
    const { roadmapTitle } = await req.json();

    if (!roadmapTitle) {
      return NextResponse.json({ error: 'Roadmap title is required.' }, { status: 400 });
    }

    // Prompt the Gemini Model to generate the roadmap
    const modelResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use a fast and capable model
      contents: [
        { text: `Generate a detailed, personalized career roadmap for a user who wants to learn "${roadmapTitle}". The user is an intermediate, part-time learner with a 6-month timeline, focusing on hands-on projects. Create a roadmap with 3 distinct phases. Each phase should have 3-4 specific, actionable milestones. For each milestone, suggest 2-3 high-quality learning resources with direct URLs and resource types. Output the analysis strictly in the requested JSON schema with actual URLs for resources.` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      }
    });

    // Parse and return the JSON response from the model
    // Try to access the text property directly
    let responseText: string;
    if ('text' in modelResponse) {
      responseText = modelResponse.text as string;
    } else {
      // If text property doesn't exist, try to stringify the whole response
      responseText = JSON.stringify(modelResponse);
    }

    // Validate that we have valid JSON
    let roadmapData: any;
    try {
      roadmapData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', responseText);
      throw new Error('AI response is not valid JSON');
    }

    // Additional validation to ensure we have the expected structure
    if (!roadmapData || !roadmapData.phases || !Array.isArray(roadmapData.phases)) {
      throw new Error('AI response does not match expected roadmap structure');
    }

    return NextResponse.json(roadmapData);

  } catch (error: any) {
    console.error('AI Roadmap Generation Error:', error);
    
    // Provide more specific error messages
    if (error.message && error.message.includes('API_KEY')) {
      return NextResponse.json({ 
        error: 'Invalid or missing GEMINI_API_KEY. Please check your environment variables.' 
      }, { status: 500 });
    }
    
    if (error.message && error.message.includes('401')) {
      return NextResponse.json({ 
        error: 'Unauthorized access to Gemini API. Please check your GEMINI_API_KEY.' 
      }, { status: 500 });
    }
    
    if (error.message && error.message.includes('404')) {
      return NextResponse.json({ 
        error: 'Gemini model not found. Please check the model name in the API route.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: `Failed to generate AI roadmap: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}