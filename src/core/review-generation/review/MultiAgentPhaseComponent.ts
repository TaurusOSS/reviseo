import type { StepsComponent } from './StepsComponent';
import { PhaseComponent } from './PhaseComponent';

export class MultiAgentPhaseComponent extends PhaseComponent {
    protected readonly instructions =
`## Review Process
You are running in multi-agent orchestration mode. Your role is to coordinate subagents — you do not perform code review yourself.

1. Fetch the pull request diff using available tools.
   Store the diff — it will be passed to all subagents.

2. For each persona step below, launch a subagent with:
   - The full PR diff.
   - That persona's instructions and checklist.
   - The JSON output format specified in the Final Step.

   If any subagent call fails, report the error and stop.

3. Each subagent must return ONLY a JSON array. No prose, no markdown fences.
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
