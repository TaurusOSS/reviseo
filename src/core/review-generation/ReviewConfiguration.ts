import type { Persona } from '../persona-management';
import { PersonaReviewExecutionMode } from './types';
import type { PersonaContext } from './types';

export class ReviewConfiguration {
    private constructor(
        readonly url: string,
        readonly personas: readonly Persona[],
        readonly personaReviewExecutionMode: PersonaReviewExecutionMode,
        readonly context: PersonaContext,
        readonly pendingReview: boolean,
        readonly baseBranch: string,
        readonly timestamp: string,
    ) {}

    static builder(): ReviewConfigurationBuilder {
        return new ReviewConfigurationBuilder(
            (url, personas, personaReviewExecutionMode, context, pendingReview, baseBranch, timestamp) =>
                new ReviewConfiguration(url, personas, personaReviewExecutionMode, context, pendingReview, baseBranch, timestamp),
        );
    }
}

type ReviewConfigurationFactory = (
    url: string,
    personas: readonly Persona[],
    personaReviewExecutionMode: PersonaReviewExecutionMode,
    context: PersonaContext,
    pendingReview: boolean,
    baseBranch: string,
    timestamp: string,
) => ReviewConfiguration;

class ReviewConfigurationBuilder {
    private _url: string = '';
    private _personas: readonly Persona[] = [];
    private _personaReviewExecutionMode: PersonaReviewExecutionMode = PersonaReviewExecutionMode.SINGLE_AGENT;
    private _context: PersonaContext = {};
    private _pendingReview: boolean = false;
    private _baseBranch: string = '';
    private _timestamp: string = '';

    constructor(private readonly factory: ReviewConfigurationFactory) {}

    withUrl(url: string): this {
        this._url = url;
        return this;
    }

    withPersonas(personas: readonly Persona[]): this {
        this._personas = personas;
        return this;
    }

    withPersonaExecutionMode(mode: PersonaReviewExecutionMode): this {
        this._personaReviewExecutionMode = mode;
        return this;
    }

    withContext(context: PersonaContext): this {
        this._context = context;
        return this;
    }

    withPendingReview(pendingReview: boolean): this {
        this._pendingReview = pendingReview;
        return this;
    }

    withBaseBranch(baseBranch: string): this {
        this._baseBranch = baseBranch;
        return this;
    }

    withTimestamp(timestamp: string): this {
        this._timestamp = timestamp;
        return this;
    }

    build(): ReviewConfiguration {
        return this.factory(
            this._url,
            this._personas,
            this._personaReviewExecutionMode,
            this._context,
            this._pendingReview,
            this._baseBranch,
            this._timestamp,
        );
    }
}
