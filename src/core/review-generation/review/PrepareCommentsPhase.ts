import type { PromptComponent } from './PromptComponent';
import { CommentFormatComponent } from './CommentFormatComponent';

export class PrepareCommentsPhase implements PromptComponent {
    constructor(private readonly phaseNumber: number) {}

    getText(): string {
        const instructions =
`## Phase ${this.phaseNumber}: Prepare Comments

Transform the raw issues collected in Phase ${this.phaseNumber - 1} into formatted review comments:

1. Perform root cause analysis: group issues that share the same underlying root cause.
2. For each group (or standalone issue), write exactly one comment conforming to the format below.
   - Comments may reference each other (e.g., "See also the comment on \`foo.ts:42\`") but must never duplicate content.
3. Retain the final comment list for submission in the next phase.

If any operation fails, report the error and stop.`;

        return [
            instructions,
            new CommentFormatComponent().getText(),
        ].join('\n\n');
    }
}
