import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
                resources: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "The title of the resource, e.g., 'MDN JavaScript Guide'." },
                      url: { type: "string", description: "The direct URL to the resource, e.g., 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide'." },
                      type: { type: "string", description: "The type of resource, e.g., 'Documentation', 'Course', 'Project', 'Video'." }
                    },
                    required: ["title", "url", "type"]
                  },
                  description: "A list of 2-3 suggested learning resources with titles, direct URLs, and types."
                },
                completed: { type: "boolean", description: "The initial completion status, which should always be false." }
              },
              required: ["id", "title", "resources", "completed"]
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
    const responseText = modelResponse.text;
    if (!responseText) {
      throw new Error('No response text from AI model');
    }
    
    const roadmapData = JSON.parse(responseText);

    return NextResponse.json(roadmapData);

  } catch (error) {
    console.error('AI Roadmap Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI roadmap.' }, { status: 500 });
  }
}