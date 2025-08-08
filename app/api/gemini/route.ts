import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
  }

  const body = await req.json();
  if (!body.prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: body.prompt }] }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return NextResponse.json({ text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}