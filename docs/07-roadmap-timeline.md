# 07 — Roadmap & Timeline

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | PM |
| Status | Draft |

---

## 1. Phasing Approach

Each milestone has:
- A **theme** (one sentence).
- An **exit criteria** list — concrete, demonstrable.
- A set of stories (from `06-user-stories.md`) it delivers.

When a milestone is approved here, the PM creates a matching **GitHub Milestone** with a due date and assigns its stories.

---

## 2. Milestones

### M0 — Project Setup & Spike

**Theme:** Validate critical technical assumptions before writing product code.

**Duration:** ~1–2 weeks

**Includes:**

- Repo / CI / environments bootstrapped
- Auth provider configured
- Risky integration spikes (`docs/spikes/`) for any vendor that hasn't been used by the team before
- Initial schema + seed data

**Exit Criteria:**

- [ ] App builds and runs locally for every engineer
- [ ] Staging deploy works end-to-end (even if app shows "Hello world")
- [ ] All P0 spikes have documented findings (pass/fail/conditional)
- [ ] All vendor accounts and API keys provisioned

---

### M1 — `<Theme>`

**Theme:**

**Duration:**

**Includes:**

-

**Exit Criteria:**

- [ ]

---

### M2 — `<Theme>`

---

### M3 — `<Theme>`

---

### MN — `<MVP Release>`

**Theme:** Ready for first real users.

**Exit Criteria:**

- [ ] All Must stories complete (`06-user-stories.md`)
- [ ] All P0/P1 bugs closed
- [ ] Release DoD passed (`15-definition-of-done.md`)
- [ ] Privacy policy + ToS live
- [ ] Rollback plan documented in `19-observability-runbook.md`
- [ ] Sponsor sign-off

---

## 3. Timeline (Gantt)

```mermaid
gantt
  title {{PRODUCT_NAME}} Roadmap
  dateFormat YYYY-MM-DD
  section Foundation
    M0 Setup & Spike       :m0, 2026-MM-DD, 14d
    M1 <Theme>             :m1, after m0, 21d
  section Build
    M2 <Theme>             :m2, after m1, 28d
    M3 <Theme>             :m3, after m2, 21d
  section Release
    MN Release Candidate   :mn, after m3, 14d
```

---

## 4. Capacity Assumption

Roadmap assumes the team described in `08-team-raci.md`. Slippage on a milestone triggers a re-plan, not silent overflow into the next.

---

## 5. Decision Triggers

| Trigger | Action |
|---|---|
| Spike fails during M0 | Re-evaluate architecture (`03`) and stack choice; may delay M1 |
| Pilot < target sellers/users by end of M`<n>` | Pause feature work, focus on acquisition |
| Critical security/privacy issue | Halt next release, fix-and-verify before resuming |
