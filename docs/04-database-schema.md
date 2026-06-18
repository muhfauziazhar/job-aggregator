# 04 — Database Schema

Postgres (Prisma). Single primary table `jobs` with normalized fields. Raw payloads kept as JSONB for debugging and future re-normalization without re-crawling.

---

## 1. Tables

### `jobs`

Primary table. One row per unique (source, external_id).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Internal id, public-facing in URLs |
| `source` | `text` | `greenhouse` \| `lever` \| `ashby` \| `remoteok` \| `linkedin` \| `threads` |
| `external_id` | `text` | Id from source platform |
| `title` | `text` | Normalized title |
| `company` | `text` | Company name |
| `company_domain` | `text?` | For ATS we know; for LinkedIn, derive |
| `location` | `text` | Free-text location |
| `remote_type` | `enum` | `remote` \| `hybrid` \| `onsite` \| `unknown` |
| `department` | `text?` | From ATS `departments` field |
| `description` | `text` | Plain text, may include HTML stripped |
| `apply_url` | `text` | Direct apply URL |
| `posted_at` | `timestamptz` | From source |
| `expires_at` | `timestamptz?` | When we mark expired |
| `first_seen_at` | `timestamptz` | When we first ingested |
| `last_seen_at` | `timestamptz` | Last successful crawl that saw this job |
| `updated_source_at` | `timestamptz?` | Source's own updated_at |
| `salary_min` | `int?` | Annualized, in `salary_currency` |
| `salary_max` | `int?` | Annualized |
| `salary_currency` | `text?` | ISO 4217 |
| `tier` | `enum` | `intern` \| `entry` \| `mid` \| `senior` \| `staff` \| `principal` \| `unknown` |
| `tech_stack` | `text[]` | Extracted tags: `["go", "postgres", "kubernetes"]` |
| `raw` | `jsonb` | Original source payload for debug |
| `is_expired` | `bool` | Soft-delete marker |

**Indexes:**

- `UNIQUE (source, external_id)` — dedupe key
- `(source, posted_at DESC)` — per-source recent listings
- `(is_expired, posted_at DESC)` WHERE `is_expired = false` — active jobs only
- `gin (tech_stack)` — tech-stack filter
- `gin (to_tsvector('english', title || ' ' || company || ' ' || description))` — full-text search

---

### `scraper_runs`

Operational log of cron executions.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `source` | `text` | Which scraper |
| `started_at` | `timestamptz` | |
| `finished_at` | `timestamptz?` | |
| `status` | `enum` | `running` \| `success` \| `partial` \| `failed` |
| `mode` | `enum` | `full` \| `incremental` |
| `jobs_seen` | `int` | Count of records encountered |
| `jobs_inserted` | `int` | |
| `jobs_updated` | `int` | |
| `jobs_expired` | `int` | |
| `error_message` | `text?` | |
| `metadata` | `jsonb` | Source-specific stats (e.g. pages crawled) |

**Indexes:** `(source, started_at DESC)`.

---

## 2. Migration Strategy

- Prisma migrate; version-controlled migrations in `prisma/migrations/`.
- First deploy seeds schema only — no backfill (scrapers populate `jobs` on first run).
- Adding columns (e.g. `salary_currency` later) = additive migrations, no rewrite needed.

---

## 3. Row Estimates (MVP)

- 6 sources × ~50K active jobs average × 1.5 (post/dedup) ≈ 450K rows active.
- Soft-deleted (expired) grow ~30K/day, GC after 90d = ~2.7M rows max.
- `jobs` table with JSONB ~ 500KB/row → ~1.4 GB at steady state. Comfortable on a small Postgres.
