import type { PromptComponent } from './PromptComponent';
import { CommentFormatComponent } from './CommentFormatComponent';

export class PrepareCommentsPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly reviewDataPath?: string,
    ) {}

    getText(): string {
        const filteringBlock = this.reviewDataPath
            ? `Before preparing comments:
1. Read \`${this.reviewDataPath}\` and extract the "existingComments" array.
2. For each raw issue from Phase ${this.phaseNumber - 1}, determine whether an existing comment already covers the same root cause:
   - If yes → silently drop the issue. Do not create a new comment.
   - If an existing comment is related but your issue adds genuinely new value (a second affected file, a concrete fix not mentioned, a specific edge case) → post a reply now using \`add_reply_to_pull_request_comment\` with that comment's id. Do not include this issue in the standard new-comment list.
   - If no existing comment covers it → include it in the standard new-comment list as usual.
3. Continue below with root-cause grouping and formatting for the remaining (new) issues only.

`
            : '';

        const instructions =
`## Phase ${this.phaseNumber}: Prepare Comments

${filteringBlock}Transform the raw issues collected in Phase ${this.phaseNumber - 1} into formatted review comments:

1. Perform root cause analysis: group issues that share the same underlying root cause.
2. For each group (or standalone issue), write exactly one comment conforming to the format below.
   - Comments may reference each other (e.g., "See also the comment about X") but must never duplicate content.
3. Retain the final comment list for submission in the next phase.

If any operation fails, report the error and stop.`;

        return [
            instructions,
            new CommentFormatComponent().getText(),
        ].join('\n\n');
    }
}
