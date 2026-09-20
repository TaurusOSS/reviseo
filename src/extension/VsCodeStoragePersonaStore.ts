import * as vscode from 'vscode';
import type { Persona, PersonaSeedSnapshots, PersonaStore } from '../core/persona-management';
import { PersonaManagementFacade, reconcileSeedPersonas } from '../core/persona-management';

const seedPersonas = new PersonaManagementFacade().getSeedPersonas();

const STORAGE_KEY = 'reviseo.personas';
const SNAPSHOTS_STORAGE_KEY = 'reviseo.personaSeedSnapshots';

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
        const existing = this.context.globalState.get<Persona[]>(STORAGE_KEY, []);
        const snapshots = this.context.globalState.get<PersonaSeedSnapshots>(SNAPSHOTS_STORAGE_KEY, {});

        const result = reconcileSeedPersonas(existing, seedPersonas, snapshots);

        this.context.globalState.update(STORAGE_KEY, result.personas);
        this.context.globalState.update(SNAPSHOTS_STORAGE_KEY, result.snapshots);
    }
}
