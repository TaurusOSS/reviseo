# Changelog

All notable changes to Reviseo are documented here.

## [1.4.0] - 2026-06-27

### Added

- Added an option to skip the cleanup phase and keep temporary review files after the review completes

### Changed

- Review comments are now posted on the specific line of code they relate to, rather than as general PR-level comments
- Existing review comments are checked before posting to avoid creating duplicates

## [1.3.0] - 2026-06-21

### Added

- Personas can now be marked as favorites for quick access

### Changed

- Improved the quality of generated code review comments

## [1.2.0] - 2026-06-21

### Added

- Local review mode — review code directly from the local diff without a GitHub pull request URL
- Option to leave the review as a draft (pending state) instead of automatically submitting it

### Changed

- Review mode is now remembered per workspace, so Reviseo restores your last used mode when you reopen the panel
- Multi-agent mode now saves the PR diff as a separate file in `.ai/reviseo/` rather than embedding it in JSON

## [1.1.0] - 2026-06-08

### Changed

- Improved the quality of generated code review prompts
- Multi-agent review mode no longer posts a summary comment after completing reviews
- Multi-agent review mode now gathers pull request data more accurately, resulting in better review context

## [1.0.1] - 2026-06-07

### Changed

- Updated extension icon

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
