import * as assert from 'assert';

export function assertPrompt(prompt: string): ReviewPromptAssert {
    return new ReviewPromptAssert(prompt);
}

function extractSection(text: string, pattern: RegExp, n: number, label: string): string {
    const matches = [...text.matchAll(pattern)];
    const idx = matches.findIndex(m => Number(m[1]) === n);
    assert.ok(idx !== -1, `${label} ${n} not found`);
    const end = matches[idx + 1]?.index ?? text.length;
    return text.slice(matches[idx].index!, end).trim();
}

function assertContains(text: string, substring: string, label: string): void {
    assert.ok(text.includes(substring), `${label} does not contain: ${JSON.stringify(substring)}`);
}

class ReviewPromptAssert {
    constructor(private readonly text: string) {}

    phase(n: number): PhaseAssert {
        return new PhaseAssert(extractSection(this.text, /^## Phase (\d+):/gm, n, 'Phase'), n);
    }

    hasNoPhase(name: string): this {
        const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`^## Phase \\d+: ${escaped}$`, 'm');
        assert.ok(!pattern.test(this.text), `Expected no phase named "${name}" but found one`);
        return this;
    }
}

class PhaseAssert {
    constructor(private readonly text: string, private readonly n: number) {}

    step(n: number): StepAssert {
        return new StepAssert(extractSection(this.text, /^### Step (\d+):/gm, n, 'Step'), n, this.n);
    }

    equalsText(expected: string): this {
        assert.strictEqual(this.text, expected, `Phase ${this.n} text does not match expected`);
        return this;
    }

    contains(text: string): this {
        assertContains(this.text, text, `Phase ${this.n}`);
        return this;
    }
}

class StepAssert {
    constructor(
        private readonly text: string,
        private readonly n: number,
        private readonly phaseN: number,
    ) {}

    hasName(name: string): this {
        assert.ok(
            this.text.startsWith(`### Step ${this.n}: ${name}`),
            `Step ${this.n} in Phase ${this.phaseN} expected name ${JSON.stringify(name)}, got: ${JSON.stringify(this.text.split('\n')[0])}`,
        );
        return this;
    }

    contains(text: string): this {
        assertContains(this.text, text, `Step ${this.n} in Phase ${this.phaseN}`);
        return this;
    }
}
