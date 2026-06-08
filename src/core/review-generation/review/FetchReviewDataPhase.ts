import type { PromptComponent } from './PromptComponent';

export class FetchReviewDataPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly prNumber: string,
    ) {}

    getText(): string {
        const reviewDataPath = `.ai/reviseo/${this.prNumber}/review_data.json`;
        return `## Phase ${this.phaseNumber}: Fetch Review Data

The review data file for this review is: \`${reviewDataPath}\`

Fetch the PR details and write them to the review data file:
1. Fetch PR details via \`pull_request_read\` with method "get" (to obtain title and description)
2. Fetch the diff via \`pull_request_read\` with method "get_diff"
3. Write \`${reviewDataPath}\` as a JSON file with this exact structure:
   {
     "title": "<PR title>",
     "description": "<PR description>",
     "diff": "<full diff>"
   }

If any step fails, report the error and stop.`;
    }
}
