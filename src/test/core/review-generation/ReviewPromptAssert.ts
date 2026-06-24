import * as assert from 'assert';

export function assertPrompt(prompt: string): ReviewPromptAssert {
    return new ReviewPromptAssert(prompt);
}

class ReviewPromptAssert {
    constructor(private readonly _text: string) {}

    phase(n: number): PhaseAssert {
        const allMatches = [...this._text.matchAll(/^## Phase (\d+):/gm)];
        const match = allMatches.find(m => parseInt(m[1]) === n);
        assert.ok(match, `Phase ${n} not found in prompt`);
        const start = match.index!;
        const nextMatch = allMatches.find(m => parseInt(m[1]) > n);
        const end = nextMatch ? nextMatch.index! : this._text.length;
        return new PhaseAssert(this._text.slice(start, end).trim(), n);
    }
}

class PhaseAssert {
    constructor(private readonly _text: string, private readonly _n: number) {}

    step(n: number): StepAssert {
        const allMatches = [...this._text.matchAll(/^### Step (\d+):/gm)];
        const match = allMatches.find(m => parseInt(m[1]) === n);
        assert.ok(match, `Step ${n} not found in Phase ${this._n}`);
        const start = match.index!;
        const nextMatch = allMatches.find(m => parseInt(m[1]) > n);
        const end = nextMatch ? nextMatch.index! : this._text.length;
        return new StepAssert(this._text.slice(start, end).trim(), n, this._n);
    }

    hasTitle(title: string): this {
        const header = `## Phase ${this._n}: ${title}`;
        assert.ok(
            this._text.startsWith(header),
            `Phase ${this._n} expected title ${JSON.stringify(title)}, got: ${JSON.stringify(this._text.split('\n')[0])}`,
        );
        return this;
    }

    equalsText(expected: string): this {
        assert.strictEqual(this._text, expected.trim(), `Phase ${this._n} text does not match expected`);
        return this;
    }

    contains(text: string): this {
        assert.ok(this._text.includes(text), `Phase ${this._n} does not contain: ${JSON.stringify(text)}`);
        return this;
    }
}

class StepAssert {
    constructor(
        private readonly _text: string,
        private readonly _n: number,
        private readonly _phaseN: number,
    ) {}

    hasName(name: string): this {
        assert.ok(
            this._text.startsWith(`### Step ${this._n}: ${name}`),
            `Step ${this._n} in Phase ${this._phaseN} expected name ${JSON.stringify(name)}, got: ${JSON.stringify(this._text.split('\n')[0])}`,
        );
        return this;
    }

    contains(text: string): this {
        assert.ok(
            this._text.includes(text),
            `Step ${this._n} in Phase ${this._phaseN} does not contain: ${JSON.stringify(text)}`,
        );
        return this;
    }

    and(): this {
        return this;
    }
}
