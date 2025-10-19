import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini with the server-side environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    const analysisData: SuggestionCategory[] = JSON.parse(modelResponse.text);

    return NextResponse.json({ success: true, analysis: analysisData });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: 'Failed to process resume analysis.' }, { status: 500 });
  }
}