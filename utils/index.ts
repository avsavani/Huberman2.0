import OpenAI from 'openai';
import { OpenAIModel } from "@/types";


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// read the default model from the .env.local file
export const defaultModel = (process.env.DEFAULT_MODEL as OpenAIModel) || OpenAIModel.GPT_4o_Mini;

export const OpenAIStream = async (prompt: string, apiKey: string) => {
  const openai = new OpenAI({ apiKey });

  const stream = openai.beta.chat.completions.stream({
    model: defaultModel,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that accurately answers queries using Dr. Andrew Huberman's podcast huberman Lab. Use the text provided to form your answer. Be accurate, helpful, concise, and clear."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 4000,
    temperature: 0.0,
    stream: true,
  });

  return stream.toReadableStream();
};

import { HLChapter } from "@/types";

export const formatChapter = (chapter: HLChapter): string => {
  const segmentsText = chapter.conversation.map((segment, index) => {
    const speakerName = segment.speaker === "SPEAKER_01" ? chapter.video_title.split(':')[0] : "Dr. Huberman";
    return `${speakerName}: ${segment.segment}`;
  }).join('\n');
  
  return `Video Title: ${chapter.video_title}
          Chapter Title: ${chapter.chapter_title}
          Video Date: ${chapter.video_date}
          Conversation:
          ${segmentsText}`;
};