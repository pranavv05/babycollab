import { getGroq } from '@/lib/groq';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Groq

export async function POST(req: NextRequest) {
  try {
    const { userProfile } = await req.json();

    if (!userProfile) {
      return NextResponse.json({ 
        error: 'User profile is required.',
        userMessage: 'Please provide your profile information to generate suggestions.'
      }, { status: 400 });
    }

    const prompt = `
      Based on the following user profile, generate a list of 3 diverse and relevant career roadmap suggestions. 
      
      User Profile:
      - Field of Interest: ${userProfile.interest}
      - Current Experience: ${userProfile.experience}
      - Weekly Time Commitment: ${userProfile.time}
      - Preferred Learning Style: ${userProfile.style}
      - Ultimate Goal: ${userProfile.goal}

      Output strictly valid JSON with this schema:
      [
        {
          "id": "unique-id-slug",
          "title": "Roadmap Title",
          "description": "Engaging description",
          "difficulty": "Beginner/Intermediate/Advanced",
          "timeline": "e.g. 6 months",
          "milestones": 12,
          "skills": ["Skill 1", "Skill 2"],
          "followers": 1200,
          "popular": true
        }
      ]
    `;

    const completion = await getGroq().chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful career advisor API.' },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    
    let suggestions = [];
    if (content) {
        try {
             suggestions = JSON.parse(content);
             // Handle case where AI wraps array in object key like "suggestions": [...]
             if (!Array.isArray(suggestions)) {
                 if (suggestions.suggestions) suggestions = suggestions.suggestions;
                 else if (suggestions.roadmaps) suggestions = suggestions.roadmaps;
                 else if (suggestions.items) suggestions = suggestions.items;
             }
        } catch (e) {
            console.error("JSON Parse Error", e);
             return NextResponse.json({ 
                error: 'Failed to parse AI suggestions.',
                userMessage: 'The AI service returned an invalid response. Please try again.'
            }, { status: 500 });
        }
    }

    if (!Array.isArray(suggestions) || suggestions.length === 0) {
       return NextResponse.json({ 
          error: 'No roadmap suggestions generated',
          userMessage: 'The AI couldn\'t generate suggestions. Please try again.'
        }, { status: 500 });
    }

    return NextResponse.json(suggestions);

  } catch (error: any) {
    console.error('Groq Suggestion Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate suggestions.',
      userMessage: 'Service temporarily unavailable. Please try again.'
    }, { status: 500 });
  }
}