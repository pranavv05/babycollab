import type { NextApiRequest, NextApiResponse } from 'next';

// Type for expected Gemini API response
type GeminiResponse = {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
  error?: {
    message: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Validate HTTP method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Verify API key exists
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    console.error('Missing GEMINI_API_KEY in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // 3. Validate request body
  if (!req.body.prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

  try {
    // 4. Call Gemini API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: req.body.prompt }]
        }]
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    // 5. Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        response: errorText
      });
      throw new Error(`API request failed with status ${response.status}`);
    }

    // 6. Safely parse response
    const responseData: GeminiResponse = await response.json();

    // 7. Validate response structure
    if (!responseData.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Invalid Gemini response structure:', responseData);
      throw new Error('Invalid response format from Gemini API');
    }

    // 8. Return clean response
    return res.status(200).json({
      text: responseData.candidates[0].content.parts[0].text
    });

  } catch (error) {
    // 9. Handle all error cases
    console.error('Error in Gemini API route:', error);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return res.status(504).json({ error: 'Request timeout' });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Unknown error occurred' });
  }
}