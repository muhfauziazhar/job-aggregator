# 10 — Test Plan

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | QA Lead |
| Status | Draft |

---

## 1. Strategy

Bias toward critical journeys, security boundaries, and data-correctness:

- **Unit tests** — pure utilities, formatters, validators, API client adapters.
- **Component tests** — UI components in isolation (loading/empty/error/success).
- **Integration tests** — API endpoints, database functions, RLS / authz policies (positive AND negative cases).
- **E2E tests** — full user journeys on the real client against a staging-like backend.
- **Manual QA** — anything that requires a real device, real video/audio, or store review interactions.
- **Load tests** — for endpoints expected under burst load (live events, checkout, search).
- **Chaos / fault injection** — for resilience-critical paths (post-MVP unless required by domain).

---

## 2. Tooling

| Layer | Tool |
|---|---|
| Frontend unit / component | `<Jest + RTL / Vitest>` |
| Mobile E2E | `<Maestro / Detox>` |
| Web E2E | `<Playwright / Cypress>` |
| Backend / Edge functions | `<Deno test / Vitest / pytest>` |
| Database / authz | `<pgTAP / SQL test harness>` |
| Load | `<k6 / Artillery>` |
| Monitoring smoke | Sentry test release + synthetic checks |

---

## 3. Critical Journeys

> One CJ per row. Each maps to one or more user stories. Promoted to E2E test cases.

| ID | Journey | Source story |
|---|---|---|
| CJ-01 | | STORY-01 |
| CJ-02 | | |
| CJ-03 | | |

### CJ-01 — `<title>`

1.
2.
3.

**Acceptance:** all steps complete without errors; required side effects verified.

---

## 4. Authz / RLS Test Matrix

> Every authz boundary needs at least one allow-test and one deny-test.

| Resource | Role: anonymous | Role: authenticated user | Role: admin |
|---|---|---|---|
| `<resource>` read | allow / deny | own only | allow all |
| `<resource>` write | deny | own only | allow all |

Negative cases that must explicitly fail:

-
-

---

## 5. Coverage Targets

| Layer | Target |
|---|---|
| Unit tests | `>= 70%` line coverage |
| Critical paths | 100% covered by integration or E2E tests |
| Authz policies | 100% with positive and negative tests |

---

## 6. Test Data

- Seeded factories for each domain entity.
- Anonymized snapshot of staging data for performance-sensitive testing.
- Real PII never in fixtures.

---

## 7. Release Gates

A release cannot ship if:

- Any critical journey E2E test is red.
- Any authz / RLS test is red.
- Any P0 or P1 bug is open.
- Coverage dropped > 5% in this release.

See full Release DoD: `15-definition-of-done.md`.
