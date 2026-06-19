import type { ReviewConfiguration } from './ReviewConfiguration';
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

    build(config: ReviewConfiguration): string {
        const factory = config.kind === 'github' ? this._githubFactory : this._localFactory;
        return factory.create(config).getText();
    }
}
