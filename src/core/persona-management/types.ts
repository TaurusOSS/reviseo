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
