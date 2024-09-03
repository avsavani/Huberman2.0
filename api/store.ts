import { supabaseAdmin } from "@/utils";

export const config = {
  runtime: "edge"
};

// pages/api/store.ts
const handler = async (req: Request): Promise<Response> => {
    try {
      const { query, answer, apiKey } = (await req.json()) as {
        query: string;
        answer: string;
        apiKey: string;
      };
      console.log("query", query);
      console.log("answer", answer);
      const { error: insertError } = await supabaseAdmin.from('queries').insert([{ query_text: query, answer_text: answer }]);
  
      if (insertError) {
        console.error('Error inserting query and answer into database:', insertError);
        return new Response("Error", { status: 500 });
      }
  
      return new Response("Success", { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response("Error", { status: 500 });
    }
  };

export default handler;
