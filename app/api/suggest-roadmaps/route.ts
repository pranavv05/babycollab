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
      return NextResponse.json({ 
        error: 'User profile is required.',
        userMessage: 'Please provide your profile information to generate suggestions.'
      }, { status: 400 });
    }

    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI service timeout - this usually happens when the AI service is busy. Please try again in a few minutes.')), 30000)
    );

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
    const modelResponsePromise = ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      }
    });

    // Race the AI call against the timeout
    const modelResponse = await Promise.race([modelResponsePromise, timeoutPromise]) as any;

    const suggestions = JSON.parse(modelResponse.text);
    return NextResponse.json(suggestions);

  } catch (error: any) {
    console.error('AI Suggestion Generation Error:', error);
    
    // Return a more user-friendly error message
    let userMessage = 'Sorry, we couldn\'t generate suggestions right now. Please try again in a few minutes.';
    
    // Customize error message based on error type
    if (error.message?.includes('timeout')) {
      userMessage = 'The AI service is taking longer than expected. Please try again in a few minutes.';
    } else if (error.message?.includes('API key')) {
      userMessage = 'There\'s an issue with our AI service configuration. Our team has been notified.';
    } else if (error.message?.includes('quota')) {
      userMessage = 'We\'ve reached our AI service limits. Please try again later or contact support.';
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to generate AI suggestions.',
      userMessage: userMessage
    }, { status: 500 });
  }
}