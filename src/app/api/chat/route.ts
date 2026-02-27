import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages: convertToCoreMessages(messages),
    system: `You are Jyoti AI, the concierge for 9to5 Workspace. 
    Location: 17/109, Vikram Vihar, Lajpat Nagar 4. 
    Helpful info: Near Moolchand Metro. Contact Ms. Jyoti: +91-8800337608.`,
  });

  return result.toDataStreamResponse();
}
