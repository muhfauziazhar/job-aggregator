# 09 — Risk Register

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | PM |
| Status | Living document |

---

## How This Doc Works

- New risks added with `R-NN` IDs.
- High and Critical risks get a tracking issue in GitHub (`risk` label) — the issue is the place for ongoing notes; this table is the summary.
- Severity reviewed at each biweekly risk review.

| Severity | Definition |
|---|---|
| **Critical** | Could kill the project or cause material harm (security breach, data loss, regulatory issue) |
| **High** | Could miss MVP date or core success metric |
| **Medium** | Could degrade quality or delay non-critical work |
| **Low** | Nuisance, easily mitigated |

---

## Active Risks

| ID | Risk | Severity | Likelihood | Owner | Mitigation | Trigger / Early Warning |
|---|---|---|---|---|---|---|
| R-01 | Scope grows beyond MVP capacity | High | Medium | PM | Hard milestone exit criteria; defer Won't list | Story count growing in approved milestones |
| R-02 | App Store / store review rejection | High | Medium | PM | Avoid policy hot zones (off-platform commerce, external messengers, undisclosed data collection) | Submission feedback or pre-review legal flag |
| R-03 | Critical vendor SDK incompatible with client framework | High | Medium | TL | Spike in M0; have fallback vendor identified | Spike fails or needs platform fork |
| R-04 | Authz bug leaks private data | Critical | Low | TL | Mandatory positive AND negative authz tests; security review per sensitive PR | Test failure, audit finding |
| R-05 | Cost overrun from variable-pricing services | High | Medium | PM + DevOps | Per-tenant rate limits; daily cost alerts | Cost dashboard breach |
| R-06 | Single-person knowledge silo (bus factor 1) | Medium | Medium | PM | Pair PRs on critical paths; keep ADRs current | One person on 100% of reviews in a domain |
| R-07 | Test coverage degrades during crunch | Medium | High | TL | Coverage gate in CI; no merging red CI | Coverage trend down 2 weeks in a row |
| R-08 | Privacy / data-retention non-compliance | Critical | Low | Legal + TL | PII inventory + retention policy in `13` reviewed each release | New PII field merged without privacy review |
| R-09 | Operator overload on manual processes | Medium | Medium | PO | Track manual-task time; automate when > N hrs/wk | Operator escalation |
| R-10 | Third-party API change breaks production | Medium | Medium | DevOps | Version-pin SDKs; integration tests against sandbox | Vendor changelog or 4xx spike |
| R-11 | Insufficient observability to diagnose prod issue | High | Medium | DevOps | Runbook in `19`; structured logs from day one | MTTR exceeds target |
| R-12 | Build / deploy pipeline outage at release time | Medium | Low | DevOps | Documented manual deploy fallback; rotate keys before expiry | CI vendor incident |

---

## Watchlist (not yet active risks)

-
-

---

## Closed Risks

> Move risks here once retired. Keep for postmortem reference.

| ID | Risk | Outcome | Closed date |
|---|---|---|---|
