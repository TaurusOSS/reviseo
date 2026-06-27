import type { Persona } from '../../core/persona-management';
import type { PromptOptions } from '../../core/review-generation';

export type ReviewMode = 'github' | 'local';

export type WebviewMessage =
    | { type: 'getPersonas' }
    | { type: 'savePersona'; persona: Persona }
    | { type: 'deletePersona'; id: string }
    | { type: 'generatePrompt'; prUrl: string; personaIds: string[]; promptOptions: PromptOptions; personaContext?: Record<string, Record<string, string>> }
    | { type: 'generateLocalPrompt'; baseBranch: string; personaIds: string[]; multiAgent: boolean; skipCleanup: boolean; personaContext?: Record<string, Record<string, string>> }
    | { type: 'buildGenerationPrompt'; name: string; description?: string }
    | { type: 'copyToClipboard'; text: string }
    | { type: 'getInitialState' }
    | { type: 'saveReviewSettings'; multiAgent: boolean; pendingReview: boolean; skipCommentedIssues: boolean; skipCleanup: boolean }
    | { type: 'saveLocalReviewSettings'; multiAgent: boolean; baseBranch: string; skipCleanup: boolean }
    | { type: 'saveActiveReviewTab'; tab: ReviewMode };

export type ExtensionMessage =
    | { type: 'personasLoaded'; personas: Persona[] }
    | { type: 'personasSaved'; personas: Persona[] }
    | { type: 'promptGenerated'; text: string }
    | { type: 'generationPromptBuilt'; prompt: string }
    | { type: 'error'; message: string }
    | { type: 'initialStateLoaded'; github: { multiAgent: boolean; pendingReview: boolean; skipCommentedIssues: boolean; skipCleanup: boolean }; local: { multiAgent: boolean; baseBranch: string; skipCleanup: boolean }; activeTab: ReviewMode };
