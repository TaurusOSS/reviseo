import type { StepsComponent } from './StepsComponent';
import { ProvideMultipersonaReviewPhase } from './ProvideMultipersonaReviewPhase';

export class MultiAgentProvideMultipersonaReviewPhase extends ProvideMultipersonaReviewPhase {
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
            ? `\n- The metadata file \`${this.reviewDataPath}\` — the reviewer subagent must read this to obtain the PR title and description for context`
            : '';
        return `## Phase ${this.phaseNumber}: Provide Multipersona Review

For each persona step below, launch a reviewer subagent with:
- The diff file \`${this.dataFilePath}\` — the reviewer subagent must read this to obtain the code changes${metadataLine}
- That persona's instructions and checklist
- The JSON output format specified below

If any reviewer subagent fails, report the error and stop.

Each reviewer subagent must return ONLY a JSON array. No prose, no markdown fences.
Every element must conform to:
{
  "persona": "<persona name>",
  "file": "<path/to/file.ext>",
  "line": <integer line number, or null for file-level comments>,
  "title": "<short comment title>",
  "body": "<comment text, excluding the AI-generated header — the orchestrator will prepend it in the validation phase>"
}`;
    }
}
