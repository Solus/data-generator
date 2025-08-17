import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { numNames } = await request.json();

    if (!numNames || typeof numNames !== 'number' || numNames < 1 || numNames > 50) {
      return NextResponse.json({ error: 'Invalid number of names requested.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return NextResponse.json({ error: 'API key not configured on the server.' }, { status: 500 });
    }

    const prompt = `Generate a list of ${numNames} unique Croatian first and last names. Format each name as "Firstname,Lastname" on a new line, with no introductory or concluding text.`;
    const chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('Google API Error:', result);
      const errorMessage = result.error?.message || 'An error occurred with the Google API.';
      return NextResponse.json({ error: errorMessage }, { status: geminiResponse.status });
    }

    return NextResponse.json(result);
  } catch (e: unknown) {
    console.error('Error in /api/generate-names:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}