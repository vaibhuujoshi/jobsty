export interface FetchedPage {
    url: string,
    html: string,
    status: number,
    contentType: string | null
}

export interface FetchPagesResult {
    successful: FetchedPage[];
    failed: {
        url: string;
        error: string;
    }[];
}