export const REVISEO_BASE_DIR = '.ai/reviseo';

export function localReviewPaths(timestamp: string): { fullPath: string; directory: string } {
    return {
        fullPath: `${REVISEO_BASE_DIR}/${timestamp}/local.diff`,
        directory: `${REVISEO_BASE_DIR}/${timestamp}/`,
    };
}

export function generateLocalReviewTimestamp(date: Date = new Date()): string {
    return date.toISOString().replace(/\.\d{3}Z$/, '').replace(/:/g, '-');
}
