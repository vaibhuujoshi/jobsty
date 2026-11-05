import {
    ExternalLink,
    MapPin,
    BriefcaseBusiness,
    CalendarDays,
    Globe,
    Sparkles,
    LoaderCircle,
    Building2,
    Code2,
    CheckCircle2
} from "lucide-react";

import type { Job } from "../../types/job";
import { cleanDescription } from "../../utils/cleanDescription";
import { Bookmark } from "lucide-react";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { formatJobDescription } from "../../utils/formatJobDescription";
import { useEnrichment } from "../../context/EnrichmentContext";

interface JobDetailsProps {
    job: Job | null;
}

function formatDate(date: string | null) {
    if (!date) return null;

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(parsed);
}

function JobDetails({ job }: JobDetailsProps) {
    const { isSaved, toggleSavedJob } = useSavedJobs();

    const {
        enrichedJobs,
        loadingJobs,
        errors,
        enrich,
    } = useEnrichment();

    const enrichment = job
        ? enrichedJobs[job.sourceUrl]
        : undefined;

    const isEnriching = job
        ? Boolean(loadingJobs[job.sourceUrl])
        : false;

    const enrichmentError = job
        ? errors[job.sourceUrl]
        : undefined;

    if (!job) {
        return (
            <div className="flex h-full min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white p-8 text-center">
                <BriefcaseBusiness size={30} className="text-muted" />

                <h3 className="mt-4 font-semibold">
                    Select an opportunity
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                    Choose a job from the list to explore its description
                    and application details.
                </p>
            </div>
        );
    }

    const description = cleanDescription(job.description);
    const applicationUrl = job.applicationUrl || job.sourceUrl;
    const postedDate = formatDate(job.datePosted);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-white">
            {/* Sticky job header */}
            <div className="z-10 shrink-0 border-b border-line bg-white p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-brand">
                            {job.company || "Unknown company"}
                        </p>

                        <h2 className="mt-2 font-display text-xl font-bold leading-snug text-ink sm:text-2xl">
                            {job.title || "Untitled position"}
                        </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => toggleSavedJob(job)}
                            aria-label={isSaved(job.sourceUrl) ? "Remove saved job" : "Save job"}
                            aria-pressed={isSaved(job.sourceUrl)}
                            className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${isSaved(job.sourceUrl)
                                ? "border-blue-200 bg-blue-50 text-brand"
                                : "border-line text-muted hover:bg-gray-50 hover:text-brand"
                                }`}
                        >
                            <Bookmark
                                size={18}
                                fill={isSaved(job.sourceUrl) ? "currentColor" : "none"}
                            />
                        </button>

                        <a
                            href={applicationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Apply
                            <ExternalLink size={15} />
                        </a>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted sm:text-sm">
                    {job.location && (
                        <span className="flex items-center gap-2">
                            <MapPin size={15} />
                            {job.location}
                        </span>
                    )}

                    {job.employmentType?.map((type) => (
                        <span key={type} className="flex items-center gap-2">
                            <BriefcaseBusiness size={15} />
                            {type.replaceAll("_", " ")}
                        </span>
                    ))}

                    {postedDate && (
                        <span className="flex items-center gap-2">
                            <CalendarDays size={15} />
                            {postedDate}
                        </span>
                    )}
                </div>
            </div>

            {/* Independently scrollable content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="space-y-8 p-6">
                    <section>
                        <h3 className="font-display text-base font-semibold">
                            About this opportunity
                        </h3>

                        <div className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">
                            {formatJobDescription(description) || "No description available for this listing."}
                        </div>
                    </section>

                    <section className="border-t border-line pt-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Sparkles size={17} className="text-brand" />

                                    <h3 className="font-display text-base font-semibold">
                                        AI job intelligence
                                    </h3>
                                </div>

                                <p className="mt-1 text-xs text-muted">
                                    Company research and insights extracted from this listing.
                                </p>
                            </div>

                            {!enrichment && (
                                <button
                                    type="button"
                                    onClick={() => void enrich(job)}
                                    disabled={isEnriching}
                                    className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isEnriching ? (
                                        <>
                                            <LoaderCircle size={15} className="animate-spin" />
                                            Researching...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={15} />
                                            Enrich job
                                        </>
                                    )}
                                </button>
                            )}

                            {enrichment && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
                                    <CheckCircle2 size={15} />
                                    Enriched
                                </span>
                            )}
                        </div>

                        {enrichmentError && (
                            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="text-sm text-red-700">
                                    {enrichmentError}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => void enrich(job)}
                                    className="mt-2 text-xs font-semibold text-red-700 underline"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {isEnriching && (
                            <div className="mt-5 flex items-center gap-3 rounded-lg border border-line bg-paper p-4">
                                <LoaderCircle
                                    size={20}
                                    className="animate-spin text-brand"
                                />

                                <div>
                                    <p className="text-sm font-medium text-ink">
                                        Researching this opportunity
                                    </p>

                                    <p className="mt-1 text-xs text-muted">
                                        Gathering company information and analyzing job requirements.
                                    </p>
                                </div>
                            </div>
                        )}

                        {enrichment && (
                            <div className="mt-6 space-y-7">
                                {/* Company information */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-muted" />
                                        <h4 className="text-sm font-semibold text-ink">
                                            Company overview
                                        </h4>
                                    </div>

                                    <div className="mt-3 rounded-lg border border-line p-4">
                                        <h5 className="font-semibold text-ink">
                                            {enrichment.company.name || job.company || "Company"}
                                        </h5>

                                        {enrichment.company.overview && (
                                            <p className="mt-2 text-sm leading-6 text-muted">
                                                {enrichment.company.overview}
                                            </p>
                                        )}

                                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                                            {enrichment.company.industry && (
                                                <div>
                                                    <p className="text-xs text-muted">Industry</p>
                                                    <p className="mt-1 font-medium text-ink">
                                                        {enrichment.company.industry}
                                                    </p>
                                                </div>
                                            )}

                                            {enrichment.company.headquarters && (
                                                <div>
                                                    <p className="text-xs text-muted">
                                                        Headquarters
                                                    </p>
                                                    <p className="mt-1 font-medium text-ink">
                                                        {enrichment.company.headquarters}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {enrichment.company.website && (
                                            <a
                                                href={enrichment.company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
                                            >
                                                <Globe size={14} />
                                                Company website
                                                <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Tech stack */}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Code2 size={16} className="text-muted" />
                                        <h4 className="text-sm font-semibold text-ink">
                                            Tech stack
                                        </h4>
                                    </div>

                                    {enrichment.jobInsights.techStack.length > 0 ? (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {enrichment.jobInsights.techStack.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="rounded-md border border-line bg-paper px-3 py-1.5 text-xs font-medium text-ink"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-3 text-sm text-muted">
                                            No technologies identified.
                                        </p>
                                    )}
                                </div>

                                {/* Required skills */}
                                <div>
                                    <h4 className="text-sm font-semibold text-ink">
                                        Required skills
                                    </h4>

                                    {enrichment.jobInsights.requiredSkills.length > 0 ? (
                                        <ul className="mt-3 space-y-2">
                                            {enrichment.jobInsights.requiredSkills.map((skill) => (
                                                <li
                                                    key={skill}
                                                    className="flex items-start gap-2 text-sm text-muted"
                                                >
                                                    <CheckCircle2
                                                        size={15}
                                                        className="mt-0.5 shrink-0 text-brand"
                                                    />
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-muted">
                                            No specific skills identified.
                                        </p>
                                    )}
                                </div>

                                {/* Experience */}
                                {enrichment.jobInsights.experience && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-ink">
                                            Experience
                                        </h4>

                                        <p className="mt-2 text-sm text-muted">
                                            {enrichment.jobInsights.experience}
                                        </p>
                                    </div>
                                )}

                                {/* Responsibilities */}
                                <div>
                                    <h4 className="text-sm font-semibold text-ink">
                                        Key responsibilities
                                    </h4>

                                    {enrichment.jobInsights.responsibilities.length > 0 ? (
                                        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted">
                                            {enrichment.jobInsights.responsibilities.map(
                                                (responsibility) => (
                                                    <li key={responsibility}>
                                                        {responsibility}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 text-sm text-muted">
                                            No responsibilities identified.
                                        </p>
                                    )}
                                </div>

                                {/* Contact and social profiles */}
                                <div>
                                    <h4 className="text-sm font-semibold text-ink">
                                        Public company links
                                    </h4>

                                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm">
                                        {enrichment.company.contact.email && (
                                            <a
                                                href={`mailto:${enrichment.company.contact.email}`}
                                                className="text-brand hover:underline"
                                            >
                                                Email
                                            </a>
                                        )}

                                        {enrichment.company.contact.phone && (
                                            <a
                                                href={`tel:${enrichment.company.contact.phone}`}
                                                className="text-brand hover:underline"
                                            >
                                                Phone
                                            </a>
                                        )}

                                        {enrichment.company.socialProfiles.linkedin && (
                                            <a
                                                href={enrichment.company.socialProfiles.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand hover:underline"
                                            >
                                                LinkedIn
                                            </a>
                                        )}

                                        {enrichment.company.socialProfiles.instagram && (
                                            <a
                                                href={enrichment.company.socialProfiles.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand hover:underline"
                                            >
                                                Instagram
                                            </a>
                                        )}

                                        {enrichment.company.socialProfiles.x && (
                                            <a
                                                href={enrichment.company.socialProfiles.x}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-brand hover:underline"
                                            >
                                                X
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Research sources */}
                                <div>
                                    <h4 className="text-sm font-semibold text-ink">
                                        Research sources
                                    </h4>

                                    {enrichment.sources.length > 0 ? (
                                        <ul className="mt-3 space-y-3">
                                            {enrichment.sources.map((source) => (
                                                <li key={source.url}>
                                                    <a
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-start gap-2 text-sm text-brand hover:underline"
                                                    >
                                                        <ExternalLink
                                                            size={14}
                                                            className="mt-0.5 shrink-0"
                                                        />
                                                        <span>{source.title}</span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-2 text-sm text-muted">
                                            No external research sources returned.
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>

                    {job.companyWebsite && (
                        <section className="border-t border-line pt-6">
                            <h3 className="font-display text-sm font-semibold">
                                Company website
                            </h3>

                            <a
                                href={job.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm text-brand hover:underline"
                            >
                                <Globe size={15} />
                                Visit company website
                                <ExternalLink size={13} />
                            </a>
                        </section>
                    )}

                    <section className="border-t border-line pt-6">
                        <h3 className="font-display text-sm font-semibold">
                            Original listing
                        </h3>

                        <a
                            href={job.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-2 break-all text-sm text-brand hover:underline"
                        >
                            Open source listing
                            <ExternalLink size={13} />
                        </a>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;