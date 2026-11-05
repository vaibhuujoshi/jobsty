import type { TavilySearchResponse } from "./types";

const TAVILY_API_URL = "https://api.tavily.com/search";

export async function searchJobs(
    query: string
): Promise<TavilySearchResponse> {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
        throw new Error("TAVILY_API_KEY is not set in environment variables");
    }

    if (!query.trim()) {
        throw new Error("Search query cannot be empty");
    }

    const response = await fetch(TAVILY_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            query,
            max_results: 10,
            search_depth: "basic",
            topic: "general",
            include_answer: false,
            include_raw_content: false,
        }),
    });

    if (!response.ok) {
        throw new Error(
            `Tavily API request failed: ${response.status} ${response.statusText}`
        );
    }

    const data = (await response.json()) as TavilySearchResponse;

    return data;
}