# 15 — Definition of Done

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Tech Lead + QA |
| Status | Draft |

---

## PR / Story DoD

A PR cannot merge unless:

- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Tests added or updated for new logic
- [ ] Authz / RLS / API changes have positive AND negative tests
- [ ] UI states covered: loading, empty, error, success
- [ ] No service-role key or vendor secret in client/app bundle
- [ ] Accessibility labels for new interactive controls
- [ ] PII checklist passed: no email, auth token, message body, signed URL, payment data, or other PII in logs / breadcrumbs
- [ ] Sentry breadcrumbs reviewed for sensitive data
- [ ] Docs updated if behavior changes (charter, tech reqs, schema, API spec, runbook — whichever applies)
- [ ] PR description honest about what was NOT done

---

## Feature DoD

A feature cannot be considered shipped unless:

- [ ] Acceptance criteria met (from `06-user-stories.md`)
- [ ] Critical journey smoke-tested on at least one real device / browser
- [ ] Works for anonymous AND authenticated users where relevant
- [ ] Works for active AND inactive / suspended states where relevant
- [ ] Error copy is user-readable (no stack traces, no jargon)
- [ ] Analytics event(s) written per `20-analytics-events.md`
- [ ] Admin / moderation behavior considered and implemented
- [ ] Feature flag wired if rollout-gated (`21-feature-flags.md`)

---

## Release DoD

A release cannot tag-and-deploy to production unless:

- [ ] All Must stories for this release are complete
- [ ] All P0 and P1 bugs closed
- [ ] Authz / RLS test suite green
- [ ] Critical journey E2E tests green
- [ ] Performance budgets respected (`02-technical-requirements.md` NFR section)
- [ ] Sentry release configured; sourcemaps uploaded
- [ ] Privacy policy and ToS reflect current behavior
- [ ] Store / platform review notes prepared (if applicable)
- [ ] Rollback plan written and verified (`19-observability-runbook.md`)
- [ ] Backups confirmed within RPO
- [ ] On-call rotation set for the next 7 days
- [ ] Post-release monitoring window (24h) on the calendar
