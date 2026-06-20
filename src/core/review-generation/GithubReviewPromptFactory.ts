import type { ReviewConfiguration } from './ReviewConfiguration';
import type { ReviewPromptFactory } from './ReviewPromptFactory';
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
import { PersonaReviewExecutionMode } from './types';
import { REVISEO_BASE_DIR } from './LocalReviewDiffFilePath';

export class GithubReviewPromptFactory implements ReviewPromptFactory {
    create(config: ReviewConfiguration): Prompt {
        if (config.kind !== 'github' || config.personas.length === 0) {
            return new Prompt([]);
        }

        const prNumber = config.url.match(/\/pull\/(\d+)/)?.[1] ?? '0';
        const diffFilePath = `${REVISEO_BASE_DIR}/${prNumber}/diff.patch`;
        const steps = config.personas.map((p, i) => new PersonaStepComponent(p, i + 1, config.context[p.id]));
        const stepsComponent = new StepsComponent(steps);

        const fetchPhaseFactory = (n: number): PromptComponent => new FetchReviewDataPhase(n, config.url);
        const reviewPhaseFactory = (n: number): PromptComponent => config.personaReviewExecutionMode === PersonaReviewExecutionMode.MULTI_AGENT
            ? new MultiAgentProvideMultipersonaReviewPhase(n, stepsComponent, diffFilePath)
            : new SingleAgentProvideMultipersonaReviewPhase(n, stepsComponent, diffFilePath);
        const validatePhaseFactory = (n: number): PromptComponent => new ValidateCommentsPhase(n);
        const submitPhaseFactory = (n: number): PromptComponent => new SubmitReviewPhase(n, prNumber, config.pendingReview);
        const cleanupPhaseFactory = (n: number): PromptComponent => new CleanupPhase(n, prNumber, config.pendingReview);

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
