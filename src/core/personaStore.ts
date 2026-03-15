import type { Persona } from './types';

export interface PersonaStore {
    getAll(): Promise<Persona[]> | Persona[];
    save(persona: Persona): Promise<void> | void;
    delete(id: string): Promise<void> | void;
}
