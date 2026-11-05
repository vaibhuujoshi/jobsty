export interface Job {
    title: string | null;
    company: string | null;
    companyWebsite: string | null;
    location: string | null;
    employmentType: string[] | null;
    description: string | null;
    datePosted: string | null;
    applicationUrl: string | null;
    sourceUrl: string;
}

export interface ScrapeResponse {
    success: boolean;
    data: {
        jobs: Job[];
        errors: {
            url: string;
            error: string;
            stage: string;
        }[];
        stats: {
            discoveredListings: number;
            fetchedListings: number;
            extractedJobUrls: number;
            uniqueJobUrls: number;
            fetchedJobPages: number;
            extractedJobs: number;
        };
    };
}