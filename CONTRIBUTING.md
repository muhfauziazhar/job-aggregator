# Contributing to {{PRODUCT_NAME}}

This project follows a **docs-first, PR-driven** development flow. Read this once before your first contribution.

## Branching

`main` is always green and deployable. All work happens on feature branches.

**Rule**: 1 issue = 1 branch = 1 PR.

**Branch naming**: `<type>/<issue-number>-<short-slug>`

Examples:
- `feat/12-jd-matcher`
- `fix/47-print-margins`
- `chore/3-trivy-scan`
- `docs/19-risk-update`

**Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`

## Commits — Conventional Commits

```
<type>(<optional-scope>): <subject in imperative present>

<body — what changed and why; wrap at 72 cols>

Refs #<issue-number>      ← intermediate commits
```

The **final** commit in a PR (the one that closes the issue) uses `Closes #N` instead of `Refs #N`. After squash-merge, this auto-closes the issue.

Subject line rules:
- Imperative present (`add`, not `added` or `adds`)
- No trailing period
- Lowercase first word after the type prefix
- ≤ 72 chars

## Pull Requests

### Opening a PR

```bash
gh pr create \
  --title "<type>: <subject> (US-NN if applicable)" \
  --body "$(cat <<'EOF'
## Summary

<1–2 sentences>

## Changes

- <bullet>
- <bullet>

## How to test

1. <step>
2. <step>

## DoD

- [ ] Tests pass
- [ ] Typecheck clean
- [ ] Lint clean
- [ ] Build succeeds
- [ ] Documentation updated (if applicable)

Closes #<issue-number>
EOF
)"
```

### PR rules

- **Title** must follow Conventional Commits format (validated by `pr-conventions.yml`).
- **Body** must contain `Closes #N`, `Fixes #N`, `Resolves #N`, or `Refs #N` (validated).
- **All checks green**: lint, typecheck, test, build.
- **Self-review** the diff before requesting human review (or before squash-merging if solo).
- **Update docs** in the same PR when applicable (`docs/04`, `docs/05`, `docs/18`, etc.).

### Merging

Default: **squash-merge with delete-branch**. Clean main history (1 commit per issue), branch detail preserved on GitHub.

```bash
gh pr merge <pr-number> --squash --delete-branch
```

`Closes #N` in the squashed commit auto-closes the linked issue and attaches the commit to the issue timeline.

## Issue Hygiene

### Picking up an issue

1. Comment "Picking this up" if collaborating; skip for solo.
2. For `effort:L` issues: write a plan to `.hermes/plans/<num>-plan.md`, get review, then code.
3. For `effort:S/M`: just code.

### Updating issues mid-work

- **Don't** post routine "still working on it" comments — the PR link is enough.
- **Do** post when you discover something non-obvious that future you (or others) will need:
  - "Tried X, didn't work because of Y, switched to Z"
  - "AC item 3 turned out to be impossible without Q — splitting to follow-up"
  - "Schema changed to support this — see docs/04 PR"

### Closing issues

Issues close automatically when their PR merges with `Closes #N`. Don't manually close — let the merge do it. If a PR merged without auto-close, comment with the PR link and close manually.

## Documentation

`docs/` is **living documentation**. Update it in the same PR as the code change when:

| Type of change | Doc to update |
|---|---|
| New endpoint | `docs/05-api-specification.md` |
| Schema change | `docs/04-database-schema.md` |
| Architectural decision | New ADR in `docs/adr/` + index in `docs/18` |
| New analytics event | `docs/20-analytics-events.md` |
| New feature flag | `docs/21-feature-flags.md` |
| New domain term | `docs/17-glossary.md` |
| Risk discovered | `docs/09-risk-register.md` |

CODEOWNERS auto-requires Tech Lead review for critical docs (architecture, schema, API, security, coding standards, ADRs).

## Definition of Done

See [`docs/15-definition-of-done.md`](docs/15-definition-of-done.md) for the full PR / Feature / Release tiers. Every PR must meet the **PR-tier DoD** before merge.

## Local Setup

See the project README for quick-start commands. The standard stack is:
- Node version pinned in `.nvmrc` — use `nvm use`
- `docker compose up -d` for local Postgres (if applicable)
- `cp .env.example .env` and fill in secrets
- `npx prisma migrate deploy` to apply migrations (if applicable)
- `npm run dev` to start the dev server

## Questions?

Open a discussion or ping the Tech Lead. When in doubt, prefer a draft PR over a polished comment — code is easier to review than prose.
