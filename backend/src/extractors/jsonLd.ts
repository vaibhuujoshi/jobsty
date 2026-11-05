import * as cheerio from 'cheerio';

export function extractJsonLd(
    html: string
): Record<string, unknown>[] {
    const $ = cheerio.load(html);

    const scripts = $('script[type="application/ld+json"]');

    const jobPostings: Record<string, unknown>[] = [];

    scripts.each((_, element) => {
        const scriptContent = $(element).html();

        if (!scriptContent) return;

        try {
            const parsedData: unknown = JSON.parse(scriptContent);

            const postings = findJobPostings(parsedData);

            jobPostings.push(...postings);
        } catch (error) {
            console.warn("Failed to parse JSON-LD:", error);
        }
    });

    return jobPostings;
}

function isJobPostingType(type: unknown): boolean {
    const types = Array.isArray(type) ? type : [type];

    return types.some(
        (value) =>
            typeof value === "string" &&
            value.split(/[\/#]/).pop() === "JobPosting"
    );
}

function findJobPostings(data: unknown): Record<string, unknown>[] {
    if (Array.isArray(data)) {
        return data.flatMap(findJobPostings);
    }

    if (typeof data !== "object" || data === null) {
        return [];
    }

    const object = data as Record<string, unknown>;

    const postings: Record<string, unknown>[] = [];

    if (isJobPostingType(object["@type"])) {
        postings.push(object);
    }

    for (const [key, value] of Object.entries(object)) {
        if (key === "@type") continue;

        if (typeof value === "object" && value !== null) {
            postings.push(...findJobPostings(value));
        }
    }

    return postings;
}