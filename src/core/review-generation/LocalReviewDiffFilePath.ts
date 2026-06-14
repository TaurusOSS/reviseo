export class LocalReviewDiffFilePath {
    constructor(private readonly timestamp: string) {}

    getFullPath(): string {
        return `.ai/reviseo/${this.timestamp}/local.diff`;
    }

    getDirectory(): string {
        return `.ai/reviseo/${this.timestamp}/`;
    }
}
