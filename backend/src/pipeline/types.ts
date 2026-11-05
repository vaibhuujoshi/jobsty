import type { NormalizedJob } from "../normalizers/types";

export interface ScrapeError {
    url: string;
    stage: string;
    error: string;
}

export interface ScrapeStats {
    discoveredListings: number;
    fetchedListings: number;
    extractedJobUrls: number;
    uniqueJobUrls: number;
    fetchedJobPages: number;
    extractedJobs: number;
}

export interface ScrapeResults {
    jobs: NormalizedJob[];
    errors: ScrapeError[];
    stats: ScrapeStats;
}