import { ProvideMultipersonaReviewPhase } from './ProvideMultipersonaReviewPhase';

export class SingleAgentProvideMultipersonaReviewPhase extends ProvideMultipersonaReviewPhase {
    protected buildInstructions(): string {
        const reviewDataPath = `.ai/reviseo/${this.prNumber}/review_data.json`;
        return `## Phase ${this.phaseNumber}: Provide Multipersona Review

Read \`${reviewDataPath}\` to obtain the PR context and diff.
For each Step below, adopt that persona and perform your review according to its checklist.
Generate review comments but do NOT submit them — submission happens in a later phase.

If any operation fails, report the error and stop.`;
    }
}
