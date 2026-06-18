# ADR-0003: Storage format — single normalized table + JSONB raw

**Status:** Accepted
**Date:** 2026-06-18

## Context

Need to store jobs from 6 sources with overlapping but non-identical fields. Three options:

1. **One table per source** (6 tables). Pros: source-accurate schemas. Cons: API queries need unions, dedupe is cross-table join, schema migrations are 6×.
2. **Single normalized table, drop source-specific fields.** Pros: simple queries. Cons: lose data; can't re-normalize if classifier improves.
3. **Single normalized table + JSONB `raw` column.** Pros: simple queries, retain original data, re-normalize offline without re-crawling. Cons: JSONB queries slower (acceptable for debug).

## Decision

Single `jobs` table with normalized columns + `raw jsonb` column. Indexes on `(source, external_id)` unique and `(is_expired, posted_at)`.

## Consequences

**Positive:**
- One query for the FE.
- Future-proof: if tier classifier improves, we can re-process `raw` without re-crawling.
- Migrations are simple.

**Negative:**
- Schema drift: if a source adds a field we care about, we add a column once.
- Storage slightly larger due to `raw`. Acceptable at MVP scale (~1.4 GB).

## Alternatives Considered

- **Per-source tables**: rejected — operationally heavy.
- **Pure JSONB (no columns)**: rejected — query performance for filters (tech, tier, salary range) needs indexed columns.
