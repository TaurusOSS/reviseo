import type { PromptComponent } from './PromptComponent';
import type { StepComponent } from './StepComponent';

export class StepsComponent implements PromptComponent {
    constructor(private readonly steps: readonly StepComponent[]) {}

    getText(): string {
        return this.steps.map(s => s.getText()).join('\n\n');
    }
}
