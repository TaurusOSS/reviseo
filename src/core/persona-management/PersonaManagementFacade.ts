import { SEED_PERSONAS } from './seedPersonas';
import { buildGenerationPrompt } from './buildGenerationPrompt';
import type { Persona } from './types';

export class PersonaManagementFacade {
    getSeedPersonas(): readonly Persona[] {
        return SEED_PERSONAS;
    }

    buildGenerationPrompt(name: string, description?: string): string {
        return buildGenerationPrompt(name, description);
    }
}
