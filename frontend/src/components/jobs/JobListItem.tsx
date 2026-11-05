import { Bookmark, MapPin, BriefcaseBusiness } from "lucide-react";

import type { Job } from "../../types/job";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { formatJobDescription } from "../../utils/formatJobDescription";
import { cleanDescription } from "../../utils/cleanDescription";

interface JobListItemProps {
    job: Job;
    isSelected: boolean;
    onClick: () => void;
}

function JobListItem({ job, isSelected, onClick }: JobListItemProps) {
    const { isSaved, toggleSavedJob } = useSavedJobs();

    const saved = isSaved(job.sourceUrl);

    return (
        <div
            className={`relative border-b border-line transition-colors ${
                isSelected
                    ? "bg-blue-50/70 before:absolute before:inset-y-0 before:left-0 before:w-0.75 before:bg-brand"
                    : "bg-white hover:bg-gray-50"
            }`}
        >
            <div className="flex items-start">
                <button
                    type="button"
                    onClick={onClick}
                    aria-pressed={isSelected}
                    className="min-w-0 flex-1 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
                >
                    <h3 className="truncate font-semibold text-ink">
                        {job.title || "Untitled position"}
                    </h3>

                    <p className="mt-1 truncate text-sm text-muted">
                        {job.company || "Unknown company"}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                        {job.location && (
                            <span className="flex items-center gap-1">
                                <MapPin size={13} />
                                {job.location}
                            </span>
                        )}

                        {job.employmentType?.map((type) => (
                            <span key={type} className="flex items-center gap-1">
                                <BriefcaseBusiness size={13} />
                                {type.replaceAll("_", " ")}
                            </span>
                        ))}
                    </div>

                    {job.description && (
                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted">
                            {formatJobDescription(cleanDescription(job.description.replace(/<[^>]*>/g, " ")))}
                        </p>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => toggleSavedJob(job)}
                    aria-label={saved ? "Remove saved job" : "Save job"}
                    aria-pressed={saved}
                    title={saved ? "Remove from saved jobs" : "Save job"}
                    className={`mr-3 mt-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                        saved
                            ? "bg-blue-50 text-brand"
                            : "text-muted hover:bg-gray-100 hover:text-brand"
                    }`}
                >
                    <Bookmark
                        size={18}
                        fill={saved ? "currentColor" : "none"}
                    />
                </button>
            </div>
        </div>
    );
}

export default JobListItem;