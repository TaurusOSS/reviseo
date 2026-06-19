import type { ReviewConfiguration } from './ReviewConfiguration';
import type { ReviewPromptFactory } from './ReviewPromptFactory';
import {
    Prompt,
    OrchestratorSystemPromptComponent,
    PersonaStepComponent,
    StepsComponent,
    SingleAgentProvideMultipersonaReviewPhase,
    MultiAgentProvideMultipersonaReviewPhase,
    LocalFetchDiffPhase,
    LocalWriteReviewPhase,
    LocalCleanupPhase,
} from './review';
import type { PromptComponent } from './review';
import { PersonaReviewExecutionMode } from './types';
import { localReviewPaths } from './LocalReviewDiffFilePath';

export class LocalReviewPromptFactory implements ReviewPromptFactory {
    create(config: ReviewConfiguration): Prompt {
        if (config.kind !== 'local' || config.personas.length === 0) {
            return new Prompt([]);
        }

        const { fullPath, directory } = localReviewPaths(config.timestamp);
        const steps = config.personas.map((p, i) => new PersonaStepComponent(p, i + 1, config.context[p.id]));
        const stepsComponent = new StepsComponent(steps);

        const phaseFactories: Array<(n: number) => PromptComponent> = [
            (n) => new LocalFetchDiffPhase(n, config.baseBranch, directory, fullPath),
            (n) => config.personaReviewExecutionMode === PersonaReviewExecutionMode.MULTI_AGENT
                ? new MultiAgentProvideMultipersonaReviewPhase(n, stepsComponent, fullPath)
                : new SingleAgentProvideMultipersonaReviewPhase(n, stepsComponent, fullPath),
            (n) => new LocalWriteReviewPhase(n, config.timestamp, config.baseBranch, config.personaReviewExecutionMode === PersonaReviewExecutionMode.MULTI_AGENT),
            (n) => new LocalCleanupPhase(n, fullPath),
        ];

        return new Prompt([
            new OrchestratorSystemPromptComponent(),
            ...phaseFactories.map((factory, i) => factory(i + 1)),
        ]);
    }
}
