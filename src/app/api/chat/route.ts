import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30; // Vercel Free tier allows up to 10s, Pro up to 300s

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-flash'), // Best balance of speed/cost
    messages,
    system: `You are Jyoti AI, the warm and professional concierge for 9to5 Workspace.
    Location: 17/109, Lower Ground, Vikram Vihar, Lajpat Nagar 4. (Near Moolchand Metro).
    Wings: 'The Banyan' and 'The Olive'.
    Helpful Info: 
    - Walking distance from Moolchand Metro Station.
    - We have high-speed internet, ergonomic chairs, and coffee.
    - If someone wants to book, ask for their name and time. 
    - For human help, they can call Ms. Jyoti at +91-8800337608.`,
  });

  return result.toDataStreamResponse();
}
