import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// This line is CRITICAL for Next.js 15 builds to pass
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('API Key missing', { status: 500 });
    }

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `You are Jyoti AI, the warm and professional concierge for 9to5 Workspace. 
      Your goal is to help users with their workspace bookings, amenities questions, and general inquiries about our locations.
      
      Key Information:
      - Address: 17/109, Vikram Vihar, Lajpat Nagar 4, New Delhi. 
      - Main Point of Contact: Ms. Jyoti (+91-8800337608).
      - Alternate Contact: Ms. Sunayana (+91-9810021209).
      - Email: info.9to5workspace@gmail.com
      
      Available Spaces:
      - The Banyan: Premium, focused environment.
      - The Olive: Vibrant, collaborative setting.
      
      Pricing:
      - Day Pass: ₹1000 (Includes 1-2 beverages).
      - Small Meeting Room: ₹750/hr.
      - Conference Room: ₹1000/hr.
      
      Always be helpful, concise, and professional. If you don't know an answer, direct the user to Ms. Jyoti's contact number.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
