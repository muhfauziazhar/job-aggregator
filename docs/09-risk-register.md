# 09 — Risk Register

| Field | Value |
|---|---|
| Version | 0.2 |
| Owner | Muhammad Fauzi Azhar |
| Status | Living document |

---

## How This Doc Works

- New risks added with `R-NN` IDs.
- High and Critical risks get a tracking issue in GitHub (`type:risk` label).
- Severity reviewed each milestone wrap.

| Severity | Definition |
|---|---|
| **Critical** | Could kill the project or cause legal / data harm |
| **High** | Could miss MVP date or a core success metric |
| **Medium** | Could degrade quality or delay non-critical work |
| **Low** | Nuisance, easily mitigated |

---

## Active Risks

| ID | Risk | Severity | Likelihood | Mitigation | Trigger / Early Warning |
|---|---|---|---|---|---|
| R-01 | LinkedIn bans the dummy account / IP | High | High | Disposable account; 50–100 req/h cap; residential proxy fallback; scraper isolated so it can be disabled without affecting ATS sources | 429s, login challenge, empty results |
| R-02 | LinkedIn / Threads HTML or API shape changes, breaks scraper | High | High | Source adapters isolated in `scrapers/sources/`; integration test per source; raw payload stored so failures are diagnosable | Parse errors, `jobs_inserted=0` on a run |
| R-03 | ATS public API rate-limits or blocks us (esp. Workday) | Medium | Medium | Respect `Retry-After`; backoff; spread crawl over time; Workday deferred post-MVP | 429 spike in `scraper_runs.error_message` |
| R-04 | Legal / TOS challenge (LinkedIn, Threads) | High | Low | Only public job listings, never profile/PII; prominent disclaimer (ADR-0002); takedown-on-request policy; ATS sources are the legal backbone | Cease-and-desist, account legal notice |
| R-05 | Data staleness — listings expire faster than crawl cadence | Medium | Medium | 6h cron; soft-delete > 30 days; surface freshness on `/sources` so users can judge | p50 freshness > 12h on stats page |
| R-06 | Cross-source duplicates inflate listing count | Medium | High | Dedupe on `(title, company, location)` normalized key; cross-source flag (NFR-DATA-02) | Same role visible 3+ times in UI |
| R-07 | Scope creep beyond MVP (auth, alerts, auto-apply) | High | Medium | Hard milestone exit criteria; Won't list in doc 02; charter non-goals | Issues created outside milestone scope |
| R-08 | Cost overrun (DB egress, proxy, Vercel functions) | Medium | Low | Free-tier-first; $20/mo ceiling; cost check at each milestone wrap (doc 12) | Vercel/Neon usage alert |
| R-09 | Bus factor 1 (solo maintainer) | Medium | High | ADRs + living docs keep rationale findable; scrapers independent so partial failure ≠ total failure | — |
| R-10 | Public API abused as a free scraping backend | Medium | Medium | IP rate-limit 60 req/min; cache hot queries; no bulk export endpoint | Traffic spike from single IP/ASN |
| R-11 | Greenhouse/Lever company discovery is incomplete (we only crawl boards we know) | Medium | Medium | Seed company list + community-contributed list; crowd-source via GitHub issues | Coverage plateaus below target |
| R-12 | GH Actions cron unreliable / skipped under load | Low | Medium | `workflow_dispatch` manual fallback; alert on missed run; self-host cron on VM if persistent | No `scraper_runs` row in expected window |

---

## Watchlist (not yet active)

- Postgres table bloat from `raw` JSONB at scale → revisit partitioning / archival if > 5 GB.
- Threads signal ROI too low → may cut in M3 (ADR-0002).

---

## Closed Risks

| ID | Risk | Outcome | Closed date |
|---|---|---|---|
| — | | | |
