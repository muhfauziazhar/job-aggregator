# 16 — Coding Standards

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Tech Lead |
| Status | Draft |

---

## 1. Stack Standards

> Adapt to actual stack. The point is to make these explicit so onboarding is fast.

| Area | Standard |
|---|---|
| Language | `<TypeScript strict / Python type-hinted / etc.>` |
| Framework | {{TECH_STACK}} |
| Routing | |
| Server state | |
| Client state | |
| Forms / validation | |
| Styling | |
| Tests | |
| Lint / format | |

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

## 5. Privacy & Logging

- Never log PII (see `13-security-compliance.md`).
- Use structured logging with stable field names.
- Logs go through one redaction layer before leaving the process.
- For LLM / AI calls: never log full prompts that may contain user content; log hashes / IDs. When the AI add-on is enabled, prompt versioning, agent loop conventions, and PII handling for LLM payloads are documented in `23-prompts.md`, `24-agent-architecture.md`, and `27-data-governance.md` respectively.

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
