import { discoverJobs } from "../discovery/discoverJobs";
import { extractJsonLd } from "../extractors/jsonLd";
import { extractJobLinks } from "../extractors/listingPage";
import { fetchPages } from "../fetcher/fetchPages";
import { normalizeJobPosting } from "../normalizers/jobNormalizer";
import type { NormalizedJob } from "../normalizers/types";
import { deduplicateJobUrls } from "../utils/deduplicateJobUrls";
import type { ScrapeError, ScrapeResults } from "./types";

export async function scrapeJobs(
    query: string
): Promise<ScrapeResults> {
    const errors: ScrapeError[] = [];

    const listings = await discoverJobs(query);

    const listingResult = await fetchPages(
        listings.map((listing) => listing.url)
    );

    errors.push(
        ...listingResult.failed.map((failure) => ({
            ...failure,
            stage: "listing-fetch",
        }))
    );

    const extractedUrls = listingResult.successful.flatMap((page) => 
        extractJobLinks(page.html, page.url)
    );

    const uniqueJobUrls = deduplicateJobUrls(extractedUrls);

    const jobResult = await fetchPages(uniqueJobUrls);

    errors.push(
        ...jobResult.failed.map((failure) => ({
            ...failure,
            stage: "job-fetch",
        }))
    );

    const jobs: NormalizedJob[] = [];

    for (const page of jobResult.successful) {
        const jobPostings = extractJsonLd(page.html);

        for (const posting of jobPostings) {
            jobs.push(normalizeJobPosting(posting, page.url));
        }
    }

    return {
        jobs,
        errors,
        stats: {
            discoveredListings: listings.length,
            fetchedListings: listingResult.successful.length,
            extractedJobUrls: extractedUrls.length,
            uniqueJobUrls: uniqueJobUrls.length,
            fetchedJobPages: jobResult.successful.length,
            extractedJobs: jobs.length,
        },
    }
}