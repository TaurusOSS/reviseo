import type { Persona } from '../persona-management';
import { PersonaReviewExecutionMode } from './types';
import type { PersonaContext } from './types';
import { ReviewConfiguration } from './ReviewConfiguration';
import type { ReviewPromptFactory } from './ReviewPromptFactory';
import { GithubReviewPromptFactory } from './GithubReviewPromptFactory';
import { LocalReviewPromptFactory } from './LocalReviewPromptFactory';

export class ReviewGenerationFacade {
    private readonly _githubFactory: ReviewPromptFactory;
    private readonly _localFactory: ReviewPromptFactory;

    constructor(
        githubFactory: ReviewPromptFactory = new GithubReviewPromptFactory(),
        localFactory: ReviewPromptFactory = new LocalReviewPromptFactory(),
    ) {
        this._githubFactory = githubFactory;
        this._localFactory = localFactory;
    }

    buildPrompt(
        prUrl: string,
        personas: readonly Persona[],
        personaExecutionMode: PersonaReviewExecutionMode,
        context: PersonaContext = {},
        isPendingReview = false,
    ): string {
        const config = ReviewConfiguration.builder()
            .withUrl(prUrl)
            .withPersonas(personas)
            .withPersonaExecutionMode(personaExecutionMode)
            .withContext(context)
            .withPendingReview(isPendingReview)
            .build();

        return this._githubFactory.create(config).getText();
    }

    buildLocalPrompt(
        baseBranch: string,
        timestamp: string,
        personas: readonly Persona[],
        personaExecutionMode: PersonaReviewExecutionMode,
        context: PersonaContext = {},
    ): string {
        const config = ReviewConfiguration.builder()
            .withPersonas(personas)
            .withPersonaExecutionMode(personaExecutionMode)
            .withContext(context)
            .withBaseBranch(baseBranch)
            .withTimestamp(timestamp)
            .build();

        return this._localFactory.create(config).getText();
    }
}
