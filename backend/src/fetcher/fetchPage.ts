import type { FetchedPage } from "./types";

const REQUEST_TIMEOUT = 15_000;

export async function fetchPage(
    url: string
): Promise<FetchedPage> {
    let parsedUrl: URL;

    try {
        parsedUrl = new URL(url);
    } catch {
        throw new Error(`Invalid URL: ${url}`);
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error(`Unsupported URL protocol: ${parsedUrl.protocol}`);
    }

    const response = await fetch(parsedUrl, {
        method: "GET",

        headers: {
            "User-Agent": "Jobsty/1.0",
            Accept: "text/html,application/xhtml+xml",
        },

        signal: AbortSignal.timeout(REQUEST_TIMEOUT),

        redirect: "follow",
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${url}: HTTP ${response.status} ${response.statusText}`
        );
    }

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("text/html") &&
        !contentType?.includes("application/xhtml+xml")) {
        throw new Error(
            `Expected HTML but received: ${contentType ?? "unknown content type"}`
        );
    }

    const html = await response.text();

    return {
        url: response.url || url,
        html,
        status: response.status,
        contentType,
    };
}