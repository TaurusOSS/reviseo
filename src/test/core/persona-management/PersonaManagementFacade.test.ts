import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { PersonaManagementFacade } from '../../../core/persona-management';

function fixture(name: string): string {
    const fixturePath = path.join(__dirname, '..', '..', '..', '..', 'src', 'test', 'core', '__fixtures__', name);
    return fs.readFileSync(fixturePath, 'utf8');
}

suite('PersonaManagementFacade', () => {
    const facade = new PersonaManagementFacade();

    suite('getSeedPersonas', () => {
        test('SRG persona exists with jira-url additional input', () => {
            const srg = facade.getSeedPersonas().find(p => p.id === 'story-requirements-guardian');
            assert.ok(srg, 'SRG persona not found in seed personas');
            assert.deepStrictEqual(srg.additionalInputs, [{ id: 'jira-url', name: 'Jira Ticket URL' }]);
        });
    });

    suite('buildGenerationPrompt', () => {
        test('generates expected prompt for a given persona name', () => {
            assert.strictEqual(
                facade.buildGenerationPrompt('Security Auditor'),
                fixture('generation-prompt-security-auditor.txt')
            );
        });

        test('substitutes the persona name into the prompt', () => {
            assert.ok(facade.buildGenerationPrompt('Performance Reviewer').endsWith('Persona name: Performance Reviewer'));
        });

        test('appends description when provided', () => {
            assert.strictEqual(
                facade.buildGenerationPrompt('Security Auditor', 'Focuses on OWASP top 10.'),
                fixture('generation-prompt-with-description.txt')
            );
        });
    });
});
