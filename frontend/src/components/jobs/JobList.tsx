import type { Job } from "../../types/job";
import JobListItem from "./JobListItem";

interface JobListProps {
    jobs: Job[];
    selectedJob: Job | null;
    onSelect: (job: Job) => void;
}

function JobList({ jobs, selectedJob, onSelect }: JobListProps) {
    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-white">
            {/* Fixed header */}
            <div className="shrink-0 border-b border-line px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-semibold">
                            Opportunities
                        </h2>
                        <p className="mt-1 text-xs text-muted">
                            {jobs.length} jobs discovered
                        </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-brand">
                        {jobs.length} results
                    </span>
                </div>
            </div>

            {/* Independently scrollable list */}
            <div className="job-list-scroll min-h-0 flex-1 overflow-y-scroll overscroll-contain">
                {jobs.map((job) => (
                    <JobListItem
                        key={job.sourceUrl}
                        job={job}
                        isSelected={selectedJob?.sourceUrl === job.sourceUrl}
                        onClick={() => onSelect(job)}
                    />
                ))}
            </div>
        </div>
    );
}

export default JobList;