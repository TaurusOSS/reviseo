# Reviseo

**Persona-based code review prompt generator for VSCode.**

Define expert reviewer personas, select one or more, paste a PR URL, and get a structured prompt ready to run in Claude or any AI assistant with GitHub MCP access.

---

## How it works

1. **Define personas** — Create reviewer personas like "Security Auditor" or "Performance Expert", each with custom instructions and a checklist.
2. **Select personas** — Pick one or more personas for a given review.
3. **Enter a PR URL** — Provide a GitHub pull request URL.
4. **Generate** — Reviseo builds a multi-persona review prompt.
5. **Paste into your AI assistant** — The prompt instructs the AI to use GitHub MCP tools to fetch the diff, add review comments, and consolidate findings.

The central value is the quality of the generated prompt — each persona reviews independently, then overlapping comments are merged into stronger, consolidated feedback.

---

## Features

- **20 built-in expert personas** covering security, architecture, testing, performance, observability, concurrency, clean code, and more.
- **Full persona CRUD** — create, edit, and delete your own custom personas with a name, instructions, and checklist items.
- **Multi-persona composition** — select any combination of personas per review.
- **Structured prompts** — generated prompts include consolidation logic to eliminate duplicate comments.
- **GitHub MCP integration** — prompts are designed for AI assistants with the GitHub MCP server (`pull_request_read`, `pull_request_review_write`, `add_comment_to_pending_review`).
- **Privacy-first** — all persona data is stored locally in VSCode global state; nothing is sent to any remote server.
- **VSCode theme support** — UI adapts to your current light or dark theme.

---

## Built-in personas

| Persona                       | Focus                                                     |
|-------------------------------|-----------------------------------------------------------|
| Security Expert               | Trust boundaries, injection, secrets, auth                |
| Software Architect            | Package structure, coupling, resilience patterns          |
| Hexagonal Architecture Expert | Domain isolation, ports/adapters, dependency direction    |
| Modular Monolith Expert       | Vertical slices, module boundaries, data ownership        |
| Skeptical Architect           | Over-engineering, reinvention, tech fit                   |
| Solution Design Evaluator     | Design alternatives, simplicity vs. complexity            |
| Clean Code Expert             | Readability, naming, duplication, KISS                    |
| Testing Expert                | Test type selection, mocking, assertion strength          |
| Performance Test Expert       | Workload realism, warmup, latency percentiles             |
| Concurrency Expert            | Async correctness, thread safety, context propagation     |
| Reliability Engineer          | Timeouts, retries, circuit breakers, graceful degradation |
| Backward Compatibility Expert | Breaking changes, API evolution, deprecation              |
| Database Interaction Expert   | Transactions, N+1 queries, connection pooling             |
| Observability Expert          | Logging placement, metrics, correlation IDs               |
| Azure Pipelines Architect     | Stage dependencies, approvals, rollback strategy          |
| Spring Batch Expert           | Job semantics, restartability, error handling             |
| Prompt Engineer               | Clarity of intent, role definition, I/O format            |
| ...and more                   |                                                           |

---

## Commands

| Command                           | Description                        |
|-----------------------------------|------------------------------------|
| `Reviseo: Open Panel`             | Open the main Reviseo panel        |
| `Reviseo: Manage Personas`        | Open the panel on the Personas tab |
| `Reviseo: Generate Review Prompt` | Open the panel on the Generate tab |

Access via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).

---

## Requirements

To use the generated prompts end-to-end, your AI assistant needs access to the **GitHub MCP server**. The generated prompt uses these tools:

- `pull_request_read` — fetches the PR diff
- `pull_request_review_write` — creates a pending review
- `add_comment_to_pending_review` — adds comments to the pending review

Reviseo itself has no external dependencies — it only generates the prompt text.

---

## Install from source

1. Clone the repository: `git clone https://github.com/TaurusOSS/reviseo`
2. Install [vsce](https://github.com/microsoft/vscode-vsce) if you don't have it: `npm install -g @vscode/vsce`
3. Install dependencies: `npm install`
4. Package the extension: `vsce package`
5. Install the generated `.vsix` file in VSCode:
   - Open the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Click **Views and More Actions...** (the `...` menu)
   - Select **Install from VSIX...**
   - Pick the `.vsix` file produced in step 4

---

## Release Notes

### 0.0.1

Initial release — persona management, prompt generation, 20 built-in personas.
