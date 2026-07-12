import type { PromptComponent } from './PromptComponent';

export class LocalWriteReviewPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly timestamp: string,
        private readonly diffSource: 'branch' | 'uncommitted',
        private readonly baseBranch: string | undefined,
    ) {}

    getText(): string {
        const reviewPath = `.ai/reviseo/${this.timestamp}/local_review.md`;
        const diffSourceLabel = this.diffSource === 'branch'
            ? `Diff source: \`${this.baseBranch}\``
            : 'Diff source: uncommitted changes';
        return `## Phase ${this.phaseNumber}: Write Review

Write the prepared comments from Phase ${this.phaseNumber - 1} to \`${reviewPath}\`.

Structure the file as follows:

\`\`\`
# Local Code Review — ${this.timestamp}
${diffSourceLabel}

## Findings

**path/to/file.ts:line**
🔴 [blocking] description of a blocker

Why text.

Proposed fix.

**path/to/file.ts:line**
🟡 [suggestion] description of a recommendation

Why text.

Proposed fix.

...
\`\`\`

Group findings by file path. Include all prepared comments. If the file already exists, overwrite it.

If any step fails, report the error and stop.`;
    }
}
