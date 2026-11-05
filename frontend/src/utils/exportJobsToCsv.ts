import type { Job } from "../types/job";

function escapeCsvValue(value: unknown): string {
    let text = String(value ?? "");

    // Prevent spreadsheet formula injection.
    if (/^[\s]*[=+\-@\t\r]/.test(text)) {
        text = `'${text}`;
    }

    return `"${text.replace(/"/g, '""')}"`;
}

export function exportJobsToCsv(jobs: Job[]) {
    if (jobs.length === 0) return;

    const headers = [
        "Job Title",
        "Company",
        "Company Website",
        "Location",
        "Employment Type",
        "Description",
        "Date Posted",
        "Application URL",
        "Source URL",
    ];

    const rows = jobs.map((job) => [
        job.title,
        job.company,
        job.companyWebsite,
        job.location,
        job.employmentType?.join(", "),
        job.description,
        job.datePosted,
        job.applicationUrl,
        job.sourceUrl,
    ]);

    const csvContent = [
        headers.map(escapeCsvValue).join(","),
        ...rows.map((row) =>
            row.map(escapeCsvValue).join(",")
        ),
    ].join("\r\n");

    const blob = new Blob(
        ["\uFEFF", csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const date = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `jobsty-jobs-${date}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    // Give the browser time to start the download.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}