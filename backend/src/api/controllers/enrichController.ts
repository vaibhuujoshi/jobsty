import type { Request, Response } from "express";
import { enrichJob } from "../../enrichment/enrichJob";
import type { EnrichmentInput } from "../../enrichment/types";

export async function enrichController(req: Request, res: Response) {
    try {
        const {
            title,
            company,
            companyWebsite,
            location,
            description,
        } = req.body as Partial<EnrichmentInput>;

        if (
            (typeof title !== "string" || !title.trim()) &&
            (typeof description !== "string" || !description.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "A job title or description is required",
            });
        }

        const job: EnrichmentInput = {
            title: typeof title === "string" ? title.slice(0, 300) : null,
            company: typeof company === "string" ? company.slice(0, 200) : null,
            companyWebsite:
                typeof companyWebsite === "string"
                    ? companyWebsite.slice(0, 1000)
                    : null,
            location:
                typeof location === "string" ? location.slice(0, 200) : null,
            description:
                typeof description === "string"
                    ? description.slice(0, 15000)
                    : null,
        };

        const result = await enrichJob(job);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Job enrichment failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to enrich job information",
        });
    }
}