import type { PromptComponent } from './PromptComponent';

const COMMENT_FORMAT =
`### Comment format

Severity levels:
- 🔴 [blocking] — must fix before merge
- 🟡 [suggestion] — strongly recommended
- 🔵 [nit] — minor improvement
- ❓ [question] — needs clarification

Structure of each comment:
1. Title line: \`🔴 [blocking] concise description of the problem — max 12 words\`
2. Why (1–3 sentences): explain the problem and its impact. No section header — follows naturally after the title.
3. What to do: exactly one recommendation. Show the proposed fix in code — never copy code from the PR, only the solution.
   If a genuine alternative exists: one line starting with \`Alternative:\`.

Total length: max 120 words. If more context is needed, use a collapsible block:
<details>
<summary>Full reasoning</summary>
...
</details>

Deduplication: if two issues share the same root cause, write one comment. Comments may reference each other (e.g., "See also the comment on \`foo.ts:42\`") but must never duplicate content.`;

export class CommentFormatComponent implements PromptComponent {
    getText(): string {
        return COMMENT_FORMAT;
    }
}
