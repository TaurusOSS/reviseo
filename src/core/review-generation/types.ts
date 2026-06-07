export type PersonaContext = Record<string, Record<string, string>>;

export interface PromptOptions {
    multiAgent: boolean;
}

export enum Modes {
    SINGLE_AGENT = 'single',
    MULTI_AGENT = 'multi',
}
