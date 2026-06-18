# 06 — User Stories

MVP user stories. Each becomes a GitHub issue (seed-issues.sh).

---

## US-01: Browse all jobs on landing page

As a **job seeker**, I want to **see a paginated list of recent jobs on the home page**, so that I can **scan what's available without signing up**.

**Acceptance criteria:**
- [ ] `GET /` renders a table of jobs, newest first
- [ ] Pagination via cursor, 20 per page
- [ ] Each row shows: title, company, location, source badge, posted_at
- [ ] Click row → opens detail page in same tab; "Apply" button opens `apply_url` in new tab

---

## US-02: Filter jobs by source

As a **job seeker**, I want to **filter by source platform** (Greenhouse, Lever, etc.), so that I can **focus on ATS-tracked roles or avoid LinkedIn**.

**Acceptance criteria:**
- [ ] Filter sidebar has checkbox group per source with current counts
- [ ] Selecting sources updates URL query (`?source=greenhouse,lever`)
- [ ] URL query is shareable / bookmarkable

---

## US-03: Filter by remote type

As a **job seeker**, I want to **toggle "Remote only"**, so that I can **skip hybrid/onsite noise**.

**Acceptance criteria:**
- [ ] `?remote=remote` filter
- [ ] Toggle persisted in URL
- [ ] Counts update reactively

---

## US-04: Filter by seniority tier

As a **job seeker**, I want to **filter by tier** (entry/mid/senior/staff), so that I can **avoid listings outside my level**.

**Acceptance criteria:**
- [ ] Tier badges displayed on each card
- [ ] Multi-select tier filter
- [ ] Tier derived from title via classifier (see US-13)

---

## US-05: Filter by tech stack

As a **job seeker**, I want to **filter jobs mentioning specific technologies** (e.g. "Go", "Postgres"), so that I can **find roles matching my stack**.

**Acceptance criteria:**
- [ ] `?tech=go,postgres` filter
- [ ] Multi-tag input with autocomplete
- [ ] Tags derived from description regex (see US-14)

---

## US-06: Full-text search

As a **job seeker**, I want to **search by keyword** across title/company/description, so that I can **find specific roles or companies**.

**Acceptance criteria:**
- [ ] Search bar in header
- [ ] Postgres FTS index used
- [ ] Snippet highlighting in results when matching `description`

---

## US-07: Job detail page

As a **job seeker**, I want to **click a job to see full description**, so that I can **evaluate fit before applying**.

**Acceptance criteria:**
- [ ] `GET /jobs/[id]` renders title, company, source badge, location, full description, salary if available, apply button
- [ ] Description preserves paragraph breaks
- [ ] Open Graph meta tags for share previews

---

## US-08: Source stats page

As a **curious visitor**, I want to **see how many jobs come from each source**, so that I can **trust the data is fresh**.

**Acceptance criteria:**
- [ ] `GET /sources` shows per-source active count + last successful run timestamp + status indicator (green/yellow/red)

---

## US-09: Greenhouse scraper

As a **system**, I want to **ingest jobs from Greenhouse public API**, so that **startup tech roles are covered**.

**Acceptance criteria:**
- [ ] Fetch all companies from `https://boards-api.greenhouse.io/v1/companies`
- [ ] For each company, fetch job list endpoint
- [ ] Upsert into `jobs` table keyed by `(source='greenhouse', external_id)`
- [ ] Records `scraper_runs` row with status

---

## US-10: Lever scraper

As a **system**, I want to **ingest jobs from Lever public API**, so that **startup tech roles are covered**.

**Acceptance criteria:**
- [ ] Fetch from `https://api.lever.co/v0/postings/{company}?mode=json`
- [ ] Handle paginated `next` cursor
- [ ] Upsert into `jobs` table

---

## US-11: Ashby scraper

As a **system**, I want to **ingest jobs from Ashby public API**, so that **AI-startup roles are covered**.

**Acceptance criteria:**
- [ ] Fetch from `https://api.ashbyhq.com/posting-api/job-board/{board}?includeCompensation=true`
- [ ] Parse compensation fields
- [ ] Upsert into `jobs` table

---

## US-12: RemoteOK scraper

As a **system**, I want to **ingest jobs from RemoteOK public JSON**, so that **remote-first roles are covered**.

**Acceptance criteria:**
- [ ] Fetch `https://remoteok.com/api` (no auth)
- [ ] Mark all as `remote_type='remote'`
- [ ] Extract tags → `tech_stack`

---

## US-13: Seniority tier classifier

As a **system**, I want to **tag each job with a seniority tier**, so that the **FE can filter by level**.

**Acceptance criteria:**
- [ ] Title-based classifier (regex weighted keywords: "senior" +3, "staff" +5, "junior" -2, "intern" -5, etc.)
- [ ] Output: `intern | entry | mid | senior | staff | principal | unknown`
- [ ] Confidence threshold for `unknown`

---

## US-14: Tech stack tagger

As a **system**, I want to **extract tech tags from job description**, so that **tech-stack filter works**.

**Acceptance criteria:**
- [ ] Static tag dictionary (50–100 common tags: go, python, rust, postgres, kubernetes, react, etc.)
- [ ] Regex match with word boundaries, case-insensitive
- [ ] Cap at 10 tags per job
- [ ] Tags stored as `text[]` for GIN index

---

## US-15: LinkedIn scraper (dummy account)

As a **system**, I want to **ingest LinkedIn job listings using a dummy account**, so that **non-ATS corporate roles are covered**.

**Acceptance criteria:**
- [ ] Uses `py-linkedin-jobs-scraper` with one dummy account
- [ ] Search queries: ["software engineer", "backend engineer", "frontend engineer", "full stack engineer"]
- [ ] Filters: past-24h, remote-friendly
- [ ] On 429/ban: log to `scraper_runs.error_message`, alert via GH Actions artifact
- [ ] Tier + tech tagger applied same as ATS

---

## US-16: Threads hiring posts scraper

As a **system**, I want to **detect "we're hiring" posts on Threads**, so that we can **surface informal startup job posts**.

**Acceptance criteria:**
- [ ] Targeted: public accounts of known startup founders / engineering leads (small seed list, expandable)
- [ ] Match keywords: "we're hiring", "hiring", "looking for", "DM me", "job opening"
- [ ] Mark source `threads`, `apply_url` = post URL, extract company from post text
- [ ] Manual review queue (out of MVP — just store, human reviews later)

---

## US-17: Cron workflow

As a **system**, I want to **run scrapers every 6 hours via GitHub Actions**, so that **data stays fresh**.

**Acceptance criteria:**
- [ ] `.github/workflows/scraper-cron.yml` runs every 6h
- [ ] Steps: per-source scraper in parallel (matrix), upload logs artifact on failure
- [ ] Secrets: `DATABASE_URL`, `LINKEDIN_EMAIL`, `LINKEDIN_PASSWORD` in repo secrets

---

## US-18: First-run full crawl

As a **system**, I want to **support an initial full crawl**, so that **the DB is populated from zero**.

**Acceptance criteria:**
- [ ] `scraper.py --source <s> --mode full` ingests everything available
- [ ] Idempotent (re-run safe via upsert)
- [ ] Documented in `scrapers/README.md`

---

## US-19: Expire stale jobs

As a **system**, I want to **soft-delete jobs not seen for >30 days**, so that **the FE doesn't show stale listings**.

**Acceptance criteria:**
- [ ] Daily job: `UPDATE jobs SET is_expired=true WHERE last_seen_at < now() - interval '30 days' AND is_expired=false`
- [ ] Filtered out of all API responses by default

---

## US-20: Vercel deploy

As a **system**, I want to **auto-deploy on push to main**, so that **releases are frictionless**.

**Acceptance criteria:**
- [ ] Vercel project linked
- [ ] `DATABASE_URL` set in Vercel env
- [ ] Preview deploys for PRs
- [ ] Production deploy on merge to main
