import { getGroq } from '@/lib/groq';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const { messages, currentProfile } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Get the most recent user message and history context
    const lastUserMessage = messages[messages.length - 1].content;
    
    // Construct the prompt
    // We pass the current profile state so the AI knows what's missing
    const prompt = `
      You are a friendly and encouraging AI Career Coach. Your goal is to gather specific information from the user to build a personalized learning roadmap.
      
      REQUIRED INFORMATION:
      1. Interest: The specific field or technology they want to learn (e.g., "React", "Data Science", "Marketing").
      2. Experience: Their current skill level (Beginner, Intermediate, Advanced).
      3. Time: How much time they can commit weekly (e.g., "5 hours", "Full time").
      4. Style: preferred learning style (Videos, Reading, Projects).
      5. Goal: Their end goal (Job, Freelancing, Hobby).

      CURRENT KNOWN PROFILE:
      ${JSON.stringify(currentProfile || {}, null, 2)}

      USER'S LATEST MESSAGE:
      "${lastUserMessage}"

      INSTRUCTIONS:
      1. Analyze the user's latest message. extract any new values for the required information fields.
      2. If the user asks a question, answer it briefly and helpfuly, then steer back to gathering info.
      3. If the user provided info, update the profile values.
      4. If information is still missing, choose ONE missing field and ask a natural, conversational question to get it. Do NOT ask for everything at once.
      5. If ALL information is gathered (all 5 fields have values), set "isReady" to true and give a brief encouraging closing statement (e.g., "Great! I have everything I need.").

      OUTPUT FORMAT:
      Return strictly valid JSON with this structure:
      {
        "message": "Your response to the user",
        "updatedProfile": { "interest": "...", "experience": "...", "time": "...", "style": "...", "goal": "..." },
        "isReady": boolean
      }
    `;

    const completion = await getGroq().chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful AI Career Coach that outputs strict JSON.' },
        // We can optionally pass fewer history messages to save tokens if needed, 
        // but for now, we rely on the summary prompt above + the logic.
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
       throw new Error('No content received from AI');
    }

    let responseData;
    try {
        responseData = JSON.parse(content);
        // Correct potential nesting from AI
        if (responseData.response) responseData = responseData.response;
    } catch (e) {
        console.error("Failed to parse chat assessment JSON", e);
        // Fallback response
        return NextResponse.json({
            message: "I didn't quite catch that. Could you clarify your field of interest?",
            updatedProfile: currentProfile,
            isReady: false
        });
    }

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error('Chat Assessment Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process chat.',
      // Fallback for the UI to show something
      message: "I'm having a brief connection issue. Could you say that again?",
      updatedProfile: {},
      isReady: false
    }, { status: 500 });
  }
}
