import type { PromptComponent } from './PromptComponent';

const COMMENT_FORMAT =
`### Comment format

Every comment **must** follow this structure exactly. Deviating from it is not permitted.

Severity levels:
- 🔴 [blocking] — must fix before merge
- 🟡 [suggestion] — strongly recommended
- 🔵 [nit] — minor improvement
- ❓ [question] — needs clarification

Structure of each comment:
1. Title line: \`🔴 [blocking] concise description of the problem — max 12 words\`
2. Why (1–3 sentences): explain the problem and its impact. No section header — follows naturally after the title.
3. What to do / What to ask:
   - For ❓ comments: one precise question instead of a code fix.
   - For all other severities: exactly one recommendation with a code snippet — never copy code from the PR, only the solution.
   If a genuine alternative exists: one line starting with \`Alternative:\`.

Total length: max 120 words. If more context is needed, use a collapsible block:
<details>
<summary>Full reasoning</summary>
...
</details>`;

export class CommentFormatComponent implements PromptComponent {
    getText(): string {
        return COMMENT_FORMAT;
    }
}
