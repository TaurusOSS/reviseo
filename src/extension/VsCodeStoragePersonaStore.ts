import * as vscode from 'vscode';
import type { Persona } from '../core/types';
import type { PersonaStore } from '../core/personaStore';
import { SEED_PERSONAS } from '../core/seedPersonas';

const STORAGE_KEY = 'reviseo.personas';

export class VsCodeStoragePersonaStore implements PersonaStore {
    constructor(private readonly context: vscode.ExtensionContext) {}

    getAll(): Persona[] {
        return this.context.globalState.get<Persona[]>(STORAGE_KEY, [])
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    save(persona: Persona): void {
        const all = this.getAll();
        const idx = all.findIndex(p => p.id === persona.id);
        if (idx >= 0) {
            all[idx] = persona;
        } else {
            all.push(persona);
        }
        this.context.globalState.update(STORAGE_KEY, all);
    }

    delete(id: string): void {
        this.context.globalState.update(STORAGE_KEY, this.getAll().filter(p => p.id !== id));
    }

    seed(): void {
        const existing = this.getAll();
        const isLegacyFormat = existing.length > 0 && !Array.isArray(existing[0].checklist);
        if (existing.length === 0 || isLegacyFormat) {
            this.context.globalState.update(STORAGE_KEY, SEED_PERSONAS);
            return;
        }
        const newSeeds = SEED_PERSONAS.filter(s => !existing.some(e => e.id === s.id));
        console.log(`Seeding ${newSeeds.length} new personas...`);
        this.context.globalState.update(STORAGE_KEY, [...newSeeds, ...existing]);
    }
}
