import type { ScrapeResponse } from "../types/job";

const API_URL = "http://localhost:3000";

export async function scrapeJobs(query: string): Promise<ScrapeResponse> {
    const response = await fetch(`${API_URL}/api/scrape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to scrape jobs");
    }

    return result;
}