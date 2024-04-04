'use server';

import { supabaseAdmin } from "@/utils";

export const sendFeedback =  async (feedback: boolean, query:string ,answer:string ) => {
try{
        await supabaseAdmin.from('feedback').insert([
        { query: query, answer: answer, feedback: feedback }
    ]);
    }
    catch (err) {
        return { error: "Error inserting feedback into database" }
    }
    return { success: "Feedback sent successfully" }
}

