# ADR-0002: Threads inclusion scope

**Status:** Accepted
**Date:** 2026-06-18

## Context

Threads (by Meta) hosts many informal "we're hiring" posts from startup founders, eng managers. Aggregating these adds signal that ATS + LinkedIn miss. But:
- Threads has no public API.
- Scraping public web requires login wall circumvention or login-with-cookies.
- Signal-to-noise is low: most posts aren't job-related.

## Decision

- Threads is **signal-only**, not a primary source.
- Approach: scrape a **seed list of known accounts** (founders, eng leaders) for posts matching "we're hiring" / "hiring" / "looking for" keywords.
- Manual review queue: store posts but mark `apply_url` only after human validates (out of MVP — store as-is).
- Lower cadence: 24h cron, not 6h.

## Consequences

**Positive:**
- Captures informal hiring posts that ATS + LinkedIn miss.
- Differentiator — most aggregators don't touch Threads.

**Negative:**
- Meta could block scraping harder than LinkedIn.
- Low ROI for engineering time. May cut in M3 if not paying off.

## Alternatives Considered

- **Drop Threads entirely**: less work, focus engineering on LinkedIn quality. Rejected for now — small effort to keep, big upside if signal works.
- **Full Threads firehose**: too noisy, no way to filter. Rejected.
