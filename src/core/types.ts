export interface AdditionalInput {
    id: string;
    name: string;
}

export interface Persona {
    id: string;
    name: string;
    customInstructions: string;
    checklist: string[];
    additionalInputs?: AdditionalInput[];
}

export interface PromptOptions {
    multiAgent: boolean;
}

export enum Modes {
    SINGLE_AGENT = 'single',
    MULTI_AGENT = 'multi',
}
