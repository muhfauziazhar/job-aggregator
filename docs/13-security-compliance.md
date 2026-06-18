# 13 — Security, Privacy & Legal

| Field | Value |
|---|---|
| Version | 0.2 |
| Owner | Muhammad Fauzi Azhar |
| Status | Approved |

---

> **Threat model note:** This is a **public, no-auth, read-only** web app. There are no user accounts, no user-submitted PII, no payments, no app-store distribution. The security surface is therefore small and unusual: the main concerns are (1) protecting infrastructure secrets, (2) abuse of the public API, (3) the legal/ethical posture of scraping, and (4) not accidentally storing third-party PII. Classic auth/RLS/account-PII concerns do **not** apply in MVP.

---

## 1. Security Principles

- No auth surface in MVP → no session, cookie, or credential handling on the client.
- All infrastructure secrets (`DATABASE_URL`, LinkedIn creds, proxy URL) live in GH Actions secrets / Vercel env, never in the repo or client bundle.
- Public API is read-only. No endpoint mutates data from client input.
- Scrapers run server-side / in CI only — credentials never reach the browser.
- All transport TLS 1.2+.
- Dependencies scanned (Dependabot); high/critical findings block release.

---

## 2. Secrets Inventory

| Secret | Used by | Stored in | Rotation |
|---|---|---|---|
| `DATABASE_URL` | App + scrapers | Vercel env + GH Actions secret | On suspected leak |
| `LINKEDIN_EMAIL` / `LINKEDIN_PASSWORD` | LinkedIn scraper | GH Actions secret | If account banned |
| `RESIDENTIAL_PROXY_URL` (optional) | LinkedIn scraper | GH Actions secret | Per provider |
| `SENTRY_DSN` | App | Vercel env | Rarely |

**Rules:**
- Never echo secret values in logs or CI output.
- `.env.local` is gitignored; `.env.example` ships with key names only, no values.
- Scraper logs must redact credentials before upload as artifacts.

---

## 3. Data We Store (and the PII boundary)

We store **job listings**, which are public business postings — not personal data. However, some fields can incidentally contain PII:

| Field | PII risk | Handling |
|---|---|---|
| `company`, `title`, `location` | None | Stored as-is |
| `apply_url` | None | Stored as-is |
| `description` | **Low** — may name a hiring manager / recruiter | Stored; not indexed for people-search; no enrichment |
| Threads `raw` payload | **Low–Medium** — post author handle | Store handle only as attribution; never scrape author profile/contact |

**Hard rules:**
- We do **not** scrape, store, or enrich LinkedIn/Threads **user profiles**, connections, or contact info — only job listings / hiring posts. (ADR-0001, ADR-0002.)
- We do **not** build people-search or contact-extraction features.
- If a takedown is requested for a specific listing/post, we remove it within 7 days.

---

## 4. Legal & Ethical Posture (scraping)

| Source | Basis | Risk | Posture |
|---|---|---|---|
| Greenhouse / Lever / Ashby | Public job-board APIs intended for consumption | Low | Primary, fully supported |
| RemoteOK | Public API (`/api`), attribution-friendly | Low | Primary; honor their attribution ask |
| LinkedIn | Public listings; TOS forbids automation | Medium-High | Disposable account, rate-capped, listings-only (ADR-0001) |
| Threads | Public posts; no API | Medium | Seed-list, keyword-filtered, signal-only (ADR-0002) |

- US precedent (*hiQ v. LinkedIn*) supports scraping public data, but contractual TOS still applies — hence disposable account + low volume + listings-only.
- Prominent disclaimer in README + ADR-0001.
- We never republish scraped content as our own; we link back to the source `apply_url`.

---

## 5. Public API Abuse Mitigation

- IP rate-limit: 60 req/min, burst 100 (NFR-SEC-04).
- No bulk-export endpoint; pagination capped at 100/page.
- Cache hot queries at the edge to absorb spikes.
- 429 with `Retry-After` on breach.

---

## 6. Compliance

| Regulation | Applies? | Notes |
|---|---|---|
| GDPR | Marginal | No EU user accounts; job data is public business data. Honor erasure requests for incidental PII in descriptions. |
| CCPA | Marginal | Same — no sale of personal data, no user accounts. |
| HIPAA / PCI-DSS | No | No health or card data. |

---

## 7. Vulnerability Response

- Disclosure via private GitHub Security Advisory.
- Acknowledge within 48h; patch critical within 7 days.

---

## 8. Release Security Checklist

- [ ] No secret value committed to repo or present in client bundle (verified via build inspection + secret scan)
- [ ] `.env.example` has key names only, no values
- [ ] Scraper logs redact credentials before artifact upload
- [ ] Public API rate-limit active and tested
- [ ] No new feature scrapes or stores user profiles / contact info
- [ ] Dependency + secret scan clean
- [ ] Disclaimer + attribution intact in README
