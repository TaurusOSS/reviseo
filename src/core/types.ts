export interface Persona {
    id: string;
    name: string;
    customInstructions: string;
    checklist: string[];
}

export interface PromptOptions {
    multiAgent: boolean;
}
