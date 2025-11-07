/*
*file-summary*
PATH: src/app/api/chat/route.ts
PURPOSE: Handle chat POST requests and return a Gemini-backed reply (via Genkit) to the client.
SUMMARY: Parses incoming messages, transforms them to the model’s expected structure, validates environment configuration, calls the Genkit flow, and returns structured JSON. Includes detailed timing and logging for observability. Keeps runtime Node.js-only to ensure compatibility with Google AI SDKs and allows future extension for streaming responses.
IMPORTS:
  - Next.js: NextRequest, NextResponse
  - Genkit flow: menuFlow (configured externally)
  - Local types: ChatMessage
  - Side-effect Genkit setup import to ensure plugin/config load
EXPORTS:
  - runtime ('nodejs')
  - POST (route handler)
*/

/* --sectionComment
SECTION: RUNTIME
SUMMARY: Force Node.js runtime to avoid Edge crypto/env limitations with Genkit/Google AI.
*/
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import type { ChatMessage } from '@/lib/chat-storage';
import { menuFlow } from '@/ai/genkit';
import '@/ai/genkit'; // side-effect import ensures Genkit config runs exactly once

/* --sectionComment
SECTION: ENVIRONMENT CHECK
SUMMARY: Verify that the Gemini API key is present and warn if missing.
*/
const GEMINI_KEY = process.env.GOOGLE_GENAI_API_KEY;
if (!GEMINI_KEY) {
  console.error('[api/chat] ⚠ Missing GOOGLE_GENAI_API_KEY in environment');
}

/* --sectionComment
SECTION: HELPERS
SUMMARY: Map UI messages into Genkit-compatible history (role/content pairs).
*/
function toFlowHistory(messages: ChatMessage[]) {
  return messages.map((m) => ({
    role: m.variant === 'outgoing' ? 'user' : 'model',
    content: [{ text: m.text }],
  }));
}

/* --sectionComment
SECTION: ROUTE HANDLER (POST)
SUMMARY: Validate request, call Genkit, and return AI response with full structured logging.
*/
export async function POST(req: NextRequest) {
  const LOG_SCOPE = '[api/chat]';
  console.group(`${LOG_SCOPE} POST`);
  console.time(`${LOG_SCOPE} total`);

  try {
    // --- Environment Validation ---
    if (!GEMINI_KEY) {
      console.error(`${LOG_SCOPE} ❌ Missing GOOGLE_GENAI_API_KEY`);
      return NextResponse.json(
        { error: 'Missing Gemini API key. Please configure GOOGLE_GENAI_API_KEY.' },
        { status: 500 }
      );
    }

    // --- Parse Request ---
    const body = await req.json().catch(() => ({}));
    const msgs = Array.isArray(body?.messages) ? body.messages : [];
    console.log(`${LOG_SCOPE} received`, msgs.length, 'message(s)');
    if (msgs.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // --- Build Flow Input ---
    const history = toFlowHistory(msgs);
    const last = history.pop();
    if (!last) {
      return NextResponse.json({ error: 'No last message found' }, { status: 400 });
    }

    console.log(`${LOG_SCOPE} prepared history size:`, history.length);
    console.time(`${LOG_SCOPE} model latency`);

    // --- Call Genkit Flow ---
    const result = await menuFlow(last, history);
    console.timeEnd(`${LOG_SCOPE} model latency`);

    // --- Normalize Model Output ---
    const text =
      typeof result === 'string'
        ? result
        : (result as any)?.text ?? (result as any)?.response ?? '';
    console.log(`${LOG_SCOPE} model response length:`, text?.length ?? 0);

    if (!text) {
      console.warn(`${LOG_SCOPE} empty model output`);
      return NextResponse.json({ error: 'Empty response from model' }, { status: 502 });
    }

    // --- Return Response ---
    console.log(`${LOG_SCOPE} ✅ success`);
    console.timeEnd(`${LOG_SCOPE} total`);
    console.groupEnd();
    return NextResponse.json({ text }, { status: 200 });
  } catch (err: any) {
    console.error(`${LOG_SCOPE} ❌ POST error:`, err?.message || err);
    console.timeEnd(`${LOG_SCOPE} total`);
    console.groupEnd();
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* --sectionComment
SECTION: NOTES / FUTURE
SUMMARY: For streaming support, have menuFlow return a ReadableStream and set the response
Content-Type to 'text/event-stream'. The logging structure is already compatible with stream updates.
*/

