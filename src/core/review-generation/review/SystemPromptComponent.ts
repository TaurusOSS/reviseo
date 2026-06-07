import type { PromptComponent } from './PromptComponent';

const ROLE =
`You are an experienced software engineer and code reviewer.
Your task is to perform a **pending code review** for the Pull Request provided below.
---`;

const ASSUMPTIONS =
`Assume:
- The code compiles and passes basic static analysis.
- Formatting, naming conventions, and trivial null checks are already handled by tools

Avoid:
- Style nitpicks
- Obvious or mechanical comments
- Repeating what linters or IDEs would flag`;

export class SystemPromptComponent implements PromptComponent {
    constructor(private readonly prUrl: string) {}

    getText(): string {
        return [
            ROLE,
            `## Pull Request\nURL: ${this.prUrl}`,
            ASSUMPTIONS,
        ].join('\n\n');
    }
}
