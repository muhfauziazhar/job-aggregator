# 18 — Decision Log

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Tech Lead |
| Status | Living document |

---

## How This Doc Works

This is the **index** of architectural and product decisions. Full rationale lives in individual ADRs at `docs/adr/NNNN-<short-title>.md`.

When to write an ADR:
- Choosing between substitutable technologies (DB, hosting, framework).
- A decision the next team member would naturally ask "why?" about.
- A decision that's hard to reverse later.
- A choice that contradicts the obvious option (and you need to record why).

When NOT to write an ADR:
- Trivial style preferences (those go in `16-coding-standards.md`).
- Easily reversible local choices (file naming, single-component shape).

---

## ADR Index

| ID | Title | Date | Status |
|---|---|---|---|
| [0001](./adr/0001-linkedin-scraping-strategy.md) | LinkedIn scraping strategy (disposable account, listings-only) | 2026-06-18 | Accepted |
| [0002](./adr/0002-threads-inclusion.md) | Threads inclusion scope (signal-only, seed list) | 2026-06-18 | Accepted |
| [0003](./adr/0003-storage-format.md) | Storage format (single normalized table + JSONB raw) | 2026-06-18 | Accepted |

**Status values:** `Proposed` → `Accepted` → `Deprecated` (replaced by another ADR) → `Superseded`.

A `Superseded` ADR stays in the repo. Its replacement links back to it.

---

## Decision Categories (for browsing)

> Update as ADRs accumulate.

### Architecture & Stack

-

### Data Model

-

### Security & Privacy

-

### Operations

-

### Product

-
