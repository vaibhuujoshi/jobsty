import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { Job } from "../types/job";
import type { EnrichedJob } from "../types/enrichment";
import { enrichJob as enrichJobApi } from "../services/enrich";

interface EnrichmentContextType {
    enrichedJobs: Record<string, EnrichedJob>;
    loadingJobs: Record<string, boolean>;
    errors: Record<string, string>;
    enrich: (job: Job) => Promise<void>;
}

const EnrichmentContext = createContext<
    EnrichmentContextType | undefined
>(undefined);

export function EnrichmentProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [enrichedJobs, setEnrichedJobs] = useState<
        Record<string, EnrichedJob>
    >({});

    const [loadingJobs, setLoadingJobs] = useState<
        Record<string, boolean>
    >({});

    const [errors, setErrors] = useState<Record<string, string>>({});

    const enrich = async (job: Job) => {
        const key = job.sourceUrl;

        // Reuse an existing result.
        if (enrichedJobs[key]) return;

        // Prevent duplicate requests.
        if (loadingJobs[key]) return;

        setLoadingJobs((previous) => ({
            ...previous,
            [key]: true,
        }));

        setErrors((previous) => {
            const next = { ...previous };
            delete next[key];
            return next;
        });

        try {
            const result = await enrichJobApi({
                title: job.title,
                company: job.company,
                companyWebsite: job.companyWebsite,
                location: job.location,
                description: job.description,
            });

            setEnrichedJobs((previous) => ({
                ...previous,
                [key]: result,
            }));
        } catch (error) {
            setErrors((previous) => ({
                ...previous,
                [key]:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong during enrichment.",
            }));
        } finally {
            setLoadingJobs((previous) => ({
                ...previous,
                [key]: false,
            }));
        }
    };

    return (
        <EnrichmentContext.Provider
            value={{
                enrichedJobs,
                loadingJobs,
                errors,
                enrich,
            }}
        >
            {children}
        </EnrichmentContext.Provider>
    );
}

export function useEnrichment() {
    const context = useContext(EnrichmentContext);

    if (!context) {
        throw new Error(
            "useEnrichment must be used inside EnrichmentProvider"
        );
    }

    return context;
}