import type { PromptComponent } from './PromptComponent';

export class CleanupPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly prNumber: string,
        private readonly pendingReview = false,
    ) {}

    getText(): string {
        const reviewDataPath = `.ai/reviseo/${this.prNumber}/review_data.json`;
        const diffFilePath = `.ai/reviseo/${this.prNumber}/diff.patch`;
        const condition = this.pendingReview
            ? 'once the pending review has been created and populated successfully'
            : 'once the review has been submitted successfully';
        return `## Phase ${this.phaseNumber}: Cleanup

Delete \`${reviewDataPath}\` and \`${diffFilePath}\` ${condition}.`;
    }
}
