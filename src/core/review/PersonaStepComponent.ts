import type { Persona } from '../types';
import { StepComponent } from './StepComponent';

export class PersonaStepComponent extends StepComponent {
    constructor(
        private readonly _persona: Persona,
        private readonly _stepNumber: number,
        private readonly _inputValues?: Record<string, string>,
    ) {
        super();
    }

    getText(): string {
        const checklistLines = this._persona.checklist.length > 0
            ? this._persona.checklist.map(item => `- ${item}`).join('\n')
            : '- (no checklist items)';

        const contextLines = (this._persona.additionalInputs ?? [])
            .filter(input => !!this._inputValues?.[input.id])
            .map(input => `\n**${input.name}:** ${this._inputValues![input.id]}`)
            .join('');

        return `### Step ${this._stepNumber}: ${this._persona.name}
${this._persona.customInstructions}${contextLines}

Checklist:
${checklistLines}`;
    }
}
