# 10 — Test Plan

| Field | Value |
|---|---|
| Version | 0.2 |
| Owner | Muhammad Fauzi Azhar |
| Status | Approved |

---

## 1. Strategy

Bias toward **data correctness** (the product is only as good as its data) and **scraper resilience** (sources break often). Auth/RLS testing is N/A — there's no auth.

- **Unit tests** — normalizers, tier classifier, tech tagger, filter parsing (URL ↔ query), salary extraction.
- **Component tests** — UI components in isolation (loading / empty / error / populated).
- **Integration tests** — API endpoints against a test Postgres; scraper adapters against recorded fixtures.
- **E2E tests** — critical browsing journeys via Playwright on a seeded DB.
- **Scraper contract tests** — each source adapter parses a saved real-response fixture into the normalized shape.
- **Manual QA** — LinkedIn/Threads scrapers (live, fragile, rate-limited — can't run in CI).

---

## 2. Tooling

| Layer | Tool |
|---|---|
| App unit / component | Vitest + React Testing Library |
| Web E2E | Playwright |
| API integration | Vitest + test Postgres (Docker / Neon branch) |
| Scraper unit / contract | pytest + recorded JSON fixtures |
| Scraper live (manual) | pytest marked `@pytest.mark.live`, run locally only |

---

## 3. Critical Journeys (→ E2E)

| ID | Journey | Source story |
|---|---|---|
| CJ-01 | Land on `/`, see jobs, paginate to page 2 | US-01 |
| CJ-02 | Filter by source + remote + tier, URL updates, results match | US-02/03/04 |
| CJ-03 | Search a keyword, open a result detail, click Apply (new tab) | US-06/07 |
| CJ-04 | Filter by tech tag, share URL, reopen → same filtered state | US-05/08 |

### CJ-01 — Browse and paginate

1. Visit `/`.
2. Assert ≥ 20 job rows render, newest first.
3. Click "next page".
4. Assert a new set of rows, cursor in URL.

**Acceptance:** no console errors; rows have title/company/location/source badge.

---

## 4. Scraper Contract Tests (the important bit)

Every source adapter must have a test that feeds a **recorded real response** and asserts the normalized output:

| Source | Fixture | Asserts |
|---|---|---|
| Greenhouse | `fixtures/greenhouse_board.json` | title, company, apply_url, posted_at mapped |
| Lever | `fixtures/lever_postings.json` | pagination cursor handled; fields mapped |
| Ashby | `fixtures/ashby_board.json` | compensation → salary_min/max/currency |
| RemoteOK | `fixtures/remoteok_api.json` | all marked remote; tags → tech_stack |
| LinkedIn | `fixtures/linkedin_search.json` | title/company/location mapped; tier+tech applied |
| Threads | `fixtures/threads_posts.json` | keyword filter; company extracted; apply_url = post |

Plus pure-logic unit tests:
- Tier classifier: table of `(title → expected tier)` covering intern…principal + ambiguous → `unknown`.
- Tech tagger: `(description → expected tags)`, word-boundary correctness (e.g. "Java" ≠ "JavaScript"), 10-tag cap.
- Dedupe key normalization: case/whitespace/punctuation collapse.

---

## 5. Data-Integrity Tests

- Upsert is idempotent: run same fixture twice → row count unchanged, `last_seen_at` updated.
- Expire job: set `last_seen_at` 31 days ago → expire job → excluded from `/api/jobs`.
- Unique constraint: two records same `(source, external_id)` → one row.

---

## 6. Coverage Targets

| Layer | Target |
|---|---|
| Normalizer / classifier / tagger | `>= 90%` (core logic) |
| API route handlers | `>= 80%` |
| Critical journeys | 100% via E2E |
| UI components | `>= 60%` |

---

## 7. Test Data

- Recorded source-response fixtures committed under `scrapers/tests/fixtures/` and `src/__tests__/fixtures/`.
- Seed script populates a test DB with ~200 synthetic jobs across all sources/tiers for E2E.
- No real third-party PII in fixtures — scrub recruiter names from saved descriptions.

---

## 8. Release Gates

A release cannot ship if:

- Any critical-journey E2E test is red.
- Any scraper contract test is red.
- Any data-integrity test is red.
- Any P0 bug is open.
- Coverage on core logic dropped below 90%.

See Release DoD: `15-definition-of-done.md`.
