---
name: release
description: >
  Bump the version and update the changelog for a Reviseo release. Invoke this skill when the user says "release version X", "bump to X.Y.Z", "cut a release", "prepare release X.Y.Z", "release X.Y.Z", or any variation. The skill updates package.json and prepends a new changelog entry to CHANGELOG.md from git history since the previous tag. Use this skill any time a version bump is being prepared, even if the user just says "let's release".
---

# Release Skill

Prepare a Reviseo version release by updating `package.json` and `CHANGELOG.md`. Requires one argument: the new version string (e.g. `1.2.0`).

## Steps

### 1. Validate input

The version must be provided as the argument. It must match `MAJOR.MINOR.PATCH` (semver). If missing or malformed, stop and ask the user for a valid version number.

### 2. Determine the previous tag

```bash
git tag --sort=-version:refname | head -1
```

This is the baseline for the changelog. If no tags exist, use the first commit (`git rev-list --max-parents=0 HEAD`) as the baseline.

### 3. Collect commits since the previous tag

```bash
git log <prev-tag>..HEAD --pretty=format:"%s" --no-merges
```

This gives you the raw material to understand what changed. Treat it as input for synthesis, not as a list to copy verbatim.

### 4. Synthesize user-facing changes

Read through the commits and extract only changes that matter to users of the extension — new features, behaviour changes, bug fixes, and removed capabilities.

**Discard entirely:**
- Refactors, code cleanups, modularisation
- Dependency version bumps
- CI/CD pipeline changes
- Internal tooling, build system changes
- Test additions or fixes
- Documentation-only changes

**For what remains**, group related commits into a single changelog item if they collectively describe one change from the user's perspective. Write each item as a plain-English sentence describing what the user gains or what changed for them — not what the developer did. One item per line, no commit hashes, no PR numbers.

Example of what NOT to write:
- `Refactor prompt builder to make it more modular (#47)`
- `Bump the versions-updates group with 3 updates (#54)`

Example of what to write:
- `Added support for additional inputs on reviewer personas`
- `Fixed an issue where multi-agent review mode could generate duplicate comments`

### 5. Build the new changelog entry

Use today's date (`date +%Y-%m-%d`). Use Keep-a-Changelog sections:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- Plain-English description of a new feature or capability

### Changed

- Plain-English description of changed behaviour

### Fixed

- Plain-English description of a bug fix

### Removed

- Plain-English description of removed functionality
```

Only include sections that have at least one item. If all commits since the previous tag are purely technical (nothing user-facing), write a single `### Changed` entry: `- Internal improvements and maintenance`.

### 6. Prepend the entry to CHANGELOG.md

Insert the new entry **after** the `# Changelog` header line and before the first existing `## [` entry. Preserve all existing content exactly.

If `CHANGELOG.md` does not exist, create it first:

```markdown
# Changelog

All notable changes to Reviseo are documented here.
```

### 7. Update package.json

Update package.json with new version

### 8. Check if readme.md needs an update

Read `readme.md` and compare it against the user-facing changes synthesised in step 4. Flag any sections that are stale or missing — for example:

- A new feature is not listed under **Features** or **Built-in Personas**
- A removed capability is still described
- A new command is missing from the **Commands** table
- A changed workflow is described inaccurately

If updates are needed, list each one as a short bullet and ask the user whether to apply them. Do **not** edit `readme.md` without explicit confirmation. If `readme.md` is already accurate, say so briefly and move on.

### 9. Show what changed

Print a summary:

```
package.json: version → X.Y.Z
CHANGELOG.md: prepended [X.Y.Z] section with N items
readme.md: <up to date | N suggested updates (pending confirmation)>
```

Show the full new changelog entry so the user can review it before doing anything else.

## Notes

- Only modify `package.json` and `CHANGELOG.md` unless the user confirms readme changes.
- Do not create git tags, commits, or push anything. Tagging and publishing are handled by CI/CD.
