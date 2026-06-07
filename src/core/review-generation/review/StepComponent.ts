import type { PromptComponent } from './PromptComponent';

export abstract class StepComponent implements PromptComponent {
    abstract getText(): string;
}
