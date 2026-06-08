import type { PromptComponent } from './PromptComponent';

export class FetchReviewDataPhase implements PromptComponent {
    private readonly prNumber: string;

    constructor(
        private readonly phaseNumber: number,
        private readonly prUrl: string,
    ) {
        this.prNumber = prUrl.match(/\/pull\/(\d+)/)?.[1] ?? '0';
    }

    getText(): string {
        const reviewDataPath = `.ai/reviseo/${this.prNumber}/review_data.json`;
        return `## Phase ${this.phaseNumber}: Fetch Review Data

The PR URL for this review is: \`${this.prUrl}\`
The review data file for this review is: \`${reviewDataPath}\`

Fetch the PR details and write them to the review data file:
1. Fetch PR details via \`pull_request_read\` with method "get" for PR \`${this.prUrl}\` (to obtain title and description)
2. Fetch the diff via \`pull_request_read\` with method "get_diff"
3. Write \`${reviewDataPath}\` as a JSON file with this exact structure:
   {
     "title": "<PR title>",
     "description": "<PR description>",
     "diff": "<full diff>"
   }
4. Confirm the file has been written successfully before reporting this phase complete.

If any step fails, report the error and stop.`;
    }
}
