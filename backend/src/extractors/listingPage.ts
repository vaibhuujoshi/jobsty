import * as cheerio from "cheerio";

function isLikelyJobLink(url: URL): boolean {
    const hostname = url.hostname.replace(/^www\./, "");
    const pathname = url.pathname;

    // OnlyFrontendJobs
    if (hostname === "onlyfrontendjobs.com") {
        return /^\/jobs\/[^/]+\/?$/.test(pathname);
    }

    // Wellfound
    if (hostname === "wellfound.com") {
        return /^\/jobs\/\d+-[^/]+\/?$/.test(pathname);
    }

    // LinkedIn
    if (hostname.endsWith("linkedin.com")) {
        return /^\/jobs\/view\/[^/]+\/?$/.test(pathname);
    }

    // Indeed
    if (hostname.endsWith("indeed.com")) {
        return pathname === "/rc/clk" &&
            url.searchParams.has("jk");
    }

    // Apna
    if (hostname === "apna.co") {
        return /^\/job\/(?:\d+|[^/]+\/[^/]+-\d+)\/?$/.test(pathname);
    }

    return false;
}

function normalizeJobUrl(url: URL): string {
    url.hash = "";

    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname.endsWith("linkedin.com")) {
        url.search = "";
    }

    // Indeed's jk parameter identifies the job.
    if (hostname.endsWith("indeed.com")) {
        const jobKey = url.searchParams.get("jk");

        url.search = "";
        if (jobKey) {
            url.searchParams.set("jk", jobKey);
        }
    }

    return url.href;
}

export function extractJobLinks(
    html: string,
    pageUrl: string
): string[] {
    const $ = cheerio.load(html);
    const jobLinks = new Set<string>();

    $("a[href]").each((_, element) => {
        const href = $(element).attr("href");

        if (!href) return;

        try {
            const absoluteUrl = new URL(href, pageUrl);

            if (!["http:", "https:"].includes(absoluteUrl.protocol)) {
                return;
            }

            if (!isLikelyJobLink(absoluteUrl)) {
                return;
            }

            jobLinks.add(normalizeJobUrl(absoluteUrl));
        } catch {
            // Ignore malformed URLs.
        }
    });

    return Array.from(jobLinks);
}