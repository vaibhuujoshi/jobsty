export interface NormalizedJob {
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