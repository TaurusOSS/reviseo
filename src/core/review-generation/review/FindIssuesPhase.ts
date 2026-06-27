import type { PromptComponent } from './PromptComponent';
import type { StepsComponent } from './StepsComponent';

export const LINE_NUMBER_GUIDANCE = `new-file line number (right-hand number in the @@ header, 1-indexed) — prefer a specific line even for broad issues; use null only when no single changed line is representative of the problem`;

const REVIEW_ASSUMPTIONS =
`Assume:
- The code compiles and passes basic static analysis.
- Formatting, naming conventions, and trivial null checks are already handled by tools

Avoid:
- Style nitpicks
- Obvious or mechanical comments
- Repeating what linters or IDEs would flag`;

export abstract class FindIssuesPhase implements PromptComponent {
    constructor(
        protected readonly phaseNumber: number,
        protected readonly stepsComponent: StepsComponent,
        protected readonly dataFilePath: string,
    ) {}

    getText(): string {
        return [
            this.buildInstructions(),
            REVIEW_ASSUMPTIONS,
            this.stepsComponent.getText(),
        ].join('\n\n');
    }

    protected abstract buildInstructions(): string;
}
