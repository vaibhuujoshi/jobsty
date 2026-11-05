import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { Job } from "../types/job";

interface SavedJobsContextType {
    savedJobs: Job[];
    isSaved: (sourceUrl: string) => boolean;
    toggleSavedJob: (job: Job) => void;
    removeSavedJob: (sourceUrl: string) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(
    undefined
);

const STORAGE_KEY = "jobsty-saved-jobs";

function getInitialSavedJobs(): Job[] {
    try {
        const storedJobs = localStorage.getItem(STORAGE_KEY);

        if (!storedJobs) return [];

        const parsed = JSON.parse(storedJobs);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function SavedJobsProvider({ children }: { children: ReactNode }) {
    const [savedJobs, setSavedJobs] = useState<Job[]>(getInitialSavedJobs);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedJobs));
    }, [savedJobs]);

    function isSaved(sourceUrl: string) {
        return savedJobs.some((job) => job.sourceUrl === sourceUrl);
    }

    function toggleSavedJob(job: Job) {
        setSavedJobs((currentJobs) => {
            const alreadySaved = currentJobs.some(
                (savedJob) => savedJob.sourceUrl === job.sourceUrl
            );

            if (alreadySaved) {
                return currentJobs.filter(
                    (savedJob) => savedJob.sourceUrl !== job.sourceUrl
                );
            }

            return [...currentJobs, job];
        });
    }

    function removeSavedJob(sourceUrl: string) {
        setSavedJobs((currentJobs) =>
            currentJobs.filter((job) => job.sourceUrl !== sourceUrl)
        );
    }

    return (
        <SavedJobsContext.Provider
            value={{
                savedJobs,
                isSaved,
                toggleSavedJob,
                removeSavedJob,
            }}
        >
            {children}
        </SavedJobsContext.Provider>
    );
}

export function useSavedJobs() {
    const context = useContext(SavedJobsContext);

    if (!context) {
        throw new Error(
            "useSavedJobs must be used inside SavedJobsProvider"
        );
    }

    return context;
}