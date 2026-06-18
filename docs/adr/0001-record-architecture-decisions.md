# ADR 0001: Record architecture decisions

| Field | Value |
|---|---|
| Date | YYYY-MM-DD |
| Status | Accepted |
| Deciders | {{TEAM_LEAD}}, PM |
| Supersedes | — |

---

## Context

We need a lightweight, durable way to record the reasoning behind technical decisions so that:

- Future team members can understand *why* a choice was made.
- Decisions can be revisited with full context, not just hindsight.
- Discussions don't get lost in chat threads or PR comments.

---

## Decision

We adopt **Architecture Decision Records (ADRs)** in the format proposed by Michael Nygard, lightly adapted:

- One ADR per significant decision.
- Numbered sequentially: `NNNN-short-title.md`.
- Stored in `docs/adr/`.
- Indexed in `docs/18-decision-log.md`.
- Each ADR contains: Context, Decision, Consequences, Alternatives Considered.
- Status flows: `Proposed` → `Accepted` → `Deprecated` / `Superseded`.

---

## Consequences

**Positive:**

- Decisions are explicit and findable.
- New team members can self-onboard on rationale.
- Reversing a decision is easier when the original constraints are visible.

**Negative:**

- Small overhead per decision.
- Requires discipline — ADRs only help if they're actually written when decisions are made, not retroactively.

**Neutral:**

- ADRs are markdown, no special tooling required.

---

## Alternatives Considered

- **Decisions captured in PR descriptions.** Rejected: PRs are about code change, not durable rationale; harder to find later.
- **Wiki / Notion / Confluence.** Rejected: drifts from code, easier to forget to update, requires cross-tool context switching.
- **Long-form architecture doc only.** Rejected: monolithic doc gets stale; doesn't capture *why* a decision was made at a specific time.
