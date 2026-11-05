import type { Request, Response } from "express";
import { scrapeJobs } from "../../pipeline/scrapeJobs";

export async function scrapeController(
    req: Request,
    res: Response
) {
    try {
        const { query } = req.body;

        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "A valid search query is required",
            });
        }

        const result = await scrapeJobs(query.trim());

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Scraping failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to scrape jobs",
        });
    }
}