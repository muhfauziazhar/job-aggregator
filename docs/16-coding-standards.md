# 16 — Coding Standards

| Field | Value |
|---|---|
| Version | 0.2 |
| Owner | Muhammad Fauzi Azhar |
| Status | Approved |

---

## 1. Stack Standards

| Area | Standard |
|---|---|
| App language | TypeScript, `strict: true`, no implicit `any` |
| Scraper language | Python 3.12, type-hinted, `ruff` + `mypy` |
| Framework | Next.js 16 App Router, `src/` layout |
| Routing | File-based App Router; Route Handlers for API under `src/app/api/` |
| Server state | React Server Components + direct Prisma reads; no client data-fetching lib in MVP |
| Client state | Zustand for filter/UI state; URL query is the source of truth for shareable filters |
| Forms / validation | Zod schemas at every API boundary; shared types inferred from Zod |
| Styling | Tailwind v4; shadcn/ui primitives; no CSS-in-JS |
| ORM | Prisma; raw SQL only for FTS / GIN-backed queries |
| App tests | Vitest + React Testing Library + Playwright |
| Scraper tests | pytest + recorded fixtures |
| Lint / format | ESLint + Prettier (app), ruff (scrapers) |

---

## 2. Type Safety

- Avoid `any` (or `Any`); use narrower types.
- Prefer explicit domain types over inferred shapes for cross-module APIs.
- Validate untrusted input at the boundary (Zod / Pydantic / etc.).
- No non-null assertions unless unavoidable AND commented.

---

## 3. File / Folder Structure

> Defined in `03-architecture.md`. Imports use path aliases for shared modules.

---

## 4. Data Access

- Wrap database calls in service functions or hooks.
- Client never holds privileged credentials; privileged operations go through server functions.
- All mutations return typed results.
- Errors use the standard envelope from `05-api-specification.md`.

---

## 5. Logging

- Never log secret values (DB URL, scraper credentials, proxy URL).
- Use structured logging with stable field names.
- Scraper logs go through a redaction step before being uploaded as CI artifacts.
- Job descriptions may contain incidental third-party names — don't log full descriptions at info level; log job `id` + `source`.

---

## 6. Errors

- Throw / raise typed errors at the boundary; let them propagate.
- Convert to user-readable copy at the UI layer.
- Never swallow errors silently.

---

## 7. Tests

- Test files colocated with code: `foo.ts` + `foo.test.ts` (or framework default).
- One assertion-set per test where reasonable.
- Avoid testing implementation details — assert on behavior.
- Mock at the boundary (HTTP, DB), not at internal modules.

---

## 8. Comments

- Write comments to explain *why*, not *what*.
- TODO comments include an owner and an issue link: `// TODO(@handle, #123): ...`
- Long-form rationale → ADR (`docs/adr/`).

---

## 9. Dependencies

- New top-level dependency requires Tech Lead approval.
- Pin direct dependencies; auto-update via Dependabot / Renovate, reviewed PRs.
- Audit license + maintenance status before adding.

---

## 10. Performance Defaults

- No N+1 queries — use joins / batched fetches.
- Lists virtualized over `<threshold>` items.
- Images served at correct resolution; lazy-loaded below the fold.
- Avoid layout shift on initial render.

---

## 11. Accessibility Defaults

- Every interactive element has an accessible name.
- Color is never the only signal.
- Touch / click targets meet platform minimum size.
- Forms labeled and validated with helpful copy.

---

## 12. Code Review Etiquette

See `CONTRIBUTING.md`.
