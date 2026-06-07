# Changelog

All notable changes to Reviseo are documented here.

## [1.0.0] - 2026-06-07

### Added

- 20 built-in reviewer personas covering Security, Architecture, Testing, Performance, Observability, CI/CD, Spring Batch, and more
- Manual persona creation with name, custom instructions, checklist items, and optional additional inputs
- AI-assisted persona generation wizard — 4-step flow where you paste an AI-generated JSON into the extension
- Single-agent review mode: one AI uses all selected personas sequentially, then consolidates duplicate comments
- Multi-agent review mode: orchestrator AI spawns one subagent per persona for independent parallel review
- GitHub MCP integration — generated prompts use `pull_request_read`, `pull_request_review_write`, and `add_comment_to_pending_review`
- Comment consolidation logic: overlapping comments from multiple personas are merged into a single, stronger comment
- Additional inputs support — personas can require runtime context at review time (e.g. Jira ticket URL for Story Requirements Guardian)
- Privacy-first storage: all persona data stored locally in VS Code global state, never sent to any remote server
- VS Code theme support (light and dark)
