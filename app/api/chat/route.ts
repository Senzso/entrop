import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    console.log('API route called');
    const { messages } = await req.json()
    console.log('Received messages:', messages);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

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
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'An error occurred', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

