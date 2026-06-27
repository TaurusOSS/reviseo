import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { ReviewGenerationFacade, PersonaReviewExecutionMode } from '../../../core/review-generation';
import type { GithubReviewConfiguration } from '../../../core/review-generation';
import type { Persona } from '../../../core/persona-management';
import { PersonaManagementFacade } from '../../../core/persona-management';
import { assertPrompt } from './ReviewPromptAssert';

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
        skipCommentedIssues: false,
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
        const prompt = facade.build(githubConfig({ personas: [securityPersona, performancePersona] }));
        assertPrompt(prompt).phase(2).step(1).hasName('Security Auditor');
        assertPrompt(prompt).phase(2).step(2).hasName('Performance Reviewer');
    });

    test('persona with empty checklist renders placeholder', () => {
        const persona: Persona = { id: 'p-3', name: 'Reviewer', customInstructions: '', checklist: [] };
        const prompt = facade.build(githubConfig({ personas: [persona] }));
        assertPrompt(prompt).phase(2).step(1).hasName('Reviewer').contains('(no checklist items)');
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

    test('SRG persona with Jira URL in personaContext includes the ticket URL in the review step', () => {
        const prompt = facade.build(githubConfig({
            personas: [srgPersona],
            context: { 'story-requirements-guardian': { 'jira-url': 'https://org.atlassian.net/browse/PROJ-42' } },
        }));
        assertPrompt(prompt).phase(2).step(1)
            .hasName('Story Requirements Guardian')
            .contains('**Jira Ticket URL:** https://org.atlassian.net/browse/PROJ-42');
    });

    test('pending review option leaves the review as a draft instead of submitting', () => {
        const prompt = facade.build(githubConfig({ personas: [securityPersona], pendingReview: true }));
        assertPrompt(prompt).phase(4).equalsText(`
## Phase 4: Create Pending Review

Create a pending review on pull request #1, add all prepared comments, and stop — do NOT submit or publish it. Leave it in pending/draft state for manual inspection.

1. Create a new pending review. Do not add a review body — leave it empty.
2. Add each prepared comment to the pending review:
   2a. line is set → use the tool that accepts "path" + "line" parameters.
   2b. line is null → use the tool that accepts only "path" (no "line" parameter).

If any operation fails, report the error and stop — do not submit a partial review.`.trim());
    });


    test('skip commented issues fetches existing comments and instructs Claude to filter duplicates and post enriching replies', () => {
        assert.strictEqual(
            facade.build(githubConfig({ personas: [securityPersona], skipCommentedIssues: true })),
            fixture('single-security-persona-skip-commented.txt')
        );
    });

    test('skip commented issues in multi-agent mode passes existing comments filtering to prepare phase', () => {
        assert.strictEqual(
            facade.build(githubConfig({
                personas: [securityPersona, performancePersona],
                personaReviewExecutionMode: PersonaReviewExecutionMode.MULTI_AGENT,
                skipCommentedIssues: true,
            })),
            fixture('multi-agent-two-personas-skip-commented.txt')
        );
    });
});
