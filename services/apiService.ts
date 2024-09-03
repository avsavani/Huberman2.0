import { HLChapter } from "@/types";
import { createClient } from '@/utils/supabase/server';

const getAuthenticatedUser = async () => {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error('User not authenticated');
    }
    return user;
};

export async function searchChapters(query: string): Promise<HLChapter[]> {
    const supabase = createClient();
    
    try {
        const user = await getAuthenticatedUser();

        // Fetch user settings and model keys from the database
        const { data: userSettings, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .single();
        
        const { data: modelKeys, error: keysError } = await supabase
            .from('user_model_keys')
            .select('*');

        if (settingsError || keysError) {
            throw new Error("Failed to fetch user settings or model keys");
        }

        const openAIKey = modelKeys.find((key: { provider: string }) => key.provider === 'openai');
        if (!openAIKey) {
            throw new Error("OpenAI API key not found");
        }

        const apiKey = openAIKey.api_key;
        const { mode, match_count } = userSettings;

        // Get embedding from OpenAI
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
                    input: query
                })
            });

            if (!openAIResponse.ok) {
                throw new Error(`OpenAI API request failed with status ${openAIResponse.status}`);
            }

            const jsonResponse = await openAIResponse.json();
            embedding = jsonResponse.data[0].embedding;
        } catch (error) {
            console.error("Error calling OpenAI API:", error);
            throw error;
        }

        // Use the embedding to search chapters
        const { data: chapters, error: searchError } = await supabase.rpc("chapter_search", {
            query_embedding: embedding,
            similarity_threshold: 0.01,
            match_count: match_count || 10
        });

        if (searchError) {
            throw new Error("Error searching chapters");
        }

        return chapters as HLChapter[];
    } catch (error) {
        console.error("Error in searchChapters:", error);
        throw error;
    }
}

export async function fetchAnswer(prompt: string): Promise<ReadableStream | null> {
    const supabase = createClient();
    
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error('User not authenticated');
        }

        // Fetch user settings from the database
        const { data: userSettings, error: settingsError } = await supabase
            .from('user_settings')
            .select('api_key')
            .single();

        if (settingsError) {
            throw new Error("Failed to fetch user settings");
        }

        const { api_key: apiKey } = userSettings;

        const response = await fetch("/api/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt, apiKey })
        });

        if (!response.ok) {
            console.error("Error in fetchAnswer:", response.statusText);
            throw new Error(response.statusText);
        }
        return response.body;
    } catch (error) {
        console.error("Error in fetchAnswer:", error);
        throw error;
    }
}