import type { Persona } from '../persona-management';
import { Modes } from './types';
import type { PromptComponent } from './review';
import {
    Prompt,
    OrchestratorSystemPromptComponent,
    PersonaStepComponent,
    StepsComponent,
    FetchReviewDataPhase,
    SingleAgentProvideMultipersonaReviewPhase,
    MultiAgentProvideMultipersonaReviewPhase,
    ValidateCommentsPhase,
    SubmitReviewPhase,
    CleanupPhase,
} from './review';

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

        const prNumber = this._url.match(/\/pull\/(\d+)/)?.[1] ?? '0';
        const steps = this._personas.map((p, i) => new PersonaStepComponent(p, i + 1, this._context[p.id]));
        const stepsComponent = new StepsComponent(steps);

        const fetchPhaseFactory = (n: number): PromptComponent => new FetchReviewDataPhase(n, this._url);
        const reviewPhaseFactory = (n: number): PromptComponent => this._mode === Modes.MULTI_AGENT
            ? new MultiAgentProvideMultipersonaReviewPhase(n, stepsComponent, prNumber)
            : new SingleAgentProvideMultipersonaReviewPhase(n, stepsComponent, prNumber);
        const validatePhaseFactory = (n: number): PromptComponent => new ValidateCommentsPhase(n);
        const submitPhaseFactory = (n: number): PromptComponent => new SubmitReviewPhase(n, prNumber);
        const cleanupPhaseFactory = (n: number): PromptComponent => new CleanupPhase(n, prNumber);

        const phaseFactories: Array<(n: number) => PromptComponent> = [
            fetchPhaseFactory,
            reviewPhaseFactory,
            validatePhaseFactory,
            submitPhaseFactory,
            cleanupPhaseFactory,
        ];

        return new Prompt([
            new OrchestratorSystemPromptComponent(),
            ...phaseFactories.map((factory, i) => factory(i + 1)),
        ]);
    }
}
