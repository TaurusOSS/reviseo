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
            ? `Create a pending review on pull request #${this.prNumber} and add all validated comments. Do NOT submit it:`
            : `Create a pending review on pull request #${this.prNumber} and add all validated comments:`;
        const stopStep = this.pendingReview
            ? '\n3. Stop here — do NOT submit or publish the review. Leave it in pending/draft state for manual inspection before publishing.'
            : '';

        return `## Phase ${this.phaseNumber}: ${title}

${header}

1. Create a new pending review. Do not add a review body — leave it empty.
2. Add each validated comment to the pending review using available tools.
   Format each comment according to the comment format from the validation phase.${stopStep}

If any operation fails, report the error and stop — do not submit a partial review.`;
    }
}
