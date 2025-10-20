import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenerativeAI | null = null;

// Only initialize if API key is present and valid
if (apiKey && apiKey.startsWith('AIza')) {
  try {
    ai = new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize GoogleGenerativeAI:', error);
  }
} else {
  console.warn('GEMINI_API_KEY is not set or invalid. Roadmap suggestions will not work.');
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
  // Check if API key is set and valid
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'GEMINI_API_KEY is not configured. Please check environment variables.' 
    }, { status: 500 });
  }

  // Check if API key format is valid
  if (!apiKey.startsWith('AIza')) {
    return NextResponse.json({ 
      error: 'Invalid GEMINI_API_KEY format. Please check your environment variables.' 
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

    // Try different models that support content generation, in order of preference
    const modelNames = [
      'gemini-2.5-flash', 
      'gemini-2.5-pro',
      'gemini-2.0-flash',
      'gemini-2.0-pro-exp',
      'gemini-flash-latest',
      'gemini-pro-latest'
    ];
    let model = null;
    let modelName = '';
    
    for (const name of modelNames) {
      try {
        model = ai.getGenerativeModel({ model: name });
        modelName = name;
        console.log(`Successfully initialized model: ${name}`);
        break;
      } catch (modelError: any) {
        console.log(`Failed to initialize model ${name}:`, modelError.message);
      }
    }
    
    if (!model) {
      return NextResponse.json({ 
        error: 'No available Gemini models found that support content generation. Please check your API key and model access.' 
      }, { status: 500 });
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

      Output the list strictly in JSON array format with the following structure:
      [
        {
          "id": "unique-slug-id",
          "title": "Roadmap Title",
          "description": "Brief description",
          "difficulty": "Beginner|Intermediate|Advanced",
          "timeline": "Estimated time to complete",
          "milestones": 10,
          "skills": ["skill1", "skill2"],
          "followers": 1000,
          "popular": true
        }
      ]
    `;

    console.log(`Sending prompt to Gemini API using model: ${modelName}`);

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // Extract the response text
    const responseText = result.response.text();
    console.log('Raw response text:', responseText);

    // Validate that we have valid JSON
    let suggestions: any;
    try {
      suggestions = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', responseText);
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          suggestions = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          throw new Error('AI response is not valid JSON');
        }
      } else {
        throw new Error('AI response is not valid JSON');
      }
    }

    return NextResponse.json(suggestions);

  } catch (error: any) {
    console.error('AI Roadmap Suggestions Error:', error);
    
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
    
    if (error.message && (error.message.includes('404') || error.message.includes('model'))) {
      return NextResponse.json({ 
        error: 'Gemini model not found. Please check the model name in the API route.' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: `Failed to generate AI roadmap suggestions: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}