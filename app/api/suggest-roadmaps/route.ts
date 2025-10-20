import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

// Only initialize if API key is present
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('GEMINI_API_KEY is not set. Roadmap suggestions will not work.');
}

// Define the desired structured output format for the AI
const jsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string", description: "A unique slug-like ID, e.g., 'ai-engineer-pro'." },
      title: { type: "string", description: "The title of the career roadmap." },
      description: { type: "string", description: "A brief, engaging description of the roadmap." },
      difficulty: { type: "string", enum: ["Beginner", "Intermediate", "Advanced"], description: "The skill level required." },
      timeline: { type: "string", description: "An estimated time to complete, e.g., '6-8 months'." },
      milestones: { type: "number", description: "The total number of milestones in the roadmap." },
      skills: { type: "array", items: { type: "string" }, description: "A list of 3-5 key skills covered." },
      followers: { type: "number", description: "A fictional but realistic number of followers, e.g., between 500 and 3000." },
      popular: { type: "boolean", description: "Set to true if it's a very common or trending path." }
    },
    required: ["id", "title", "description", "difficulty", "timeline", "milestones", "skills", "followers", "popular"]
  }
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
    const { userProfile } = await req.json();

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile is required.' }, { status: 400 });
    }

    // Create a more detailed prompt using the user's answers
    const prompt = `
      Based on the following user profile, generate a list of 3 diverse and relevant career roadmap suggestions. The suggestions should be actionable and highly tailored to the user's preferences.

      User Profile:
      - Field of Interest: ${userProfile.interest}
      - Current Experience: ${userProfile.experience}
      - Weekly Time Commitment: ${userProfile.time}
      - Preferred Learning Style: ${userProfile.style}
      - Ultimate Goal: ${userProfile.goal}

      Output the list strictly in the requested JSON schema.
    `;

    // Prompt the Gemini Model to generate roadmap suggestions
    const modelResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
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
    let suggestions: any;
    try {
      suggestions = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', responseText);
      throw new Error('AI response is not valid JSON');
    }

    // Additional validation to ensure we have the expected structure
    if (!Array.isArray(suggestions)) {
      throw new Error('AI response does not match expected suggestions structure');
    }

    return NextResponse.json(suggestions);

  } catch (error: any) {
    console.error('AI Suggestion Generation Error:', error);
    
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
      error: `Failed to generate AI suggestions: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}