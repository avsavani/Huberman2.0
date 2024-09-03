import { OpenAIStream } from "@/utils";
import { supabaseAdmin } from "@/utils";

export const runtime = "edge"

export async function POST(req:Request) {
    try {

        const {query, answer, feedback} = (await req.json()) as {
            query: string;
            answer: string;
            feedback: true | false;
        };
        try {
            const {error: insertError} = await supabaseAdmin.from('feedback').insert([
                {query: query, answer: answer, feedback: feedback}
            ]);

            if (insertError) {
                console.error('Error inserting feedback database:', insertError);
                return new Response("Error inserting in database", {status: 500});
            }
            return new Response("Success inserting in database", {status: 200});
        } catch (error) {
            console.error("Error in GET /api/answer:", error);
            return new Response("Error in", {status: 500});
        }
    }
    catch (error) {
        console.error("Error in GET /api/answer:", error);
        return new Response("Error in", {status: 500});
    }
}
