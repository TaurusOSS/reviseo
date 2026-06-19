export type PersonaContext = Record<string, Record<string, string>>;

export interface PromptOptions {
    multiAgent: boolean;
    pendingReview: boolean;
}

export enum PersonaReviewExecutionMode {
    SINGLE_AGENT = 'single',
    MULTI_AGENT = 'multi',
}
