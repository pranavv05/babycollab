import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    const suggestions = JSON.parse(modelResponse.text);
    return NextResponse.json(suggestions);

  } catch (error) {
    console.error('AI Suggestion Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI suggestions.' }, { status: 500 });
  }
}