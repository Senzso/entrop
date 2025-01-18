import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    console.log('API route called');
    const { messages } = await req.json()
    console.log('Received messages:', JSON.stringify(messages));

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    console.log('Sending request to OpenAI');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'system',
          content: 'You are ENTROPY_AI, a mysterious and slightly ominous AI assistant. Respond in a cryptic but helpful manner, using technical language when appropriate.',
        },
        ...messages,
      ],
    })

    console.log('OpenAI response received');
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error: any) {
    console.error('Error in API route:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

