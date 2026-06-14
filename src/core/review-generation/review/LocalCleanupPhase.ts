import type { PromptComponent } from './PromptComponent';
import type { LocalReviewDiffFilePath } from '../LocalReviewDiffFilePath';

export class LocalCleanupPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly diffFilePath: LocalReviewDiffFilePath,
    ) {}

    getText(): string {
        return `## Phase ${this.phaseNumber}: Cleanup

Delete \`${this.diffFilePath.getFullPath()}\` once the review markdown has been written successfully.`;
    }
}
