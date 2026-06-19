import type { Persona } from '../../core/persona-management';
import type { PromptOptions } from '../../core/review-generation';

export type WebviewMessage =
    | { type: 'getPersonas' }
    | { type: 'savePersona'; persona: Persona }
    | { type: 'deletePersona'; id: string }
    | { type: 'generatePrompt'; prUrl: string; personaIds: string[]; promptOptions: PromptOptions; personaContext?: Record<string, Record<string, string>> }
    | { type: 'generateLocalPrompt'; baseBranch: string; personaIds: string[]; multiAgent: boolean; personaContext?: Record<string, Record<string, string>> }
    | { type: 'buildGenerationPrompt'; name: string; description?: string }
    | { type: 'copyToClipboard'; text: string }
    | { type: 'getReviewSettings' }
    | { type: 'saveReviewSettings'; multiAgent: boolean; pendingReview: boolean }
    | { type: 'getLocalReviewSettings' }
    | { type: 'saveLocalReviewSettings'; multiAgent: boolean; baseBranch: string };

export type ExtensionMessage =
    | { type: 'personasLoaded'; personas: Persona[] }
    | { type: 'personasSaved'; personas: Persona[] }
    | { type: 'promptGenerated'; text: string }
    | { type: 'generationPromptBuilt'; prompt: string }
    | { type: 'error'; message: string }
    | { type: 'reviewSettingsLoaded'; multiAgent: boolean; pendingReview: boolean }
    | { type: 'localReviewSettingsLoaded'; multiAgent: boolean; baseBranch: string };
