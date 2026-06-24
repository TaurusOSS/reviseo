import type { PromptComponent } from './PromptComponent';

export class FetchReviewDataPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly prUrl: string,
        private readonly reviewDataPath: string,
        private readonly diffFilePath: string,
        private readonly skipCommentedIssues = false,
    ) {}

    getText(): string {
        const existingCommentsSteps = this.skipCommentedIssues
            ? `4. Fetch existing unresolved inline review comments via \`pull_request_read\` with method "list_review_comments" for PR \`${this.prUrl}\`. For each comment retain only: id, path, line, body. Filter to unresolved comments only. Re-write \`${this.reviewDataPath}\` adding an "existingComments" array field to the existing JSON (preserve "title" and "description"). If there are no unresolved comments, write "existingComments": [].
5. Verify \`${this.reviewDataPath}\` is valid JSON with "title", "description", and "existingComments" fields present.`
            : `4. Verify both files exist and are non-empty:
   - Read \`${this.diffFilePath}\` and confirm it contains the raw diff
   - Read \`${this.reviewDataPath}\` and confirm it is valid JSON with non-empty "title" and "description" fields
   Only then report this phase complete.`;

        return `## Phase ${this.phaseNumber}: Fetch Review Data

The PR URL for this review is: \`${this.prUrl}\`

Fetch the PR details and write them to the review data files:
1. Fetch PR details via \`pull_request_read\` with method "get" for PR \`${this.prUrl}\` (to obtain title and description)
2. Fetch the diff via \`pull_request_read\` with method "get_diff" and write it to \`${this.diffFilePath}\`
3. Write \`${this.reviewDataPath}\` as a JSON file with this exact structure:
   {
     "title": "<PR title>",
     "description": "<PR description>"
   }
${existingCommentsSteps}

If any step fails, report the error and stop.`;
    }
}
