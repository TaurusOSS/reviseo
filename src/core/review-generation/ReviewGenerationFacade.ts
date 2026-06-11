import type { Persona } from '../persona-management';
import { Modes, PersonaContext } from './types';
import { PromptBuilder } from './PromptBuilder';

export class ReviewGenerationFacade {
    buildPrompt(
        prUrl: string,
        personas: readonly Persona[],
        mode: Modes,
        context: PersonaContext = {},
        isPendingReview = false,
    ): string {
        return new PromptBuilder()
            .url(prUrl)
            .personas(personas)
            .context(context)
            .pendingReview(isPendingReview)
            .mode(mode)
            .getText();
    }
}
