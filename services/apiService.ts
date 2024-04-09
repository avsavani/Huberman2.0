import {HLChapter} from "@/types";

export async function searchChapters(apiKey: string, query: string, matchCount: number): Promise<HLChapter[]> {
    // Construct the query parameters string
    const response = await fetch("/api/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, apiKey, matches: matchCount })
    });
    
    // const text = await response.text(); // Get the raw text of the response
    // console.log("searchChapters response:", text); // Log it to see what's actually returned
    if (!response.ok) {
        console.error("Error in searchChapters:", response.statusText);
        throw new Error(response.statusText);
    }
    // const json = JSON.parse(text); // Parse it manually
    return response.json();
}

export async function fetchAnswer(apiKey: string, prompt: string): Promise<ReadableStream | null> {
    const response = await fetch("/api/answer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt, apiKey })
    });
    const text = await response.text(); // Get the raw text of the response
    console.log("fetchAnswer response:", text); // Log it to see what's actually returned
    if (!response.ok) {
        console.error("Error in fetchAnswer:", response.statusText);
        throw new Error(response.statusText);
    }
    const json = JSON.parse(text); // Parse it manually
    return json.body; // Assuming the original intention was to return the parsed body
}