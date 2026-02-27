import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// This line is CRITICAL for Next.js 15 builds to pass
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Safety check for the build process
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('API Key missing', { status: 500 });
    }

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages, // Simplified for better compatibility
      system: `You are Jyoti AI, the concierge for 9to5 Workspace. 
      Address: 17/109, Vikram Vihar, Lajpat Nagar 4, New Delhi. 
      Contact: Ms. Jyoti (+91-8800337608).`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
