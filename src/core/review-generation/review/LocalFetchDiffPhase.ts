import type { PromptComponent } from './PromptComponent';
import type { LocalReviewDiffFilePath } from '../LocalReviewDiffFilePath';

export class LocalFetchDiffPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly baseBranch: string,
        private readonly diffFilePath: LocalReviewDiffFilePath,
    ) {}

    getText(): string {
        return `## Phase ${this.phaseNumber}: Fetch Diff

Execute the following shell commands to prepare the diff for review:
1. Create the output directory: \`mkdir -p ${this.diffFilePath.getDirectory()}\`
2. Fetch latest remote state: \`git fetch\`
3. Generate the diff: \`git diff --histogram -M -C ${this.baseBranch} > ${this.diffFilePath.getFullPath()}\`
   (Overwrites the file if it already exists.)
4. Confirm the file exists and is non-empty before proceeding.
   - If the diff file is empty, there are no local changes against the base branch.
     Write a short report stating this and stop — do not proceed to the review phase.

If any step fails, report the error and stop.`;
    }
}
