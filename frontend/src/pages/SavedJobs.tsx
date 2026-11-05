import { useState } from "react";
import { Bookmark, BriefcaseBusiness, Download } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import JobList from "../components/jobs/JobList";
import JobDetails from "../components/jobs/JobDetails";

import { useSavedJobs } from "../context/SavedJobsContext";
import type { Job } from "../types/job";
import { exportJobsToCsv } from "../utils/exportJobsToCsv";

function SavedJobs() {
    const { savedJobs } = useSavedJobs();

    const [selectedSourceUrl, setSelectedSourceUrl] = useState<string | null>(
        null
    );

    const selectedJob: Job | null =
        savedJobs.find((job) => job.sourceUrl === selectedSourceUrl) ??
        savedJobs[0] ??
        null;

    return (
        <div className="min-h-screen bg-paper text-ink">
            <Sidebar />

            <main className="ml-60 min-h-screen px-10 py-10">
                <div className="mx-auto max-w-375">
                    <div className="mb-9">
                        <div className="mb-3 flex items-center gap-2 text-sm text-brand">
                            <Bookmark size={16} />
                            Your collection
                        </div>

                        <h1 className="font-display text-3xl font-bold tracking-tight">
                            Saved jobs
                        </h1>

                        <p className="mt-2 text-sm text-muted">
                            Keep track of opportunities worth exploring.
                        </p>
                    </div>

                    {savedJobs.length > 0 ? (
                        <>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <p className="text-sm text-muted">
                                    {savedJobs.length} saved{" "}
                                    {savedJobs.length === 1
                                        ? "opportunity"
                                        : "opportunities"}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => exportJobsToCsv(savedJobs)}
                                    disabled={savedJobs.length === 0}
                                    className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Download size={16} />
                                    Export CSV
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-5 lg:h-[calc(100dvh-250px)] lg:min-h-105 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.5fr)] lg:items-stretch">
                                <JobList
                                    jobs={savedJobs}
                                    selectedJob={selectedJob}
                                    onSelect={(job) =>
                                        setSelectedSourceUrl(job.sourceUrl)
                                    }
                                />

                                <JobDetails job={selectedJob} />
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-105 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white px-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-brand">
                                <BriefcaseBusiness size={25} />
                            </div>

                            <h2 className="mt-5 font-display text-lg font-semibold">
                                No saved jobs yet
                            </h2>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                                When you find an interesting opportunity,
                                bookmark it to keep it here for later.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SavedJobs;