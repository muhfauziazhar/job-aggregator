# 15 — Definition of Done

| Field | Value |
|---|---|
| Version | 0.2 |
| Owner | Muhammad Fauzi Azhar |
| Status | Approved |

---

> No auth, no PII accounts, no app store → those checklist items are dropped vs the generic template. Data correctness, scraper resilience, and secret hygiene replace them.

## PR / Story DoD

A PR cannot merge unless:

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] Tests added/updated for new logic
- [ ] New scraper source ships a **contract test** against a recorded fixture (`10-test-plan.md` §4)
- [ ] New core logic (classifier/tagger/normalizer) has unit tests
- [ ] UI states covered: loading, empty, error, populated
- [ ] No secret value in client bundle or committed files
- [ ] Accessibility labels on new interactive controls
- [ ] No third-party user PII introduced into storage (only job listings)
- [ ] Docs updated if behavior changes (schema, API spec, runbook, risk register — whichever applies)
- [ ] PR description honest about what was NOT done

---

## Feature DoD

A feature cannot be considered shipped unless:

- [ ] Acceptance criteria met (`06-user-stories.md`)
- [ ] Critical journey smoke-tested in at least one real browser
- [ ] Works on mobile (360px) and desktop widths
- [ ] Error copy is user-readable (no stack traces)
- [ ] For scrapers: a full run populates `jobs` and writes a `scraper_runs` row with correct counts

---

## Release DoD

A release cannot deploy to production unless:

- [ ] All Must stories for the milestone complete
- [ ] All P0 bugs closed
- [ ] Critical-journey E2E tests green
- [ ] Scraper contract + data-integrity tests green
- [ ] Performance budgets respected (`02-technical-requirements.md` §2.1)
- [ ] Sentry release configured
- [ ] Public API rate-limit verified active
- [ ] Secret scan clean; no secret in bundle
- [ ] README disclaimer + source attribution intact
- [ ] DB snapshot confirmed within RPO (`< 24h`)
- [ ] Rollback plan verified (`19-observability-runbook.md`)
