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

interface BuilderState {
    url: string;
    personas: readonly Persona[];
    mode: Modes;
    context: Record<string, Record<string, string>>;
    pendingReview: boolean;
}

export class PromptBuilder {
    private constructor(private readonly _state: BuilderState) {}

    static create(): PromptBuilder {
        return new PromptBuilder({
            url: '',
            personas: [],
            mode: Modes.SINGLE_AGENT,
            context: {},
            pendingReview: false,
        });
    }

    url(prUrl: string): PromptBuilder {
        return new PromptBuilder({ ...this._state, url: prUrl });
    }

    personas(p: readonly Persona[]): PromptBuilder {
        return new PromptBuilder({ ...this._state, personas: p });
    }

    context(map: Record<string, Record<string, string>>): PromptBuilder {
        return new PromptBuilder({ ...this._state, context: map });
    }

    pendingReview(value: boolean): PromptBuilder {
        return new PromptBuilder({ ...this._state, pendingReview: value });
    }

    mode(m: Modes): Prompt {
        return new PromptBuilder({ ...this._state, mode: m }).build();
    }

    build(): Prompt {
        if (this._state.personas.length === 0) {
            return new Prompt([]);
        }

        const prNumber = this._state.url.match(/\/pull\/(\d+)/)?.[1] ?? '0';
        const steps = this._state.personas.map((p, i) => new PersonaStepComponent(p, i + 1, this._state.context[p.id]));
        const stepsComponent = new StepsComponent(steps);

        const fetchPhaseFactory = (n: number): PromptComponent => new FetchReviewDataPhase(n, this._state.url);
        const reviewPhaseFactory = (n: number): PromptComponent => this._state.mode === Modes.MULTI_AGENT
            ? new MultiAgentProvideMultipersonaReviewPhase(n, stepsComponent, prNumber)
            : new SingleAgentProvideMultipersonaReviewPhase(n, stepsComponent, prNumber);
        const validatePhaseFactory = (n: number): PromptComponent => new ValidateCommentsPhase(n);
        const submitPhaseFactory = (n: number): PromptComponent => new SubmitReviewPhase(n, prNumber, this._state.pendingReview);
        const cleanupPhaseFactory = (n: number): PromptComponent => new CleanupPhase(n, prNumber, this._state.pendingReview);

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
