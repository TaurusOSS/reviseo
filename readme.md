# Reviseo

**Persona-based AI code review prompt generator for VS Code.**

Define expert reviewer personas, select one or more, enter a GitHub PR URL, and get a structured prompt ready to run in any AI assistant. Reviseo turns your code review process into a repeatable, high-quality workflow powered by the AI models you already use.

---

## How It Works

1. **Pick your personas** — choose from 20 built-in experts (Security, Architecture, Testing, and more) or create your own
2. **Enter a PR URL** — paste a GitHub pull request link
3. **Generate** — Reviseo assembles a complete, structured review prompt
4. **Paste into your AI** — run the prompt in Claude, Copilot, or any assistant with GitHub MCP access

The AI fetches the diff, adds inline review comments, and consolidates overlapping findings from multiple personas into clean, actionable feedback.

---

## Features

- **20 built-in reviewer personas** covering Security, Software Architecture, Hexagonal Architecture, Clean Code, Testing, Performance, Concurrency, Reliability, Observability, Database, CI/CD, Azure Pipelines, Spring Batch, and more
- **Full persona CRUD** — create, edit, and delete personas
- **AI-assisted persona wizard** — describe a persona and let an AI generate it; paste the JSON back to save it
- **Single-agent mode** — one AI reviews the PR using all selected personas sequentially, then consolidates comments
- **Multi-agent mode** — orchestrator AI spawns one subagent per persona for independent parallel review (higher quality, more tokens)
- **GitHub MCP integration** — prompts use `pull_request_read`, `pull_request_review_write`, and `add_comment_to_pending_review`
- **`gh` CLI fetch** — fetch PR diff and metadata directly from the extension into `.ai/reviseo/<pr-number>/` before generating the prompt to save tokens
- **Additional inputs** — personas can request runtime context (e.g. a Jira ticket URL) that gets embedded in the prompt
- **Privacy-first** — all persona data is stored locally in VS Code's global state; nothing is sent to any remote server
- **Theme support** — adapts to VS Code light and dark themes

---

## Built-in Personas

| Area | Personas |
|------|----------|
| Security | Security Expert |
| Architecture | Software Architect, Hexagonal Architecture Expert, Modular Monolith Expert, Skeptical Architect, Solution Design Evaluator |
| Code quality | Clean Code Expert |
| Testing | Testing Expert, E2E Test Expert, Performance Test Expert |
| Reliability & concurrency | Reliability Engineer, Concurrency Expert, Backward Compatibility Expert |
| Data | Database Interaction Expert |
| Observability | Observability Expert |
| CI/CD & pipelines | CI/CD Expert, Azure Pipelines Architect |
| Domain-specific | Spring Batch Expert, Prompt Engineer, Story Requirements Guardian |

---

## Requirements

- An AI assistant with **GitHub MCP server** access (e.g. [Claude](https://claude.ai) with the GitHub MCP server configured, or GitHub Copilot with MCP support)
- A GitHub pull request URL
- [`gh` CLI](https://cli.github.com/) (optional) — required only if you use the built-in PR data fetch feature

No API keys are needed in Reviseo itself — it generates prompts, not AI responses.

---

## Working Directory

Reviseo uses `.ai/reviseo/` as a working directory for temporary files. This includes pre-fetched PR data (diff and metadata stored under `.ai/reviseo/<pr-number>/`) and multi-agent review data files created during the review run. The orchestrator deletes its files after the review is submitted. Add `.ai/` to your repository's `.gitignore` to avoid committing these files if a run is interrupted before cleanup.

---

## Commands

| Command | Description |
|---------|-------------|
| `Reviseo: Open Review Panel` | Open the main Reviseo panel |
| `Reviseo: Manage Personas` | Open the panel on the Personas tab |
| `Reviseo: Generate Review Prompt` | Open the panel on the Generate tab |

Access all commands via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) or the Reviseo icon in the Activity Bar.

---

## Local setup

1. Install the extension from the VS Code Marketplace
2. Click the Reviseo icon in the Activity Bar (or run `Reviseo: Open Review Panel`)
3. On the **Personas** tab, review the built-in personas or create your own
4. Switch to the **Generate** tab
5. Enter a GitHub PR URL and select one or more personas
6. Click **Generate Prompt**
7. Copy the prompt and paste it into your AI assistant

---

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for the full history of changes.
