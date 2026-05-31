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

const srgPersona: Persona = {
    id: 'story-requirements-guardian',
    name: 'Story Requirements Guardian',
    customInstructions: 'Act as a QA engineer verifying that this pull request fully and faithfully implements the acceptance criteria defined in the linked Jira story. Your review is not about code quality, architecture, or style — it is exclusively about requirements coverage. For every acceptance criterion in the story, determine whether the PR satisfies it, partially satisfies it, or leaves it unaddressed. Flag any changes in the PR that go beyond the story\'s defined scope. Be specific: reference the criterion text and point to the relevant code or its absence. Use available tools to get ticket description.',
    checklist: [
        'Does the PR implement every acceptance criterion listed in the Jira story, with no criterion left unaddressed?',
        'Are edge cases implied by the acceptance criteria handled, or do any criteria remain partially implemented?',
        'Does the PR stay within the scope defined by the story, or does it introduce changes unrelated to the acceptance criteria?',
        'Are there any out-of-scope changes that should be extracted into a separate story or PR?',
        'Do the tests cover the acceptance criteria directly, verifying the described behaviour rather than only internal implementation details?',
    ],
    additionalInputs: [{ id: 'jira-url', name: 'Jira Ticket URL' }],
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

    test('SRG persona with Jira URL in personaContext produces exact full prompt', () => {
        const result = promptBuilder
            .url('https://github.com/org/repo/pull/1')
            .personas([srgPersona])
            .context({ 'story-requirements-guardian': { 'jira-url': 'https://org.atlassian.net/browse/PROJ-42' } })
            .mode(Modes.SINGLE_AGENT)
            .getText();
        assert.strictEqual(result, fixture('srg-persona-with-jira-url.txt'));
    });

});
