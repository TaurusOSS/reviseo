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
- No platform imports (`vscode`, `fs`, DOM) inside `src/core/`.

## Testing

- Write fewer, stronger tests that cover the most critical paths.
- The highest-value tests are for `promptBuilder` (output shape and content) and persona CRUD logic.
- Prefer integration-style tests that assert real behaviour over mocks that test implementation details.
- **Assert the full prompt output** using `assert.strictEqual` against fixture files in `src/test/core/__fixtures__/`. Never use weak substring assertions (`includes`) for prompt content — if the template changes, the fixture files must be updated too.
- Test files mirror the source structure: tests for `src/core/foo.ts` live in `src/test/core/foo.test.ts`.
- Test runner: `@vscode/test-cli` with `@vscode/test-electron`.
- Run tests: `npm test`

## Commands

```bash
npm run compile    # tsc build
npm run watch      # tsc watch
npm run lint       # eslint
npm test           # run extension tests
```

Press `F5` in VSCode to launch the Extension Development Host.

## Extension Commands

| Command ID                | What it does                          |
|---------------------------|---------------------------------------|
| `reviseo.openPanel`       | Opens the main Reviseo webview panel  |
| `reviseo.managePersonas`  | Opens panel on the personas tab       |
| `reviseo.generatePrompt`  | Opens panel on the generate tab       |
