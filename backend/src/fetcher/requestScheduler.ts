import PQueue from "p-queue";

const GLOBAL_CONCURRENCY = 5;
const DOMAIN_CONCURRENCY = 1;
const DOMAIN_INTERVAL = 2000;

const globalQueue = new PQueue({
    concurrency: GLOBAL_CONCURRENCY,
});

const domainQueues = new Map<string, PQueue>();

function getDomainQueue(url: string): PQueue {
    const hostname = new URL(url).hostname;

    let queue = domainQueues.get(hostname);

    if (!queue) {
        queue = new PQueue({
            concurrency: DOMAIN_CONCURRENCY,
            intervalCap: 1,
            interval: DOMAIN_INTERVAL,
            strict: true,
        });

        domainQueues.set(hostname, queue);
    }

    return queue;
}

export function scheduleRequest<T>(
    url: string,
    task: () => Promise<T>
): Promise<T> {
    const domainQueue = getDomainQueue(url);

    return globalQueue.add(() =>
        domainQueue.add(task)
    ) as Promise<T>;
}