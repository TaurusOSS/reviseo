import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { ReviewGenerationFacade, PersonaReviewExecutionMode } from '../../../core/review-generation';
import type { Persona } from '../../../core/persona-management';

const TIMESTAMP = '2026-06-14T10-30-00';
const BASE_BRANCH = 'origin/main';

const securityPersona: Persona = {
    id: 'p-1',
    name: 'Security Auditor',
    customInstructions: 'Focus exclusively on security vulnerabilities.',
    checklist: ['SQL injection and query parameterisation', 'XSS and output encoding'],
};

const securityPersonaWithFocusArea: Persona = {
    ...securityPersona,
    additionalInputs: [{ id: 'focus-area', name: 'Focus area' }],
};

const performancePersona: Persona = {
    id: 'p-2',
    name: 'Performance Reviewer',
    customInstructions: 'Identify bottlenecks and scalability concerns.',
    checklist: ['N+1 query patterns', 'Memory leaks'],
};

function fixture(name: string): string {
    const fixturePath = path.join(__dirname, '..', '..', '..', '..', 'src', 'test', 'core', '__fixtures__', name);
    return fs.readFileSync(fixturePath, 'utf8');
}

suite('LocalReviewGenerationFacade', () => {
    const facade = new ReviewGenerationFacade();

    test('returns empty string when no personas provided', () => {
        assert.strictEqual(
            facade.buildLocalPrompt(BASE_BRANCH, TIMESTAMP, [], PersonaReviewExecutionMode.SINGLE_AGENT),
            ''
        );
    });

    test('single persona generates expected prompt', () => {
        assert.strictEqual(
            facade.buildLocalPrompt(BASE_BRANCH, TIMESTAMP, [securityPersona], PersonaReviewExecutionMode.SINGLE_AGENT),
            fixture('local-single-security-persona.txt')
        );
    });

    test('two personas are numbered correctly', () => {
        assert.strictEqual(
            facade.buildLocalPrompt(BASE_BRANCH, TIMESTAMP, [securityPersona, performancePersona], PersonaReviewExecutionMode.SINGLE_AGENT),
            fixture('local-two-personas.txt')
        );
    });

    test('multi-agent mode uses subagent orchestration for review phase', () => {
        assert.strictEqual(
            facade.buildLocalPrompt(BASE_BRANCH, TIMESTAMP, [securityPersona, performancePersona], PersonaReviewExecutionMode.MULTI_AGENT),
            fixture('local-multi-agent-two-personas.txt')
        );
    });

    test('persona additional inputs are included in the prompt', () => {
        assert.strictEqual(
            facade.buildLocalPrompt(BASE_BRANCH, TIMESTAMP, [securityPersonaWithFocusArea], PersonaReviewExecutionMode.SINGLE_AGENT, {
                'p-1': { 'focus-area': 'authentication module' }
            }),
            fixture('local-single-security-persona-with-context.txt')
        );
    });
});
