import type { StepsComponent } from './StepsComponent';
import { PhaseComponent } from './PhaseComponent';

export class MultiAgentPhaseComponent extends PhaseComponent {
    protected readonly instructions: string;
    protected readonly finalStep: string;

    constructor(stepsComponent: StepsComponent, prNumber: string) {
        super(stepsComponent);
        const reviewDataPath = `.ai/reviseo/${prNumber}/review_data.json`;
        this.instructions =
`## Review Process
You are running in multi-agent orchestration mode. Your role is to coordinate subagents — you do not perform code review yourself.

The review data file for this review is: \`${reviewDataPath}\`

1. Launch a data preparation subagent tasked only with:
   - Fetching PR details via \`pull_request_read\` with method "get" (to obtain title and description)
   - Fetching the diff via \`pull_request_read\` with method "get_diff"
   - Writing \`${reviewDataPath}\` as a JSON file with this exact structure:
     {
       "title": "<PR title>",
       "description": "<PR description>",
       "diff": "<full diff>"
     }
   If any step fails, report the error and stop.

2. Wait for the data preparation subagent to complete successfully before proceeding.
   If it reports an error or does not confirm a successful file write, stop and report the error.

3. For each persona step below, launch a reviewer subagent with:
   - The file path \`${reviewDataPath}\` — the reviewer subagent must read this file to obtain the PR context and diff.
   - That persona's instructions and checklist.
   - The JSON output format specified in the Final Step.

   If any reviewer subagent fails, report the error and stop.

4. Each reviewer subagent must return ONLY a JSON array. No prose, no markdown fences.
   Every element must conform to:
   {
     "persona": "<persona name>",
     "file": "<path/to/file.ext>",
     "line": <integer line number, or null for file-level comments>,
     "title": "<short comment title>",
     "body": "<comment text, excluding the AI-generated header — the orchestrator will prepend it in the Final Step>"
   }`;

        this.finalStep =
`Final Step: Aggregate and submit
After all reviewer subagents have returned:

1. Parse each subagent's JSON array.
2. Merge two comments if they reference the same file AND the same line AND their titles address the same root concern.
   When merging:
   - Combine the most insightful reasoning from each.
   - Set "persona" to a combined label, e.g. "Security Auditor + Performance Reviewer".
   - Use the most specific file/line reference.
   A comment is redundant only if its entire body is already covered by the merged comment.
   When in doubt, keep both comments rather than dropping one.
3. Create a pending review and submit all comments using available tools.
   Do not add a review body — leave it empty.
   Format each comment, see Comment format section

   If any operation fails, report the error and stop — do not submit a partial review.
4. Delete \`${reviewDataPath}\` once the review has been submitted successfully.`;
    }
}
