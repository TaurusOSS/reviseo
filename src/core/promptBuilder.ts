import type { Persona } from './types';
import { Modes } from './types';
import { Prompt, SystemPromptComponent, PersonaStepComponent, StepsComponent, SingleAgentPhaseComponent, MultiAgentPhaseComponent } from './review';

export { Modes } from './types';
export { Prompt } from './review';

export class PromptBuilder {
    constructor(
        private readonly _url = '',
        private readonly _personas: readonly Persona[] = [],
        private readonly _mode = Modes.SINGLE_AGENT,
        private readonly _context: Record<string, Record<string, string>> = {},
    ) {}

    url(prUrl: string): PromptBuilder {
        return new PromptBuilder(prUrl, this._personas, this._mode, this._context);
    }

    personas(p: readonly Persona[]): PromptBuilder {
        return new PromptBuilder(this._url, p, this._mode, this._context);
    }

    context(map: Record<string, Record<string, string>>): PromptBuilder {
        return new PromptBuilder(this._url, this._personas, this._mode, map);
    }

    mode(m: Modes): Prompt {
        return new PromptBuilder(this._url, this._personas, m, this._context).build();
    }

    build(): Prompt {
        if (this._personas.length === 0) {
            return new Prompt([]);
        }

        const steps = this._personas.map((p, i) => new PersonaStepComponent(p, i + 1, this._context[p.id]));
        const stepsComponent = new StepsComponent(steps);
        const phase = this._mode === Modes.MULTI_AGENT
            ? new MultiAgentPhaseComponent(stepsComponent)
            : new SingleAgentPhaseComponent(stepsComponent);

        return new Prompt([new SystemPromptComponent(this._url), phase]);
    }
}

export const promptBuilder = new PromptBuilder();
