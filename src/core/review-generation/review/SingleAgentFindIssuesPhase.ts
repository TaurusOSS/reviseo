import type { StepsComponent } from './StepsComponent';
import { FindIssuesPhase } from './FindIssuesPhase';

export class SingleAgentFindIssuesPhase extends FindIssuesPhase {
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
        return `## Phase ${this.phaseNumber}: Find Issues

Read \`${this.dataFilePath}\` to obtain the diff.${metadataLine}
For each Step below, adopt that persona and identify issues according to its checklist.
Do NOT write formatted comments — comment preparation happens in a later phase.
Retain issues as an in-memory list; each item: persona name, file path, line number (an integer from the diff — prefer a specific line even for broad issues; use null only when no single changed line is representative of the problem), description — the description must capture the issue and its impact in enough detail that PrepareComments can write a full comment without re-reading the diff.

If any operation fails, report the error and stop.`;
    }
}
