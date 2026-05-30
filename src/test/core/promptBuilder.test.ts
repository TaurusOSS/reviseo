import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { promptBuilder, Modes } from '../../core/promptBuilder';
import type { Persona } from '../../core/types';

const securityPersona: Persona = {
    id: 'p-1',
    name: 'Security Auditor',
    customInstructions: 'Focus exclusively on security vulnerabilities.',
    checklist: ['SQL injection and query parameterisation', 'XSS and output encoding'],
};

const performancePersona: Persona = {
    id: 'p-2',
    name: 'Performance Reviewer',
    customInstructions: 'Identify bottlenecks and scalability concerns.',
    checklist: ['N+1 query patterns', 'Memory leaks'],
};

// Fixtures live in src/test/core/__fixtures__/ — resolved from the compiled out/ dir
function fixture(name: string): string {
    const fixturePath = path.join(__dirname, '..', '..', '..', 'src', 'test', 'core', '__fixtures__', name);
    return fs.readFileSync(fixturePath, 'utf8');
}

suite('promptBuilder', () => {
    test('returns empty string when no personas provided', () => {
        assert.strictEqual(
            promptBuilder.url('https://github.com/org/repo/pull/1').personas([]).build().getText(),
            ''
        );
    });

    test('single persona generates expected prompt', () => {
        const result = promptBuilder
            .url('https://github.com/org/repo/pull/1')
            .personas([securityPersona])
            .mode(Modes.SINGLE_AGENT)
            .getText();
        assert.strictEqual(result, fixture('single-security-persona.txt'));
    });

    test('two personas are numbered correctly', () => {
        const result = promptBuilder
            .url('https://github.com/org/repo/pull/1')
            .personas([securityPersona, performancePersona])
            .mode(Modes.SINGLE_AGENT)
            .getText();
        assert.strictEqual(result, fixture('two-personas.txt'));
    });

    test('persona with empty checklist renders placeholder', () => {
        const persona: Persona = { id: 'p-3', name: 'Reviewer', customInstructions: '', checklist: [] };
        const result = promptBuilder
            .url('https://github.com/org/repo/pull/1')
            .personas([persona])
            .mode(Modes.SINGLE_AGENT)
            .getText();
        assert.strictEqual(result, fixture('empty-checklist-persona.txt'));
    });

    test('multi-agent: appends orchestration block after base prompt', () => {
        const result = promptBuilder
            .url('https://github.com/org/repo/pull/1')
            .personas([securityPersona, performancePersona])
            .mode(Modes.MULTI_AGENT)
            .getText();
        assert.strictEqual(result, fixture('multi-agent-two-personas.txt'));
    });
});
