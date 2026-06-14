import type { PromptComponent } from './PromptComponent';
import { CommentFormatComponent } from './CommentFormatComponent';
import type { StepsComponent } from './StepsComponent';

const REVIEW_ASSUMPTIONS =
`Assume:
- The code compiles and passes basic static analysis.
- Formatting, naming conventions, and trivial null checks are already handled by tools

Avoid:
- Style nitpicks
- Obvious or mechanical comments
- Repeating what linters or IDEs would flag`;

export abstract class ProvideMultipersonaReviewPhase implements PromptComponent {
    constructor(
        protected readonly phaseNumber: number,
        protected readonly stepsComponent: StepsComponent,
        protected readonly dataFilePath: string,
    ) {}

    getText(): string {
        return [
            this.buildInstructions(),
            REVIEW_ASSUMPTIONS,
            new CommentFormatComponent().getText(),
            this.stepsComponent.getText(),
        ].join('\n\n');
    }

    protected abstract buildInstructions(): string;
}
