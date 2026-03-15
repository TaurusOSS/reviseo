import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { buildGenerationPrompt } from '../../core/generationPromptBuilder';

function fixture(name: string): string {
    const fixturePath = path.join(__dirname, '..', '..', '..', 'src', 'test', 'core', '__fixtures__', name);
    return fs.readFileSync(fixturePath, 'utf8');
}

suite('generationPromptBuilder', () => {
    test('generates expected prompt for a given persona name', () => {
        const result = buildGenerationPrompt('Security Auditor');
        assert.strictEqual(result, fixture('generation-prompt-security-auditor.txt'));
    });

    test('substitutes the persona name into the prompt', () => {
        const result = buildGenerationPrompt('Performance Reviewer');
        assert.ok(result.endsWith('Persona name: Performance Reviewer'));
    });

    test('appends description when provided', () => {
        const result = buildGenerationPrompt('Security Auditor', 'Focuses on OWASP top 10.');
        assert.strictEqual(result, fixture('generation-prompt-with-description.txt'));
    });
});
