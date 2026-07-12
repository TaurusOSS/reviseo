import type { PromptComponent } from './PromptComponent';

export class LocalFetchDiffPhase implements PromptComponent {
    constructor(
        private readonly phaseNumber: number,
        private readonly diffSource: 'branch' | 'uncommitted',
        private readonly baseBranch: string | undefined,
        private readonly diffDirectory: string,
        private readonly diffFullPath: string,
    ) {}

    getText(): string {
        const isUncommitted = this.diffSource === 'uncommitted';
        const diffCommand = isUncommitted
            ? `git diff HEAD --histogram -M -C > ${this.diffFullPath}`
            : `git diff --histogram -M -C ${this.baseBranch} > ${this.diffFullPath}`;
        const fetchStep = isUncommitted
            ? '2. (No remote fetch needed for uncommitted changes.)'
            : '2. Fetch latest remote state: `git fetch`';
        const emptyDiffMessage = isUncommitted
            ? 'there are no uncommitted changes'
            : 'there are no local changes against the base branch';

        return `## Phase ${this.phaseNumber}: Fetch Diff

Execute the following shell commands to prepare the diff for review:
1. Create the output directory: \`mkdir -p ${this.diffDirectory}\`
${fetchStep}
3. Generate the diff: \`${diffCommand}\`
   (Overwrites the file if it already exists.)
4. Confirm the file exists and is non-empty before proceeding.
   - If the diff file is empty, ${emptyDiffMessage}.
     Write a short report stating this and stop — do not proceed to the review phase.

If any step fails, report the error and stop.`;
    }
}
