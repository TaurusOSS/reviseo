import type { Persona } from './types';

export type PersonaSeedSnapshots = Record<string, Persona>;

export interface ReconcileSeedPersonasResult {
    personas: Persona[];
    snapshots: PersonaSeedSnapshots;
}

function contentEquals(a: Persona, b: Persona): boolean {
    return a.name === b.name
        && a.customInstructions === b.customInstructions
        && JSON.stringify(a.checklist) === JSON.stringify(b.checklist)
        && JSON.stringify(a.additionalInputs) === JSON.stringify(b.additionalInputs);
}

function withFavorite(persona: Persona, favorite: boolean | undefined): Persona {
    return favorite === undefined ? { ...persona } : { ...persona, favorite };
}

function nextForkId(baseId: string, takenIds: Set<string>): { id: string; suffix: string } {
    let attempt = 1;
    let id = `${baseId}-user`;
    let suffix = '(User)';
    while (takenIds.has(id)) {
        attempt += 1;
        id = `${baseId}-user-${attempt}`;
        suffix = `(User ${attempt})`;
    }
    return { id, suffix };
}

export function reconcileSeedPersonas(
    stored: Persona[],
    seeds: readonly Persona[],
    snapshots: PersonaSeedSnapshots
): ReconcileSeedPersonasResult {
    const personas = [...stored];
    const newSnapshots: PersonaSeedSnapshots = { ...snapshots };
    const takenIds = new Set(personas.map(p => p.id));

    for (const seed of seeds) {
        const storedIndex = personas.findIndex(p => p.id === seed.id);

        if (storedIndex === -1) {
            personas.push({ ...seed });
            takenIds.add(seed.id);
            newSnapshots[seed.id] = { ...seed };
            continue;
        }

        const storedPersona = personas[storedIndex];
        const snapshot = newSnapshots[seed.id];

        if (!snapshot) {
            newSnapshots[seed.id] = { ...seed };
            continue;
        }

        if (contentEquals(snapshot, seed)) {
            continue;
        }

        if (contentEquals(snapshot, storedPersona)) {
            personas[storedIndex] = withFavorite({ ...seed }, storedPersona.favorite);
            newSnapshots[seed.id] = { ...seed };
            continue;
        }

        const { id: forkId, suffix } = nextForkId(seed.id, takenIds);
        const fork = withFavorite(
            { ...storedPersona, id: forkId, name: `${storedPersona.name} ${suffix}` },
            storedPersona.favorite
        );
        personas.push(fork);
        takenIds.add(forkId);

        personas[storedIndex] = withFavorite({ ...seed }, storedPersona.favorite);
        newSnapshots[seed.id] = { ...seed };
    }

    return { personas, snapshots: newSnapshots };
}
