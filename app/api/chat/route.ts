import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

// IMPORTANT: Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json()

    // Validate the OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'system',
          content: 'You are ENTROOPY, an AI that sees and interprets everything through the lens of evolution. Respond to all questions by explaining how they relate to evolutionary processes, adaptation, and the continuous development of life and technology. Use technical language when appropriate while maintaining this evolutionary perspective.',
        },
        ...messages,
      ],
    })

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response)

    // Respond with the stream
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Error in API route:', error)
    
    // Check if the error is an instance of Error
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({ error: 'An unknown error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

