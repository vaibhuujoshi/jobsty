import type {
    EnrichedJob,
    EnrichmentRequest,
    EnrichmentResponse,
} from "../types/enrichment";

const API_BASE_URL = "http://localhost:3000";

export async function enrichJob(
    job: EnrichmentRequest
): Promise<EnrichedJob> {
    const response = await fetch(`${API_BASE_URL}/api/enrich`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
    });

    const result = (await response.json()) as EnrichmentResponse;

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Unable to enrich this job right now."
        );
    }

    return result.data;
}