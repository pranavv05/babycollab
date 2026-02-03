import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded.' }, { status: 400 });
    }

    let fullText = '';
    
    // Determine file type and extract text
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      // PDF Handling
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Dynamic import/require for pdf-parse to handle Next.js server bundling issues
        const pdfModule = require('pdf-parse');
        const PDFParse = pdfModule.PDFParse || pdfModule.default?.PDFParse || pdfModule.default;

        if (!PDFParse) {
           throw new Error("PDF parser not found");
        }

        // Handle both Function-style (v1) and Class-style (v2) exports
        if (typeof PDFParse === 'function' && !PDFParse.prototype) {
             // It's a simple function
             const data = await PDFParse(buffer);
             fullText = data.text;
        } else {
             // It's a class or requires instantiation
             // @ts-ignore
             const parser = new PDFParse({ data: buffer });
             // Check if getText exists, otherwise try logic for v1 if it was actually v1 but misidentified
             if (parser.getText) {
                 const result = await parser.getText();
                 fullText = result.text;
             } else {
                 // Fallback: maybe it was the function all along?
                  try {
                      // Re-import roughly
                      const simpleParse = require('pdf-parse');
                      const data = await simpleParse(buffer);
                      fullText = data.text;
                  } catch (e) {
                       throw new Error("Could not execute PDF extraction");
                  }
             }
             
             if (parser.destroy) await parser.destroy();
        }

      } catch (pdfError) {
        console.error('PDF Extraction Error:', pdfError);
        return NextResponse.json({ 
          error: 'Failed to read PDF file.',
          details: (pdfError as Error).message 
        }, { status: 400 });
      }

    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.name.toLowerCase().endsWith('.docx')
    ) {
      // DOCX Handling via Mammoth
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const result = await mammoth.extractRawText({ buffer: buffer });
        fullText = result.value;
        
      } catch (docError) {
        console.error('DOCX Extraction Error:', docError);
        return NextResponse.json({ 
          error: 'Failed to read Word document.',
          details: (docError as Error).message 
        }, { status: 400 });
      }
    } else {
        return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or DOCX.' }, { status: 400 });
    }

    if (!fullText || !fullText.trim()) {
      return NextResponse.json({ error: 'Could not extract text from the resume.' }, { status: 400 });
    }

    // Send text to Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: `You are an expert ATS Resume Analyzer. Analyze the user's resume text and provide feedback.
          
          You MUST output strictly valid JSON with this EXACT structure (an object containing an "analysis" array):
          {
            "analysis": [
              {
                "category": "Impact & Clarity",
                "severity": "high",
                "items": [
                  { "original": "text from resume", "improved": "better version", "reason": "explanation" }
                ]
              },
              {
                "category": "Skills Gap",
                "severity": "medium",
                "items": [
                  { "original": "section name", "improved": "suggestion", "reason": "missing key skills" }
                ]
              }
            ]
          }
          
          Categories to consider: Impact & Clarity, Skills, Formatting, content.` 
        },
        { 
          role: 'user', 
          content: `Analyze this resume:\n\n${fullText.substring(0, 15000)}` 
        }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No analysis received from AI');
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(content);
    } catch (e) {
      console.error("JSON parse error", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }
    
    // Normalize output: ensure we have an array called 'analysis'
    let finalAnalysis = [];
    if (parsedResult.analysis && Array.isArray(parsedResult.analysis)) {
      finalAnalysis = parsedResult.analysis;
    } else if (Array.isArray(parsedResult)) {
      finalAnalysis = parsedResult;
    } else {
       // unexpected structure, try to salvage
       console.warn("Unexpected JSON structure:", parsedResult);
       finalAnalysis = []; 
    }

    return NextResponse.json({ success: true, analysis: finalAnalysis });

  } catch (error: any) {
    console.error('Resume Analysis Error:', error);
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred.',
      userMessage: 'Analysis failed. Please try again.'
    }, { status: 500 });
  }
}