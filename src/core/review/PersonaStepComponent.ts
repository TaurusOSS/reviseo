import type { Persona } from '../types';
import { StepComponent } from './StepComponent';

export class PersonaStepComponent extends StepComponent {
    constructor(private readonly persona: Persona, private readonly stepNumber: number) {
        super();
    }

    getText(): string {
        const checklistLines = this.persona.checklist.length > 0
            ? this.persona.checklist.map(item => `- ${item}`).join('\n')
            : '- (no checklist items)';

        return `### Step ${this.stepNumber}: ${this.persona.name}
${this.persona.customInstructions}

Checklist:
${checklistLines}`;
    }
}
