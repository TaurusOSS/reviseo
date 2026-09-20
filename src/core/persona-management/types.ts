export interface AdditionalInput {
    id: string;
    name: string;
}

export type PersonaTag = 'beta';

export interface Persona {
    id: string;
    name: string;
    customInstructions: string;
    checklist: string[];
    additionalInputs?: AdditionalInput[];
    favorite?: boolean;
    tags?: PersonaTag[];
}
