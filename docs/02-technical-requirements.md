# 02 — Technical Requirements

| Field | Value |
|---|---|
| Version | 0.2 |
| Owner | Muhammad Fauzi Azhar |
| Status | Approved |

---

## 1. Functional Requirements

Priority: **Must** (MVP gate) / **Should** (preferred) / **Could** (nice-to-have) / **Won't** (excluded this version).

### 1.1 Job Seeker (primary user, anonymous)

| ID | Requirement | Priority |
|---|---|---|
| FR-SEEK-01 | Browse a paginated list of active jobs, newest first | Must |
| FR-SEEK-02 | Open a job detail view with full description and apply link | Must |
| FR-SEEK-03 | Filter by source platform (Greenhouse, Lever, etc.) | Must |
| FR-SEEK-04 | Filter by remote type (remote / hybrid / onsite) | Must |
| FR-SEEK-05 | Filter by seniority tier (intern…principal) | Must |
| FR-SEEK-06 | Filter by tech-stack tags | Must |
| FR-SEEK-07 | Full-text keyword search across title/company/description | Must |
| FR-SEEK-08 | Share / bookmark a filtered view via URL | Should |
| FR-SEEK-09 | View per-source freshness + count on a stats page | Should |
| FR-SEEK-10 | Filter by company name | Could |
| FR-SEEK-11 | Filter by posted-date window | Could |

### 1.2 Scraper / Ingestion (system actor)

| ID | Requirement | Priority |
|---|---|---|
| FR-SCRAPE-01 | Ingest jobs from Greenhouse public API | Must |
| FR-SCRAPE-02 | Ingest jobs from Lever public API | Must |
| FR-SCRAPE-03 | Ingest jobs from Ashby public API (with compensation) | Must |
| FR-SCRAPE-04 | Ingest jobs from RemoteOK public JSON | Must |
| FR-SCRAPE-05 | Ingest LinkedIn jobs via dummy account, rate-capped | Should |
| FR-SCRAPE-06 | Detect Threads "we're hiring" posts from a seed list | Could |
| FR-SCRAPE-07 | Upsert keyed on `(source, external_id)` — idempotent | Must |
| FR-SCRAPE-08 | Support `--mode full` and `--mode incremental` | Must |
| FR-SCRAPE-09 | Soft-delete jobs unseen > 30 days | Must |
| FR-SCRAPE-10 | Record each run in `scraper_runs` (status, counts, duration) | Must |
| FR-SCRAPE-11 | Classify seniority tier from title | Must |
| FR-SCRAPE-12 | Extract tech-stack tags from description | Must |

### 1.3 Public API

| ID | Requirement | Priority |
|---|---|---|
| FR-API-01 | `GET /api/jobs` with filter/sort/cursor-paginate | Must |
| FR-API-02 | `GET /api/jobs/:id` single job | Must |
| FR-API-03 | `GET /api/sources` per-source counts + run status | Should |
| FR-API-04 | `GET /api/stats` aggregate stats | Should |
| FR-API-05 | Validate all query params with Zod; 400 on invalid | Must |
| FR-API-06 | Rate-limit anonymous IPs (60 req/min) | Should |

### 1.4 Won't (explicitly out of scope this version)

| ID | Excluded | Why |
|---|---|---|
| FR-WONT-01 | User accounts / authentication | No personalization in MVP |
| FR-WONT-02 | Auto-apply / application tracking | Against charter |
| FR-WONT-03 | Email / push alerts | Post-MVP (M3) |
| FR-WONT-04 | Indonesian-language sources | Post-MVP (M3) |

---

## 2. Non-Functional Requirements

### 2.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | API p95 latency (`GET /api/jobs`) | `< 500ms` |
| NFR-PERF-02 | Job list first contentful paint (4G) | `< 2.5s` |
| NFR-PERF-03 | Lighthouse Performance (mobile) | `>= 85` |
| NFR-PERF-04 | Scraper full crawl per ATS source | `< 30 min` |
| NFR-PERF-05 | Scraper incremental crawl per source | `< 5 min` |

### 2.2 Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-REL-01 | App uptime (production) | `99%` monthly |
| NFR-REL-02 | Cron success rate (7-day window) | `>= 95%` |
| NFR-REL-03 | Median data freshness (p50 last-crawled) | `< 12h` |
| NFR-REL-04 | DB recovery point objective (RPO) | `< 24h` (daily snapshot) |

### 2.3 Security & Abuse

| ID | Requirement |
|---|---|
| NFR-SEC-01 | No auth surface in MVP — public read-only API only |
| NFR-SEC-02 | `DATABASE_URL` and scraper credentials in GH Actions / Vercel secrets, never in client bundle |
| NFR-SEC-03 | All traffic over HTTPS / TLS 1.2+ |
| NFR-SEC-04 | Public API rate-limited to deter scraping-of-the-scraper |
| NFR-SEC-05 | Scraper respects source rate limits and `Retry-After` |

### 2.4 Data Integrity

| ID | Requirement |
|---|---|
| NFR-DATA-01 | No duplicate jobs within a source (unique `(source, external_id)`) |
| NFR-DATA-02 | Cross-source near-duplicates flagged (same title+company+location) |
| NFR-DATA-03 | Raw source payload retained in `jobs.raw` for re-normalization |

### 2.5 Accessibility

| ID | Requirement |
|---|---|
| NFR-A11Y-01 | All interactive elements have accessible labels |
| NFR-A11Y-02 | Color contrast meets WCAG AA |
| NFR-A11Y-03 | Job list + filters operable via keyboard |

### 2.6 Observability

| ID | Requirement |
|---|---|
| NFR-OBS-01 | App errors flow to Sentry (or equivalent) |
| NFR-OBS-02 | Every scraper run logged to `scraper_runs` table |
| NFR-OBS-03 | Failed cron runs upload logs as GH Actions artifact + open an issue |

### 2.7 Compatibility

| ID | Requirement |
|---|---|
| NFR-COMPAT-01 | Web: last 2 versions of Chrome, Firefox, Safari, Edge |
| NFR-COMPAT-02 | Responsive: usable from 360px (mobile) to 1920px (desktop) |

---

## 3. Constraints

- Web-only. No native mobile app.
- Single region (US-East) for MVP. Multi-region post-MVP.
- Free-tier-first: Vercel + Neon + GH Actions. Budget ceiling $20/mo (see doc 12).
- Python 3.12 for scrapers, Node 20+ for app.

---

## 4. Open Questions

| ID | Question | Owner | Due |
|---|---|---|---|
| OQ-01 | Neon vs Vercel Postgres vs self-host on existing VM (43.129.53.34)? | Fauzi | M0 |
| OQ-02 | Rate-limit store: Upstash Redis vs in-memory single-region? | Fauzi | M1 |
| OQ-03 | LinkedIn: single dummy account enough, or proxy pool needed? | Fauzi | M2 |
