# Reviseo — Claude Code Guide

## What is Reviseo

Reviseo is a **persona-based code review prompt generator**. The user defines reviewer personas (e.g. "Security Auditor", "Performance Reviewer"), selects one or more, provides a PR URL, and receives a structured prompt ready to paste into an AI assistant. The tool is currently a **VSCode extension** but is architected to run as a website or MCP server with no changes to core logic.

The central value proposition is the quality of the generated prompt. Everything else is plumbing.

## Architecture

```
reviseo/
├── src/
│   ├── core/                    # Platform-agnostic logic — no vscode imports allowed here
│   │   ├── persona-management/  # Owns: Persona, AdditionalInput, PersonaStore, SEED_PERSONAS, buildGenerationPrompt
│   │   │   └── index.ts         # Public API: PersonaManagementFacade, Persona, AdditionalInput, PersonaStore
│   │   └── review-generation/   # Owns: PromptBuilder, review components, Modes, PromptOptions
│   │       └── index.ts         # Public API: ReviewGenerationFacade, Modes, PromptOptions
│   ├── test/
│   │   └── core/
│   │       ├── persona-management/PersonaManagementFacade.test.ts
│   │       ├── review-generation/ReviewGenerationFacade.test.ts
│   │       └── __fixtures__/    # Full expected prompt outputs for strictEqual assertions
│   ├── webview/        # VSCode webview UI
│   └── extension.ts    # VSCode entry point
```

### Core module rules

1. **Import only from `index.ts`** — external consumers (extension layer, tests) must import from a module's `index.ts`, never from internal files directly. Enforced by `eslint-plugin-boundaries`.
2. **One-way dependency** — `persona-management` has no knowledge of `review-generation`. `review-generation` may import from `persona-management`.
3. **Facades as entry points** — all cross-module communication goes through `PersonaManagementFacade` or `ReviewGenerationFacade`.

The `src/core/` package must remain free of any platform-specific imports (`vscode`, DOM APIs, Node-only APIs). It is the seed of a future standalone `@reviseo/core` npm package. When the project grows to a website or MCP server, only new adapter layers are added — core is untouched.

**Data storage:** All user data (personas) is stored locally only — never sent to any remote server. In the VSCode extension this means `vscode.ExtensionContext.globalState`.

## Coding Standards

- Prefer clear, self-explaining code over comments. If a comment is needed, the code probably needs to be restructured.
- TypeScript strict mode is on — keep it that way.

## Testing

- Write fewer, stronger tests that cover the most critical paths.
- Prefer integration-style tests that assert real behaviour over mocks that test implementation details.
- **Two assertion strategies — pick the right one:**
  - **Fixture files** (`src/test/core/__fixtures__/`) with `assert.strictEqual` for golden-path tests that validate the full generated prompt. Use when the test's purpose is to guard the whole output (e.g. single persona, multi-agent mode, skip-commented). If the template changes, update the fixture.
  - **Prompt DSL** (`assertPrompt` from `src/test/core/review-generation/ReviewPromptAssert.ts`) for tests that validate one structural aspect of the prompt — a phase title, a step name, the presence of a context value, or the exact content of one phase. Use `phase(n).equalsText(...)` to assert an entire phase, `phase(n).step(n).hasName(...).contains(...)` for step-level checks. This keeps tests resilient to changes in unrelated phases or boilerplate.
  - Never use raw `string.includes()` assertions — always go through the DSL or a fixture.
- Test files mirror the source structure: tests for `src/core/foo.ts` live in `src/test/core/foo.test.ts`.
- Test runner: `@vscode/test-cli` with `@vscode/test-electron`.
- **Test names describe business behaviour**, not implementation details. Use the form `"<feature/option> <does what>"` or BDD-style `"<context>, <outcome>"`. Bad: `"phase 4 instructs AI not to submit"`. Good: `"pending review option leaves the review as a draft instead of submitting"`.

## Commands

```bash
npm run compile    # tsc build
npm run watch      # tsc watch
npm run lint       # eslint
npm test           # run extension tests
```

## Rules

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.