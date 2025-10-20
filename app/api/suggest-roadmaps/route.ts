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

// Function to generate content with retry logic
async function generateContentWithRetry(model: any, prompt: string, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt} to generate content`);
      
      // Generate content with an increased timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout (increased further)
      
      const result = await Promise.race([
        model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        }),
        new Promise((_, reject) => 
          controller.signal.addEventListener('abort', () => reject(new Error('Request timeout')))
        )
      ]);
      
      clearTimeout(timeoutId);
      return result;
    } catch (error: any) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      // If it's the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt)); // Further increased wait time
    }
  }
  
  throw new Error('Max retries exceeded');
}

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
    // Use models that are known to work with generateContent
    const modelNames = [
      'models/gemini-1.5-flash-latest',
      'models/gemini-1.5-pro-latest',
      'models/gemini-pro',
      'models/gemini-1.5-flash',
      'models/gemini-1.5-pro'
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
    // Changed to generate only 1 roadmap instead of 3
    const prompt = `
      Based on the following user profile, generate a SINGLE comprehensive and highly detailed career roadmap suggestion. The suggestion should be actionable and highly tailored to the user's preferences.

      User Profile:
      - Field of Interest: ${userProfile.interest}
      - Current Experience: ${userProfile.experience}
      - Weekly Time Commitment: ${userProfile.time}
      - Preferred Learning Style: ${userProfile.style}
      - Ultimate Goal: ${userProfile.goal}

      IMPORTANT: Generate ONLY ONE roadmap suggestion, not multiple. Focus on creating one highly detailed and personalized roadmap rather than multiple generic ones.

      Output a SINGLE roadmap suggestion strictly in JSON format with the following structure:
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
    `;

    console.log(`Sending prompt to Gemini API using model: ${modelName}`);

    // Generate content with retry logic
    const result = await generateContentWithRetry(model, prompt);

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
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          // If it's a single object, wrap it in an array
          const parsed = JSON.parse(jsonMatch[0]);
          suggestions = Array.isArray(parsed) ? parsed : [parsed];
        } catch (secondParseError) {
          throw new Error('AI response is not valid JSON');
        }
      } else {
        throw new Error('AI response is not valid JSON');
      }
    }
    
    // Ensure we always return an array, even if it's just one item
    const resultArray = Array.isArray(suggestions) ? suggestions : [suggestions];
    
    // Limit to just 1 roadmap as requested
    const limitedResult = resultArray.slice(0, 1);

    return NextResponse.json(limitedResult);

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
    
    if (error.message && (error.message.includes('504') || error.message.includes('timeout') || error.message.includes('deadline'))) {
      return NextResponse.json({ 
        error: 'Gateway timeout. The AI service is taking too long to respond. Please try again later.' 
      }, { status: 504 });
    }
    
    return NextResponse.json({ 
      error: `Failed to generate AI roadmap suggestions: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}