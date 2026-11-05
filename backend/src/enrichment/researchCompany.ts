import { searchJobs } from "../discovery/tavily";
import type { CompanyResearchResult } from "./types";

export async function researchCompany(
    company: string,
    location: string | null
): Promise<CompanyResearchResult[]> {
    const query = [
        `"${company}"`,
        "official website company overview headquarters contact LinkedIn",
        location,
    ]
        .filter(Boolean)
        .join(" ");

    const response = await searchJobs(query);

    return response.results.slice(0, 5).map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content,
    }));
}