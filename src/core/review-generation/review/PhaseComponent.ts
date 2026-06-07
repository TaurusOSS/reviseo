import type { PromptComponent } from './PromptComponent';
import { CommentFormatComponent } from './CommentFormatComponent';
import type { StepsComponent } from './StepsComponent';

export abstract class PhaseComponent implements PromptComponent {
    protected abstract readonly instructions: string;
    protected abstract readonly finalStep: string;

    constructor(private readonly stepsComponent: StepsComponent) {}

    getText(): string {
        return [
            this.instructions,
            new CommentFormatComponent().getText(),
            this.stepsComponent.getText(),
            this.finalStep,
        ].join('\n\n');
    }
}
