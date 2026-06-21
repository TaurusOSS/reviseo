import type { PromptComponent } from './PromptComponent';

export class LocalWriteReviewPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly timestamp: string,
        private readonly baseBranch: string,
    ) {}

    getText(): string {
        const reviewPath = `.ai/reviseo/${this.timestamp}/local_review.md`;
        return `## Phase ${this.phaseNumber}: Write Review

Write the prepared comments from Phase ${this.phaseNumber - 1} to \`${reviewPath}\`.

Structure the file as follows:

\`\`\`
# Local Code Review — ${this.timestamp}
Base branch: \`${this.baseBranch}\`

## Findings

**path/to/file.ts:line**
🔴 [blocking] concise description

Why text.

Proposed fix.

...
\`\`\`

Group findings by file path. Include all prepared comments. If the file already exists, overwrite it.

If any step fails, report the error and stop.`;
    }
}
