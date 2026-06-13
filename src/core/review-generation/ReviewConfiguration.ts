import type { Persona } from '../persona-management';
import { Modes } from './types';
import type { PersonaContext } from './types';

export class ReviewConfiguration {
    private constructor(
        readonly url: string,
        readonly personas: readonly Persona[],
        readonly mode: Modes,
        readonly context: PersonaContext,
        readonly pendingReview: boolean,
    ) {}

    static builder(): ReviewConfigurationBuilder {
        return new ReviewConfigurationBuilder(
            (url, personas, mode, context, pendingReview) =>
                new ReviewConfiguration(url, personas, mode, context, pendingReview),
        );
    }
}

type ReviewConfigurationFactory = (
    url: string,
    personas: readonly Persona[],
    mode: Modes,
    context: PersonaContext,
    pendingReview: boolean,
) => ReviewConfiguration;

class ReviewConfigurationBuilder {
    private _url: string = '';
    private _personas: readonly Persona[] = [];
    private _mode: Modes = Modes.SINGLE_AGENT;
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

    withMode(mode: Modes): this {
        this._mode = mode;
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
            this._mode,
            this._context,
            this._pendingReview,
        );
    }
}
