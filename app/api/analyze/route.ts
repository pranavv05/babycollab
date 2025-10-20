import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

// Only initialize if API key is present
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('GEMINI_API_KEY is not set. Resume analysis will not work.');
}

// The structure for the AI's response (must match the frontend)
interface SuggestionItem {
  original: string;
  improved: string;
  reason: string;
}

interface SuggestionCategory {
  category: string;
  severity: 'high' | 'medium' | 'low';
  items: SuggestionItem[];
}

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
    // 1. Get the file data (multipart form data)
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded.' }, { status: 400 });
    }

    // 2. Convert File to base64 for Gemini API
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');
    const mimeType = file.type;

    // 3. Define the desired structured output format for the AI
    const jsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string", description: "e.g., 'Impact and Metrics', 'ATS Keywords', 'Clarity and Formatting'" },
          severity: { type: "string", enum: ["high", "medium", "low"], description: "Priority of the suggestion." },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                original: { type: "string", description: "The original problematic text chunk from the resume." },
                improved: { type: "string", description: "The AI-suggested improvement for the text." },
                reason: { type: "string", description: "A brief, actionable reason for the suggestion." },
              },
              required: ["original", "improved", "reason"]
            }
          }
        },
        required: ["category", "severity", "items"]
      }
    };


    // 4. Prompt the Gemini Model
    const modelResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use a fast model
      contents: [
        // File part (the resume)
        { inlineData: { data: fileBase64, mimeType } },
        // Text part (the instructions)
        { text: `Analyze the provided resume file for common errors related to action verbs, quantifiable metrics, and ATS optimization. Provide at least 5 distinct suggestions. Output the analysis strictly in the requested JSON schema.` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      }
    });

    // 5. Parse and return the JSON response from the model
    // Log the response structure for debugging
    console.log('Model response structure:', Object.keys(modelResponse));
    
    // Try to access the text property directly
    let responseText: string;
    if ('text' in modelResponse) {
      responseText = modelResponse.text as string;
    } else {
      // If text property doesn't exist, try to stringify the whole response
      responseText = JSON.stringify(modelResponse);
    }

    // Validate that we have valid JSON
    let analysisData: SuggestionCategory[];
    try {
      analysisData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', responseText);
      throw new Error('AI response is not valid JSON');
    }

    return NextResponse.json({ success: true, analysis: analysisData });

  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    
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
      error: `Failed to process resume analysis: ${error.message || 'Unknown error'}` 
    }, { status: 500 });
  }
}