import * as assert from 'assert';
import { reconcileSeedPersonas } from '../../../core/persona-management';
import type { Persona, PersonaSeedSnapshots } from '../../../core/persona-management';

function persona(overrides: Partial<Persona> = {}): Persona {
    return {
        id: 'prompt-engineer',
        name: 'Prompt Engineer',
        customInstructions: 'Original instructions.',
        checklist: ['Is the goal clear?'],
        ...overrides,
    };
}

suite('reconcileSeedPersonas', () => {
    test('adds a brand new seed persona that the user does not have yet', () => {
        const result = reconcileSeedPersonas([], [persona()], {});

        assert.deepStrictEqual(result.personas, [persona()]);
        assert.deepStrictEqual(result.snapshots, { 'prompt-engineer': persona() });
    });

    test('leaves an existing persona untouched when its seed has not changed', () => {
        const seed = persona();
        const result = reconcileSeedPersonas([persona()], [seed], { 'prompt-engineer': persona() });

        assert.deepStrictEqual(result.personas, [persona()]);
    });

    test('records a baseline snapshot for a pre-existing persona with no recorded snapshot, without forking it', () => {
        const seed = persona({ customInstructions: 'Updated instructions.' });
        const result = reconcileSeedPersonas([persona()], [seed], {});

        assert.deepStrictEqual(result.personas, [persona()]);
        assert.deepStrictEqual(result.snapshots, { 'prompt-engineer': seed });
    });

    test('updates an unmodified seed persona in place when the seed content changes', () => {
        const oldSeed = persona();
        const newSeed = persona({ customInstructions: 'Updated instructions.' });
        const result = reconcileSeedPersonas([persona()], [newSeed], { 'prompt-engineer': oldSeed });

        assert.deepStrictEqual(result.personas, [newSeed]);
        assert.deepStrictEqual(result.snapshots, { 'prompt-engineer': newSeed });
    });

    test('preserves the favorite flag when updating an unmodified seed persona in place', () => {
        const oldSeed = persona();
        const newSeed = persona({ customInstructions: 'Updated instructions.' });
        const result = reconcileSeedPersonas(
            [persona({ favorite: true })],
            [newSeed],
            { 'prompt-engineer': oldSeed }
        );

        assert.deepStrictEqual(result.personas, [{ ...newSeed, favorite: true }]);
    });

    test('forks the user customized persona into a new one and resets the original to the new seed content', () => {
        const oldSeed = persona();
        const newSeed = persona({ customInstructions: 'Updated instructions.' });
        const customized = persona({ customInstructions: 'My own instructions.' });

        const result = reconcileSeedPersonas([customized], [newSeed], { 'prompt-engineer': oldSeed });

        assert.deepStrictEqual(result.personas, [
            newSeed,
            { ...customized, id: 'prompt-engineer-user', name: 'Prompt Engineer (User)' },
        ]);
        assert.deepStrictEqual(result.snapshots, { 'prompt-engineer': newSeed });
    });

    test('carries the favorite flag from the customized persona onto its fork', () => {
        const oldSeed = persona();
        const newSeed = persona({ customInstructions: 'Updated instructions.' });
        const customized = persona({ customInstructions: 'My own instructions.', favorite: true });

        const result = reconcileSeedPersonas([customized], [newSeed], { 'prompt-engineer': oldSeed });

        const fork = result.personas.find(p => p.id === 'prompt-engineer-user');
        assert.strictEqual(fork?.favorite, true);
    });

    test('numbers the fork name when a previous fork already occupies the default fork id', () => {
        const oldSeed = persona();
        const newSeed = persona({ customInstructions: 'Second update.' });
        const customized = persona({ customInstructions: 'My newest instructions.' });
        const existingFork = persona({
            id: 'prompt-engineer-user',
            name: 'Prompt Engineer (User)',
            customInstructions: 'An earlier customization.',
        });

        const result = reconcileSeedPersonas(
            [customized, existingFork],
            [newSeed],
            { 'prompt-engineer': oldSeed }
        );

        assert.deepStrictEqual(
            result.personas.find(p => p.id === 'prompt-engineer-user-2'),
            { ...customized, id: 'prompt-engineer-user-2', name: 'Prompt Engineer (User 2)' }
        );
        assert.ok(result.personas.some(p => p.id === 'prompt-engineer-user'));
    });

    test('leaves personas the user created themselves untouched', () => {
        const custom = persona({ id: 'my-own-persona', name: 'My Own Persona' });
        const result = reconcileSeedPersonas([custom], [persona()], { 'prompt-engineer': persona() });

        assert.deepStrictEqual(result.personas, [custom, persona()]);
    });

    test('updates the stored persona in place when only the seed tags change', () => {
        const oldSeed = persona({ tags: ['beta'] });
        const newSeed = persona({ tags: [] });
        const result = reconcileSeedPersonas([persona({ tags: ['beta'] })], [newSeed], { 'prompt-engineer': oldSeed });

        assert.deepStrictEqual(result.personas, [newSeed]);
        assert.deepStrictEqual(result.snapshots, { 'prompt-engineer': newSeed });
    });

    test('drops seed-authored tags from a forked persona since the user now owns that copy', () => {
        const oldSeed = persona({ tags: ['beta'] });
        const newSeed = persona({ customInstructions: 'Updated instructions.', tags: ['beta'] });
        const customized = persona({ customInstructions: 'My own instructions.', tags: ['beta'] });

        const result = reconcileSeedPersonas([customized], [newSeed], { 'prompt-engineer': oldSeed });

        const fork = result.personas.find(p => p.id === 'prompt-engineer-user');
        assert.strictEqual(fork?.tags, undefined);
    });

    test('leaves a persona in storage untouched when its seed is removed entirely', () => {
        const snapshots: PersonaSeedSnapshots = { 'prompt-engineer': persona() };
        const result = reconcileSeedPersonas([persona()], [], snapshots);

        assert.deepStrictEqual(result.personas, [persona()]);
        assert.deepStrictEqual(result.snapshots, snapshots);
    });
});
