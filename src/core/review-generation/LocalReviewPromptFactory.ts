import type { ReviewConfiguration } from './ReviewConfiguration';
import type { ReviewPromptFactory } from './ReviewPromptFactory';
import {
    Prompt,
    OrchestratorSystemPromptComponent,
    PersonaStepComponent,
    StepsComponent,
    SingleAgentFindIssuesPhase,
    MultiAgentFindIssuesPhase,
    PrepareCommentsPhase,
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
                ? new MultiAgentFindIssuesPhase(n, stepsComponent, fullPath)
                : new SingleAgentFindIssuesPhase(n, stepsComponent, fullPath),
            (n) => new PrepareCommentsPhase(n),
            (n) => new LocalWriteReviewPhase(n, config.timestamp, config.baseBranch),
            ...(config.skipCleanup ? [] : [(n: number) => new LocalCleanupPhase(n, fullPath)]),
        ];

        return new Prompt([
            new OrchestratorSystemPromptComponent(),
            ...phaseFactories.map((factory, i) => factory(i + 1)),
        ]);
    }
}
