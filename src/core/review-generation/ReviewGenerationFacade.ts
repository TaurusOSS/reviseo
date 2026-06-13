import type { Persona } from '../persona-management';
import { Modes } from './types';
import type { PersonaContext } from './types';
import { ReviewConfiguration } from './ReviewConfiguration';
import type { ReviewPromptFactory } from './ReviewPromptFactory';
import { GithubReviewPromptFactory } from './GithubReviewPromptFactory';

export class ReviewGenerationFacade {
    private readonly _factory: ReviewPromptFactory;

    constructor(factory: ReviewPromptFactory = new GithubReviewPromptFactory()) {
        this._factory = factory;
    }

    buildPrompt(
        prUrl: string,
        personas: readonly Persona[],
        mode: Modes,
        context: PersonaContext = {},
        isPendingReview = false,
    ): string {
        const config = ReviewConfiguration.builder()
            .withUrl(prUrl)
            .withPersonas(personas)
            .withMode(mode)
            .withContext(context)
            .withPendingReview(isPendingReview)
            .build();

        return this._factory.create(config).getText();
    }
}
