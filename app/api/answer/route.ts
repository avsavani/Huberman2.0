import { NextApiRequest } from "next";
import { OpenAIModel } from "@/types";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai'; // Assuming these are exported by the 'ai' package

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(req: NextApiRequest) {
  try {
    const { prompt, userKey } = req.body as { prompt: string, userKey: string };

    // Validate prompt
    if (!prompt) {
      console.error("Prompt is null or empty.");
      return new Response("Bad Request: Prompt is required and must be a non-empty string.", { status: 400 });
    }

    if (!userKey) {
      console.log("User key is not given, using environment variables.");
    }
    const apiKey = userKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY!;

    const response = await openai.chat.completions.create({
      model: OpenAIModel.GPT_4_Turbo,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that accurately answers queries using Dr. Andrew Huberman's podcast huberman Lab. Use the text provided to form your answer. Be accurate, helpful, concise, and clear."
        },
        {
          role: "user",
          content: prompt // This is where the validation is important
        }
      ],
      max_tokens: 1000,
      temperature: 0.0,
      stream: true
    });

    // Assuming OpenAIStream from the 'ai' package now directly handles the creation of the stream
    // and the 'ai' package is configured to use your API key and other necessary settings.
    const stream = await OpenAIStream(response);
    
    // Assuming StreamingTextResponse is a utility from the 'ai' package that correctly handles
    // streaming responses in the format expected by Next.js or the web standards.
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in POST /api/answer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}