export interface Persona {
    id: string;
    name: string;
    customInstructions: string;
    checklist: string[];
}

export type WebviewMessage =
    | { type: 'getPersonas' }
    | { type: 'savePersona'; persona: Persona }
    | { type: 'deletePersona'; id: string }
    | { type: 'generatePrompt'; prUrl: string; personaIds: string[] }
    | { type: 'buildGenerationPrompt'; name: string; description?: string }
    | { type: 'copyToClipboard'; text: string };

export type ExtensionMessage =
    | { type: 'personasLoaded'; personas: Persona[] }
    | { type: 'personasSaved'; personas: Persona[] }
    | { type: 'promptGenerated'; text: string }
    | { type: 'generationPromptBuilt'; prompt: string }
    | { type: 'error'; message: string };
