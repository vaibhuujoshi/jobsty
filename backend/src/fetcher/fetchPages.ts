import { fetchPage } from "./fetchPage";
import type { FetchedPage, FetchPagesResult } from "./types";
import { scheduleRequest } from "./requestScheduler";

export async function fetchPages(
    urls: string[]
): Promise<FetchPagesResult> {
    const results = await Promise.allSettled(
        urls.map((url) =>
            scheduleRequest(url, () => fetchPage(url))
        )
    );

    const successful: FetchedPage[] = [];
    const failed: FetchPagesResult["failed"] = [];

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            successful.push(result.value);
        } else {
            failed.push({
                url: urls[index]!,
                error:
                    result.reason instanceof Error
                        ? result.reason.message
                        : String(result.reason),
            });
        }
    });

    return { successful, failed };
}