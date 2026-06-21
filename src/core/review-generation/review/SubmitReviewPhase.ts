import type { PromptComponent } from './PromptComponent';

export class SubmitReviewPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly prNumber: string,
        private readonly pendingReview = false,
    ) {}

    getText(): string {
        const title = this.pendingReview ? 'Create Pending Review' : 'Submit Review';
        const header = this.pendingReview
            ? `Create a pending review on pull request #${this.prNumber}, add all prepared comments, and stop — do NOT submit or publish it. Leave it in pending/draft state for manual inspection.`
            : `Create a pending review on pull request #${this.prNumber} and add all prepared comments:`;

        return `## Phase ${this.phaseNumber}: ${title}

${header}

1. Create a new pending review. Do not add a review body — leave it empty.
2. Add each prepared comment to the pending review using available tools.

If any operation fails, report the error and stop — do not submit a partial review.`;
    }
}
