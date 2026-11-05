import { useState } from "react";
import { LoaderCircle, Search, Sparkles, Download } from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import JobList from "../components/jobs/JobList";
import JobDetails from "../components/jobs/JobDetails";

import { scrapeJobs } from "../services/scrape";
import type { Job, ScrapeResponse } from "../types/job";
import { exportJobsToCsv } from "../utils/exportJobsToCsv";

function Discover() {
    const [query, setQuery] = useState("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const [stats, setStats] = useState<ScrapeResponse["data"]["stats"] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setJobs([]);
        setSelectedJob(null);
        setStats(null);
        setHasSearched(true);

        try {
            const response = await scrapeJobs(query.trim());

            setJobs(response.data.jobs);
            setStats(response.data.stats);
            setSelectedJob(response.data.jobs[0] ?? null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while searching."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-paper text-ink">
            <Sidebar />

            <main className="ml-60 min-h-screen px-10 py-10">
                <div className="mx-auto max-w-375">
                    <div className="mb-9">
                        <div className="mb-3 flex items-center gap-2 text-sm text-brand">
                            <Sparkles size={16} />
                            Job discovery workspace
                        </div>

                        <h1 className="font-display text-3xl font-bold tracking-tight">
                            Find work worth building for.
                        </h1>

                        <p className="mt-2 text-sm text-muted">
                            Search across the web and explore opportunities in one place.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="flex max-w-3xl items-center gap-3 rounded-xl border border-line bg-white p-2 shadow-sm"
                    >
                        <Search className="ml-3 shrink-0 text-muted" size={20} />

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Try 'Backend developer jobs in India'..."
                            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />

                        <button
                            type="submit"
                            disabled={!query.trim() || isLoading}
                            className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle size={16} className="animate-spin" />
                                    Searching
                                </>
                            ) : (
                                "Search jobs"
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 max-w-3xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex min-h-100 flex-col items-center justify-center gap-3 text-center">
                            <LoaderCircle size={30} className="animate-spin text-brand" />

                            <p className="font-medium">
                                Searching for opportunities...
                            </p>

                            <p className="text-sm text-muted">
                                Discovering listings and extracting job details.
                            </p>
                        </div>
                    )}

                    {!isLoading && jobs.length > 0 && (
                        <section className="mt-10">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="font-display text-xl font-semibold">
                                        Search results
                                    </h2>

                                    <p className="mt-1 text-sm text-muted">
                                        {jobs.length} opportunities for "{query}"
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    {stats && (
                                        <p className="text-xs text-muted">
                                            {stats.uniqueJobUrls} unique URLs · {stats.extractedJobs} extracted jobs
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => exportJobsToCsv(jobs)}
                                        disabled={jobs.length === 0}
                                        className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Download size={16} />
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-5 lg:h-[calc(100dvh-300px)] lg:min-h-105 lg:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.5fr)] lg:items-stretch">
                                <JobList
                                    jobs={jobs}
                                    selectedJob={selectedJob}
                                    onSelect={setSelectedJob}
                                />

                                <JobDetails job={selectedJob} />
                            </div>
                        </section>
                    )}

                    {!isLoading && !error && jobs.length === 0 && (
                        <div className="mt-16 border-t border-line pt-8">
                            {hasSearched ? (
                                <>
                                    <h2 className="font-display text-lg font-semibold">
                                        No jobs extracted
                                    </h2>

                                    <p className="mt-2 text-sm text-muted">
                                        We couldn't extract structured job details for this search.
                                        Try a different query.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h2 className="font-display text-lg font-semibold">
                                        Your discoveries will appear here
                                    </h2>

                                    <p className="mt-2 text-sm text-muted">
                                        Enter a search query to discover opportunities from multiple job platforms.
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Discover;