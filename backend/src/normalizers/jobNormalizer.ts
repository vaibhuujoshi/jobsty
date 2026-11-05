import type { NormalizedJob } from "./types";

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | null {
    if (typeof value !== "string") return null;

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
}

function getCompany(job: JsonObject): string | null {
    const organization = job.hiringOrganization;

    if (!isObject(organization)) return null;

    return getString(organization.name);
}

function getCompanyWebsite(job: JsonObject): string | null {
    const organization = job.hiringOrganization;

    if (!isObject(organization)) return null;

    return getString(organization.url);
}

function getLocation(job: JsonObject): string | null {
    const jobLocation = job.jobLocation;

    if (Array.isArray(jobLocation)) {
        return jobLocation
            .map(getLocationFromPlace)
            .filter((location): location is string => location !== null)
            .join(", ") || null;
    }

    return getLocationFromPlace(jobLocation);
}

function getLocationFromPlace(value: unknown): string | null {
    if (!isObject(value)) return null;

    const address = value.address;

    if (typeof address === "string") {
        return getString(address);
    }

    if (!isObject(address)) return null;

    const parts = [
        address.addressLocality,
        address.addressRegion,
        address.addressCountry,
    ]
        .map(getString)
        .filter((part): part is string => part !== null);

    return parts.length > 0 ? parts.join(", ") : null;
}

function getEmploymentType(job: JsonObject): string[] | null {
    const employmentType = job.employmentType;

    if (typeof employmentType === "string") {
        return [employmentType];
    }

    if (Array.isArray(employmentType)) {
        const types = employmentType
            .map(getString)
            .filter((type): type is string => type !== null);

        return types.length > 0 ? types : null;
    }

    return null;
}

export function normalizeJobPosting(
    job: JsonObject,
    sourceUrl: string
): NormalizedJob {
    return {
        title: getString(job.title),
        company: getCompany(job),
        companyWebsite: getCompanyWebsite(job),
        location: getLocation(job),
        employmentType: getEmploymentType(job),
        description: getString(job.description),
        datePosted: getString(job.datePosted),
        applicationUrl: getString(job.url),
        sourceUrl,
    };
}