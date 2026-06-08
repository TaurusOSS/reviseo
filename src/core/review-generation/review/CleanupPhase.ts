import type { PromptComponent } from './PromptComponent';

export class CleanupPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly prNumber: string,
    ) {}

    getText(): string {
        const reviewDataPath = `.ai/reviseo/${this.prNumber}/review_data.json`;
        return `## Phase ${this.phaseNumber}: Cleanup

Delete \`${reviewDataPath}\` once the review has been submitted successfully.`;
    }
}
