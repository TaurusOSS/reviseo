import type { PromptComponent } from './PromptComponent';

export class CleanupPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly reviewDataPath: string,
        private readonly diffFilePath: string,
        private readonly pendingReview = false,
    ) {}

    getText(): string {
        const condition = this.pendingReview
            ? 'once the pending review has been created and populated successfully'
            : 'once the review has been submitted successfully';
        return `## Phase ${this.phaseNumber}: Cleanup

Delete \`${this.reviewDataPath}\` and \`${this.diffFilePath}\` ${condition}.`;
    }
}
