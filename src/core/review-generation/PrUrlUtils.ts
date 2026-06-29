export function extractPrNumber(url: string): string | null {
    return url.match(/\/pull\/(\d+)/)?.[1] ?? null;
}
