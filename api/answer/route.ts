import { NextRequest, NextResponse } from 'next/server';
import { OpenAIModel } from "@/types";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { searchChapters } from '@/services/apiService';
import { formatChapter } from "@/utils";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Bad Request: Query is required." }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }

    const results = await searchChapters(query);

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "No results found" }, { status: 404 });
    }

    const prompt = `QUERY:"${query}" \n\n Use the following passages to provide an answer to the query: ${results.map(formatChapter).join('\n\n')}`;

    const openai = new OpenAI({ apiKey: modelKey.api_key });

    const response = await openai.chat.completions.create({
      model: OpenAIModel.GPT_4_Turbo,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that accurately answers queries using Dr. Andrew Huberman's podcast Huberman Lab. Use the text provided to form your answer. Be accurate, helpful, concise, and clear."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.0,
      stream: true
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in POST /api/answer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}