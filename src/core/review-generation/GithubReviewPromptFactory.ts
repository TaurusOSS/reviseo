import type { ReviewConfiguration } from './ReviewConfiguration';
import type { ReviewPromptFactory } from './ReviewPromptFactory';
import type { PromptComponent } from './review';
import {
    Prompt,
    OrchestratorSystemPromptComponent,
    PersonaStepComponent,
    StepsComponent,
    FetchReviewDataPhase,
    SingleAgentFindIssuesPhase,
    MultiAgentFindIssuesPhase,
    PrepareCommentsPhase,
    SubmitReviewPhase,
    CleanupPhase,
} from './review';
import { PersonaReviewExecutionMode } from './types';
import { REVISEO_BASE_DIR } from './LocalReviewDiffFilePath';
import { extractPrNumber } from './PrUrlUtils';

export class GithubReviewPromptFactory implements ReviewPromptFactory {
    create(config: ReviewConfiguration): Prompt {
        if (config.kind !== 'github' || config.personas.length === 0) {
            return new Prompt([]);
        }

        const prNumber = extractPrNumber(config.url);
        if (!prNumber) {
            return new Prompt([]);
        }
        const reviewDataPath = `${REVISEO_BASE_DIR}/${prNumber}/review_data.json`;
        const diffFilePath = `${REVISEO_BASE_DIR}/${prNumber}/diff.patch`;
        const steps = config.personas.map((p, i) => new PersonaStepComponent(p, i + 1, config.context[p.id]));
        const stepsComponent = new StepsComponent(steps);

        const fetchPhaseFactory = (n: number): PromptComponent => new FetchReviewDataPhase(n, config.url, reviewDataPath, diffFilePath, config.skipCommentedIssues);
        const findIssuesPhaseFactory = (n: number): PromptComponent => config.personaReviewExecutionMode === PersonaReviewExecutionMode.MULTI_AGENT
            ? new MultiAgentFindIssuesPhase(n, stepsComponent, diffFilePath, reviewDataPath)
            : new SingleAgentFindIssuesPhase(n, stepsComponent, diffFilePath, reviewDataPath);
        const prepareCommentsPhaseFactory = (n: number): PromptComponent => new PrepareCommentsPhase(n, config.skipCommentedIssues ? reviewDataPath : undefined);
        const submitPhaseFactory = (n: number): PromptComponent => new SubmitReviewPhase(n, prNumber, config.pendingReview);
        const cleanupPhaseFactory = (n: number): PromptComponent => new CleanupPhase(n, reviewDataPath, diffFilePath, config.pendingReview);

        const phaseFactories: Array<(n: number) => PromptComponent> = [
            ...(config.skipPrDataFetchPhase ? [] : [fetchPhaseFactory]),
            findIssuesPhaseFactory,
            prepareCommentsPhaseFactory,
            submitPhaseFactory,
            ...(config.skipCleanup ? [] : [cleanupPhaseFactory]),
        ];

        return new Prompt([
            new OrchestratorSystemPromptComponent(),
            ...phaseFactories.map((factory, i) => factory(i + 1)),
        ]);
    }
}
