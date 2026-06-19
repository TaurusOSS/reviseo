import type { PromptComponent } from './PromptComponent';

export class LocalWriteReviewPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly timestamp: string,
        private readonly baseBranch: string,
        private readonly isMultiAgent: boolean,
    ) {}

    getText(): string {
        const reviewPath = `.ai/reviseo/${this.timestamp}/local_review.md`;
        const consolidation = this.isMultiAgent
            ? `Merge the JSON arrays returned by all reviewer subagents from Phase 2.\nMap each JSON element to the markdown format below and write the result to \`${reviewPath}\`.`
            : `Consolidate all collected review findings and write them to \`${reviewPath}\`.`;
        return `## Phase ${this.phaseNumber}: Write Review

${consolidation}

Structure the file as follows:

\`\`\`
# Local Code Review — ${this.timestamp}
Base branch: \`${this.baseBranch}\`

## Findings

### [Persona Name]
**path/to/file.ts:line** — Finding title
Finding body text.

...
\`\`\`

Include all findings from every persona. If the file already exists, overwrite it.

If any step fails, report the error and stop.`;
    }
}
