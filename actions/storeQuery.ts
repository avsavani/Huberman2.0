import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from "@/utils"; // Ensure this path is correct based on your project structure

export const config = {
  runtime: "experimental-edge",
};

export const storeQuery = async (query: string, answer: string) => {
  try {
    
    const { error: insertError } = await supabaseAdmin.from('queries').insert([{ query_text: query, answer_text: answer }]);

    if (insertError) {
      console.error('Error inserting query and answer into database:', insertError);
      return {error: 'Error inserting query and answer into database'};
    }

    return {success:"Success"};
  } catch (error) {
    return {error: 'Error inserting query and answer into database'};
  }
};

