import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { ReviewGenerationFacade, PersonaReviewExecutionMode } from '../../../core/review-generation';
import type { GithubReviewConfiguration } from '../../../core/review-generation';
import type { Persona } from '../../../core/persona-management';
import { PersonaManagementFacade } from '../../../core/persona-management';

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

const srgPersona = new PersonaManagementFacade().getSeedPersonas().find(p => p.id === 'story-requirements-guardian')!;

function fixture(name: string): string {
    const fixturePath = path.join(__dirname, '..', '..', '..', '..', 'src', 'test', 'core', '__fixtures__', name);
    return fs.readFileSync(fixturePath, 'utf8');
}

function githubConfig(overrides: Partial<GithubReviewConfiguration> & Pick<GithubReviewConfiguration, 'personas'>): GithubReviewConfiguration {
    return {
        kind: 'github',
        url: 'https://github.com/org/repo/pull/1',
        personaReviewExecutionMode: PersonaReviewExecutionMode.SINGLE_AGENT,
        context: {},
        pendingReview: false,
        ...overrides,
    };
}

suite('ReviewGenerationFacade', () => {
    const facade = new ReviewGenerationFacade();

    test('returns empty string when no personas provided', () => {
        assert.strictEqual(facade.build(githubConfig({ personas: [] })), '');
    });

    test('single persona generates expected prompt', () => {
        assert.strictEqual(
            facade.build(githubConfig({ personas: [securityPersona] })),
            fixture('single-security-persona.txt')
        );
    });

    test('two personas are numbered correctly', () => {
        assert.strictEqual(
            facade.build(githubConfig({ personas: [securityPersona, performancePersona] })),
            fixture('two-personas.txt')
        );
    });

    test('persona with empty checklist renders placeholder', () => {
        const persona: Persona = { id: 'p-3', name: 'Reviewer', customInstructions: '', checklist: [] };
        assert.strictEqual(
            facade.build(githubConfig({ personas: [persona] })),
            fixture('empty-checklist-persona.txt')
        );
    });

    test('multi-agent: appends orchestration block after base prompt', () => {
        assert.strictEqual(
            facade.build(githubConfig({
                personas: [securityPersona, performancePersona],
                personaReviewExecutionMode: PersonaReviewExecutionMode.MULTI_AGENT,
            })),
            fixture('multi-agent-two-personas.txt')
        );
    });

    test('SRG persona with Jira URL in personaContext produces exact full prompt', () => {
        assert.strictEqual(
            facade.build(githubConfig({
                personas: [srgPersona],
                context: { 'story-requirements-guardian': { 'jira-url': 'https://org.atlassian.net/browse/PROJ-42' } },
            })),
            fixture('srg-persona-with-jira-url.txt')
        );
    });

    test('pending review option leaves the review as a draft instead of submitting', () => {
        assert.strictEqual(
            facade.build(githubConfig({ personas: [securityPersona], pendingReview: true })),
            fixture('single-security-persona-pending.txt')
        );
    });
});
