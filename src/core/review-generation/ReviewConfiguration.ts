import type { Persona } from '../persona-management';
import type { PersonaReviewExecutionMode, PersonaContext } from './types';

type ReviewConfigurationBase = {
    readonly personas: readonly Persona[];
    readonly personaReviewExecutionMode: PersonaReviewExecutionMode;
    readonly context: PersonaContext;
    readonly skipCleanup: boolean;
};

export type GithubReviewConfiguration = ReviewConfigurationBase & {
    readonly kind: 'github';
    readonly url: string;
    readonly pendingReview: boolean;
    readonly skipCommentedIssues: boolean;
    readonly skipPrDataFetchPhase?: boolean;
};

export type LocalReviewConfiguration = ReviewConfigurationBase & {
    readonly kind: 'local';
    readonly diffSource: 'branch' | 'uncommitted';
    readonly baseBranch?: string;
    readonly timestamp: string;
};

export type ReviewConfiguration = GithubReviewConfiguration | LocalReviewConfiguration;
