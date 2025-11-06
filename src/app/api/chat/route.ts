
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // For this POC, we'll just send a static response.
  return NextResponse.json({
    reply: {
      role: 'assistant',
      content: 'This is a static response from the mock API.',
    },
  });
}
