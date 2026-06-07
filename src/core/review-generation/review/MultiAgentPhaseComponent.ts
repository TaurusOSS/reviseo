import type { StepsComponent } from './StepsComponent';
import { PhaseComponent } from './PhaseComponent';

export class MultiAgentPhaseComponent extends PhaseComponent {
    protected readonly instructions =
`## Review Process
You are running in multi-agent orchestration mode. Your role is to coordinate subagents — you do not perform code review yourself.

1. Extract the PR number from the pull request URL in the system prompt.
   Derive the review data file path: \`.ai/reviseo/{reviewNumber}/review_data.md\`

2. Launch a data preparation subagent tasked only with:
   - Fetching PR details via \`pull_request_read\` with method "get" (to obtain title and description)
   - Fetching the diff via \`pull_request_read\` with method "get_diff"
   - Writing \`.ai/reviseo/{reviewNumber}/review_data.md\` with the following sections:
     # Title
     <PR title>
     # Description
     <PR description>
     # Diff
     <full diff>
   If any step fails, report the error and stop.

3. For each persona step below, launch a subagent with:
   - The file path \`.ai/reviseo/{reviewNumber}/review_data.md\` — the subagent must read this file to obtain the PR context and diff.
   - That persona's instructions and checklist.
   - The JSON output format specified in the Final Step.

   If any subagent call fails, report the error and stop.

4. Each subagent must return ONLY a JSON array. No prose, no markdown fences.
   Every element must conform to:
   {
     "persona": "<persona name>",
     "file": "<path/to/file.ext>",
     "line": <integer line number, or null for file-level comments>,
     "title": "<short comment title>",
     "body": "<comment text, excluding the AI-generated header — the orchestrator will prepend it in the Final Step>"
   }`;

    protected readonly finalStep =
`Final Step: Aggregate and submit
After all subagents have returned:

1. Parse each subagent's JSON array.
2. Merge two comments if they reference the same file AND the same line AND their titles address the same root concern.
   When merging:
   - Combine the most insightful reasoning from each.
   - Set "persona" to a combined label, e.g. "Security Auditor + Performance Reviewer".
   - Use the most specific file/line reference.
   A comment is redundant only if its entire body is already covered by the merged comment.
   When in doubt, keep both comments rather than dropping one.
3. Create a pending review and submit all comments using available tools.
   Format each comment, see Comment format section

   If any operation fails, report the error and stop — do not submit a partial review.`;

    constructor(stepsComponent: StepsComponent) {
        super(stepsComponent);
    }
}
