export interface EnrichmentRequest {
    title: string | null;
    company: string | null;
    companyWebsite: string | null;
    location: string | null;
    description: string | null;
}

export interface EnrichedCompany {
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
}

export interface JobInsights {
    techStack: string[];
    requiredSkills: string[];
    experience: string | null;
    responsibilities: string[];
}

export interface ResearchSource {
    title: string;
    url: string;
}

export interface EnrichedJob {
    company: EnrichedCompany;
    jobInsights: JobInsights;
    sources: ResearchSource[];
}

export interface EnrichmentResponse {
    success: boolean;
    data: EnrichedJob;
    message?: string;
}