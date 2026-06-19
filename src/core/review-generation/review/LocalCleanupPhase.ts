import type { PromptComponent } from './PromptComponent';

export class LocalCleanupPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly diffFullPath: string,
    ) {}

    getText(): string {
        return `## Phase ${this.phaseNumber}: Cleanup

Delete \`${this.diffFullPath}\` once the review markdown has been written successfully.`;
    }
}
