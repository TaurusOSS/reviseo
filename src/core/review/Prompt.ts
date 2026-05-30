import type { PromptComponent } from './PromptComponent';

export class Prompt {
    constructor(private readonly components: readonly PromptComponent[]) {}

    getText(): string {
        return this.components.map(c => c.getText()).join('\n\n');
    }
}
