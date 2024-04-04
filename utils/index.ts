import { OpenAIModel } from "@/types";
import { createClient } from "@supabase/supabase-js";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const OpenAIStream = async (prompt: string, apiKey: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    method: "POST",
    body: JSON.stringify({
      model: OpenAIModel.GPT_4_Turbo,
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
      max_tokens: 1000,
      temperature: 0.0,
      stream: true
    })
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
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