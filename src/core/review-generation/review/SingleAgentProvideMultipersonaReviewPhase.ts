import type { StepsComponent } from './StepsComponent';
import { ProvideMultipersonaReviewPhase } from './ProvideMultipersonaReviewPhase';

export class SingleAgentProvideMultipersonaReviewPhase extends ProvideMultipersonaReviewPhase {
    constructor(
        phaseNumber: number,
        stepsComponent: StepsComponent,
        dataFilePath: string,
        private readonly reviewDataPath?: string,
    ) {
        super(phaseNumber, stepsComponent, dataFilePath);
    }

    protected buildInstructions(): string {
        const metadataLine = this.reviewDataPath
            ? `\nRead \`${this.reviewDataPath}\` to obtain the PR title and description for context.`
            : '';
        return `## Phase ${this.phaseNumber}: Provide Multipersona Review

Read \`${this.dataFilePath}\` to obtain the diff.${metadataLine}
For each Step below, adopt that persona and perform your review according to its checklist.
Generate review comments but do NOT submit them — submission happens in a later phase.
Retain comments as an in-memory list; each item: persona name, file path, line number, title, body.

If any operation fails, report the error and stop.`;
    }
}
