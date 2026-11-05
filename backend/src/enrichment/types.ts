export interface EnrichmentInput {
    title: string | null;
    company: string | null;
    companyWebsite: string | null;
    location: string | null;
    description: string | null;
}

export interface CompanyResearchResult {
    title: string;
    url: string;
    content: string;
}

export interface EnrichedJob {
    company: {
        name: string | null;
        overview: string | null;
        industry: string | null;
        website: string | null;
        headquarters: string | null;
        contact: {
            email: string | null;
            phone: string | null;
        };
        socialProfiles: {
            linkedin: string | null;
            instagram: string | null;
            x: string | null;
        };
    };
    jobInsights: {
        techStack: string[];
        requiredSkills: string[];
        experience: string | null;
        responsibilities: string[];
    };
    sources: {
        title: string;
        url: string;
    }[];
}