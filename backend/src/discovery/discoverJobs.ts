import { searchJobs } from "./tavily";
import type { DiscoveredJobUrl } from "./types";

export async function discoverJobs(
    query: string
): Promise<DiscoveredJobUrl[]> {
    const response = await searchJobs(query);

    const discoveredJobs: DiscoveredJobUrl[] = response.results.map(
        (result) => ({
            url: result.url,
            title: result.title,
            snippet: result.content,
            score: result.score,
            source: "tavily",
        })
    );

    const uniqueJobs = new Map<string, DiscoveredJobUrl>();

    for (const job of discoveredJobs) {
        const normalizedUrl = job.url.trim().replace(/\/+$/, "");

        if (!uniqueJobs.has(normalizedUrl)) {
            uniqueJobs.set(normalizedUrl, job);
        }
    }

    return Array.from(uniqueJobs.values());
}