# Reviseo — Claude Code Guide

## What is Reviseo

Reviseo is a **persona-based code review prompt generator**. The user defines reviewer personas (e.g. "Security Auditor", "Performance Reviewer"), selects one or more, provides a PR URL, and receives a structured prompt ready to paste into an AI assistant. The tool is currently a **VSCode extension** but is architected to run as a website or MCP server with no changes to core logic.

The central value proposition is the quality of the generated prompt. Everything else is plumbing.

## Architecture

```
reviseo/
├── src/
│   ├── core/           # Platform-agnostic logic — no vscode imports allowed here
│   │   ├── types.ts        # Persona, message contracts
│   │   ├── promptBuilder.ts
│   │   └── personaStore.ts # Interface — concrete impl lives in platform layer
│   ├── test/
│   │   └── core/
│   │       ├── promptBuilder.test.ts
│   │       └── __fixtures__/   # Full expected prompt outputs for strictEqual assertions
│   ├── webview/        # VSCode webview UI
│   └── extension.ts    # VSCode entry point
```

The `src/core/` package must remain free of any platform-specific imports (`vscode`, DOM APIs, Node-only APIs). It is the seed of a future standalone `@reviseo/core` npm package. When the project grows to a website or MCP server, only new adapter layers are added — core is untouched.

**Data storage:** All user data (personas) is stored locally only — never sent to any remote server. In the VSCode extension this means `vscode.ExtensionContext.globalState`.

## Coding Standards

- Prefer clear, self-explaining code over comments. If a comment is needed, the code probably needs to be restructured.
- TypeScript strict mode is on — keep it that way.

## Testing

- Write fewer, stronger tests that cover the most critical paths.
- Prefer integration-style tests that assert real behaviour over mocks that test implementation details.
- **Assert the full prompt output** using `assert.strictEqual` against fixture files in `src/test/core/__fixtures__/`. Never use weak substring assertions (`includes`) for prompt content — if the template changes, the fixture files must be updated too.
- Test files mirror the source structure: tests for `src/core/foo.ts` live in `src/test/core/foo.test.ts`.
- Test runner: `@vscode/test-cli` with `@vscode/test-electron`.

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