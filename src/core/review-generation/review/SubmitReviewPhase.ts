import type { PromptComponent } from './PromptComponent';

export class SubmitReviewPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly prNumber: string,
    ) {}

    getText(): string {
        return `## Phase ${this.phaseNumber}: Submit Review

Create a pending review on pull request #${this.prNumber} and add all validated comments:

1. Create a new pending review. Do not add a review body — leave it empty.
2. Add each validated comment to the pending review using available tools.
   Format each comment according to the comment format from the validation phase.

If any operation fails, report the error and stop — do not submit a partial review.`;
    }
}
