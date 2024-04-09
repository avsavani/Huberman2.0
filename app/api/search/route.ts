import { NextRequest } from 'next/server';
import { supabaseAdmin } from "@/utils";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { query, userKey, matches } = await req.json() as { query: string, userKey: string, matches: number };

    if (!query || !matches) {
      console.error("Missing required parameters: query or matches");
      return new Response('Missing required parameters', { status: 400 });
    }

    const sanitizedQuery = query.replace(/\n/g, " ");
    const apiKey = userKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      console.error("API key is not defined in environment variables.");
      return new Response("API key is missing", { status: 500 });
    }

    let embedding;
    try {
      const openAIResponse = await fetch("https://api.openai.com/v1/embeddings", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        method: "POST",
        body: JSON.stringify({
          model: "text-embedding-ada-002",
          input: sanitizedQuery
        })
      });

      if (!openAIResponse.ok) {
        throw new Error(`OpenAI API request failed with status ${openAIResponse.status}`);
      }

      const jsonResponse = await openAIResponse.json();
      embedding = jsonResponse.data[0].embedding;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return new Response("Error calling OpenAI API", { status: 500 });
    }

    try {
      const { data: chunks, error } = await supabaseAdmin.rpc("chapter_search", {
        query_embedding: embedding,
        similarity_threshold: 0.01,
        match_count: matches
      });
      if (error) {
        console.error("Supabase error:", error);
      }
      return new Response(JSON.stringify(chunks), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error("Error calling Supabase vector-search:", error);
      return new Response("Error calling Supabase vector-search", { status: 500 });
    }
  } catch (error) {
    console.error("Unhandled error in /api/search:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
