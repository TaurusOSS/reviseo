import type { Persona, PromptOptions } from '../../core/types';

export type WebviewMessage =
    | { type: 'getPersonas' }
    | { type: 'savePersona'; persona: Persona }
    | { type: 'deletePersona'; id: string }
    | { type: 'generatePrompt'; prUrl: string; personaIds: string[]; promptOptions: PromptOptions; personaContext?: Record<string, Record<string, string>> }
    | { type: 'buildGenerationPrompt'; name: string; description?: string }
    | { type: 'copyToClipboard'; text: string };

export type ExtensionMessage =
    | { type: 'personasLoaded'; personas: Persona[] }
    | { type: 'personasSaved'; personas: Persona[] }
    | { type: 'promptGenerated'; text: string }
    | { type: 'generationPromptBuilt'; prompt: string }
    | { type: 'error'; message: string };
