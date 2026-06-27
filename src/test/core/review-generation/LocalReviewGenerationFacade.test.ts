import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { ReviewGenerationFacade, PersonaReviewExecutionMode } from '../../../core/review-generation';
import type { LocalReviewConfiguration } from '../../../core/review-generation';
import type { Persona } from '../../../core/persona-management';
import { assertPrompt } from './ReviewPromptAssert';

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

function localConfig(overrides: Partial<LocalReviewConfiguration> & Pick<LocalReviewConfiguration, 'personas'>): LocalReviewConfiguration {
    return {
        kind: 'local',
        baseBranch: BASE_BRANCH,
        timestamp: TIMESTAMP,
        personaReviewExecutionMode: PersonaReviewExecutionMode.SINGLE_AGENT,
        context: {},
        skipCleanup: false,
        ...overrides,
    };
}

suite('LocalReviewGenerationFacade', () => {
    const facade = new ReviewGenerationFacade();

    test('returns empty string when no personas provided', () => {
        assert.strictEqual(facade.build(localConfig({ personas: [] })), '');
    });

    test('single persona generates expected prompt', () => {
        assert.strictEqual(
            facade.build(localConfig({ personas: [securityPersona] })),
            fixture('local-single-security-persona.txt')
        );
    });

    test('two personas are numbered correctly', () => {
        const prompt = facade.build(localConfig({ personas: [securityPersona, performancePersona] }));
        assertPrompt(prompt).phase(2).step(1).hasName('Security Auditor');
        assertPrompt(prompt).phase(2).step(2).hasName('Performance Reviewer');
    });

    test('multi-agent mode uses subagent orchestration for review phase', () => {
        assert.strictEqual(
            facade.build(localConfig({
                personas: [securityPersona, performancePersona],
                personaReviewExecutionMode: PersonaReviewExecutionMode.MULTI_AGENT,
            })),
            fixture('local-multi-agent-two-personas.txt')
        );
    });

    test('persona additional inputs are included in the prompt', () => {
        const prompt = facade.build(localConfig({
            personas: [securityPersonaWithFocusArea],
            context: { 'p-1': { 'focus-area': 'authentication module' } },
        }));
        assertPrompt(prompt).phase(2).step(1).hasName('Security Auditor').contains('**Focus area:** authentication module');
    });

    test('skip cleanup option omits the cleanup phase from the generated prompt', () => {
        const prompt = facade.build(localConfig({ personas: [securityPersona], skipCleanup: true }));
        assertPrompt(prompt).hasNoPhase('Cleanup');
    });
});
