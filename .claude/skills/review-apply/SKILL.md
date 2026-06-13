---
name: review-apply
description: Apply pull request review comments to code. Use this skill whenever the user wants to process, address, or apply PR review feedback — whether they say "apply review comments", "go through PR comments", "address reviewer feedback", "fix PR comments", "process review suggestions", or provides a PR URL/number and wants the comments handled. The skill fetches all review comments, reads the relevant code, applies or rejects each suggestion, and replies to each comment on GitHub explaining the decision.
---

# review-apply

Fetch all review comments from a pull request, decide how to handle each one, apply code changes where appropriate, and reply to each comment on GitHub.

## Input

The user provides a PR reference in one of these forms:
- A PR number (owner/repo inferred from the current git remote): `/review-apply 42`
- A full GitHub URL: `/review-apply https://github.com/owner/repo/pull/42`

If no PR is specified, ask the user which PR they want to address.

## Step 1: Resolve the PR coordinates

Parse the input to extract `owner`, `repo`, and `pull_number`.

If the user gave a URL, extract the three parts from it.

If the user gave just a number, infer owner and repo from the current git remote:
```bash
git remote get-url origin
```
Parse `owner/repo` from the remote URL (handles both HTTPS and SSH formats).

## Step 2: Fetch the PR and its review comments

Use `mcp__github__pull_request_read` with the resolved coordinates to get:
- PR title, base branch, head branch
- All review comments (inline comments on specific lines/files)
- All review threads

Also use `mcp__github__list_pull_requests` if needed to confirm the PR state.

Collect every comment that is unresolved (not marked as resolved/outdated) AND is one of:
- An inline code comment (has a `path` and `position`/`line`)
- A general review comment requesting changes

Group comments by file so you process one file at a time efficiently.

## Step 3: Process each comment

For each comment, work through this decision process:

### Read the code in context

Use `mcp__github__get_file_contents` (or Read tool) to read the relevant file. Focus on the lines around the comment's position — get enough context (±20 lines) to understand what the reviewer is pointing at.

### Decide: Apply, Reject, or Partial

**Apply** when:
- The suggestion is clearly correct and improves the code
- It fixes a real bug, security issue, or violation of the project's standards
- The change is straightforward and has no unintended side effects

**Reject** when:
- The suggestion conflicts with the project's established patterns or architecture
- It would introduce complexity without meaningful benefit
- It contradicts deliberate design decisions visible in the codebase
- Applying it would break something else

**Partial** when:
- The concern is valid but the suggested fix is not the right approach
- Only part of the suggestion makes sense
- The issue exists but needs a different solution

### Apply the change

If applying: edit the file using the Edit tool. Make the minimal change that addresses the reviewer's concern — don't clean up surrounding code or add unrequested improvements.

If rejecting or partially applying: no code change needed (or only the partial change).

## Step 4: Reply to each comment on GitHub

After processing each comment, post a reply using `mcp__github__add_reply_to_pull_request_comment`.

Reply format — keep it concise and professional:

**Fixed:**
> Will be fixed — [one sentence describing what will change and why it's the right fix].

**Rejected:**
> Will not be applied — [one sentence explaining why: e.g., "this conflicts with the project's X pattern" or "the existing behaviour is intentional because Y"].

**Partially fixed:**
> Will be partially addressed — [one sentence on what will be changed and what won't, and why].

Don't be defensive. If rejecting, be clear and direct about the reason without debating.

## Tips for good decisions

- Read `CLAUDE.md` at the repo root before starting — it often explains conventions that make certain suggestions correct or incorrect.
- When a suggestion contradicts a pattern you see consistently across the codebase, that's usually a good reason to reject.
- If you're genuinely unsure whether to apply a comment, apply it — reviewers generally know the codebase and their concerns are usually valid.
- Don't apply suggestions that would require touching more than 3–4 files to do safely. Flag those in the reply as needing broader discussion.
- Treat `// TODO` or vague suggestions as rejections unless they come with a clear actionable ask.

## Error cases

- If the PR has no review comments, post a message telling the user there's nothing to address.
- If `mcp__github__pull_request_read` fails, report the error and ask the user to confirm the PR coordinates.
- If a file referenced in a comment no longer exists (comment is stale), reply noting the comment is outdated.
