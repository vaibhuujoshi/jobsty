export function deduplicateJobUrls(urls: string[]): string[] {
    return Array.from(new Set(urls));
}