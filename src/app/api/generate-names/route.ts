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

    // Try the primary model, then the fallback. Overload/rate-limit errors are retried once per model.
    const models = [
      process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash',
    ];
    const retryable = (status: number) => status === 429 || status >= 500;

    let lastStatus = 500;
    let lastMessage = 'An error occurred with the Google API.';

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        try {
          const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(20000),
          });
          const result = await geminiResponse.json();

          if (geminiResponse.ok) {
            return NextResponse.json(result);
          }

          console.error(`Google API Error (${model}, attempt ${attempt + 1}):`, result);
          lastStatus = geminiResponse.status;
          lastMessage = result.error?.message || lastMessage;
          if (!retryable(geminiResponse.status)) break; // e.g. retired model: go straight to the next one
        } catch (err) {
          console.error(`Request to ${model} failed (attempt ${attempt + 1}):`, err);
          lastStatus = 504;
          lastMessage = 'The Google API did not respond in time.';
        }
      }
    }

    return NextResponse.json({ error: lastMessage }, { status: lastStatus });
  } catch (e: unknown) {
    console.error('Error in /api/generate-names:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}