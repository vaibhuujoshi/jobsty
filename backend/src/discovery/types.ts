export interface TavilySearchResult {
    url: string;
    title: string;
    content: string;
    score: number;
    raw_content: string | null;
    id: string;
}

export interface TavilySearchResponse {
    query: string;
    follow_up_questions: string[] | null;
    answer: string | null;
    images: string[];
    results: TavilySearchResult[];
    response_time: number;
    request_id: string;
}

export interface DiscoveredJobUrl {
    url: string;
    title: string;
    snippet: string;
    score: number;
    source: "tavily";
}