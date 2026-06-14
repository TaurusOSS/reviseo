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
    ) {}

    static builder(): ReviewConfigurationBuilder {
        return new ReviewConfigurationBuilder(
            (url, personas, personaReviewExecutionMode, context, pendingReview) =>
                new ReviewConfiguration(url, personas, personaReviewExecutionMode, context, pendingReview),
        );
    }
}

type ReviewConfigurationFactory = (
    url: string,
    personas: readonly Persona[],
    personaReviewExecutionMode: PersonaReviewExecutionMode,
    context: PersonaContext,
    pendingReview: boolean,
) => ReviewConfiguration;

class ReviewConfigurationBuilder {
    private _url: string = '';
    private _personas: readonly Persona[] = [];
    private _personaReviewExecutionMode: PersonaReviewExecutionMode = PersonaReviewExecutionMode.SINGLE_AGENT;
    private _context: PersonaContext = {};
    private _pendingReview: boolean = false;

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

    build(): ReviewConfiguration {
        return this.factory(
            this._url,
            this._personas,
            this._personaReviewExecutionMode,
            this._context,
            this._pendingReview,
        );
    }
}
