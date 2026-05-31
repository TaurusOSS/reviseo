import * as assert from 'assert';
import { SEED_PERSONAS } from '../../core/seedPersonas';

suite('seedPersonas', () => {
    test('SRG persona exists with jira-url additional input', () => {
        const srg = SEED_PERSONAS.find(p => p.id === 'story-requirements-guardian');
        assert.ok(srg, 'SRG persona not found in SEED_PERSONAS');
        assert.deepStrictEqual(srg.additionalInputs, [{ id: 'jira-url', name: 'Jira Ticket URL' }]);
    });
});
