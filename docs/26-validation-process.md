# 26 — Validation Process

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | AI Lead + Domain Expert |
| Status | Draft |
| Add-on | AI |

> **AI add-on doc.** Skip this file for projects without domain-sensitive output. Required when LLM output is consumed for decisions in regulated or expertise-sensitive contexts (medical, legal, financial, actuarial, safety-critical engineering). Eval metrics measure consistency; expert validation establishes correctness.

---

## 1. Why this doc exists

Eval metrics tell you whether your system behaves consistently. They do not tell you whether it is **right**. In domains where being wrong has regulatory or professional consequences, a domain expert review is the only way to certify correctness. This doc names that expert, defines their commitment, and describes the SOP that turns their judgment into a reproducible quality gate.

---

## 2. Domain Expert(s)

<!-- A clear name and contract. Without commitment, the project stalls in the eval phase. -->

| Property | Value |
|---|---|
| Primary expert | `<name>` |
| Role / title | `<title>`, `<organization>` (relationship: `<family / colleague / contractor>`) |
| Domain expertise | `<years and specific niches>` |
| Time commitment | `<X hours / month>` over project duration |
| Engagement type | `<volunteer / paid / equity>` |
| Backup expert | `<name or "none — single point of failure">` |

### 2.1 Locked commitments

Before development starts in earnest, the expert agrees to deliver:

- [ ] **`<N>` golden Q&A authored or reviewed**
- [ ] **`<M>` validation review sessions** (~`<X>` hours each, scheduled in advance)
- [ ] **`<K>` LinkedIn / public endorsement post** at launch
- [ ] **Clarification turnaround**: `<24h business / async OK>` for ad-hoc questions

Without these locked, treat the project as unvalidated and document accordingly.

---

## 3. Review SOP

### 3.1 Sample selection

For each review session, the AI Lead prepares:

| Source | Count | Selection rule |
|---|---|---|
| Random sample of recent prod queries | `<N>` | Stratified by category from `22-eval-methodology.md` § 2.3 |
| Failed eval cases (metric below threshold) | `<M>` | All from last run |
| Suspicious cases flagged by users | `<K>` | All since last review |
| Reviewer-chosen edge cases | `<L>` | At expert's discretion |

### 3.2 Review form

For each sample, the expert answers:

| Field | Possible values |
|---|---|
| **Correctness** | Correct / Partially correct / Incorrect |
| **Citation validity** | All valid / Some invalid / All invalid / N/A |
| **Tone appropriateness** | Appropriate / Off / N/A |
| **Reasoning quality** | Sound / Plausible / Flawed |
| **Severity if wrong** | Low (cosmetic) / Medium (misleading) / High (decision-impacting) / Critical (regulatory) |
| **Comments** | Free text |
| **Suggested fix** | Free text or "see prompts.md" |

### 3.3 Output

Each review produces a sign-off artifact:

```
eval/sign-off/<YYYY-MM-DD>-<expert-initials>.md
```

containing the per-sample form data, aggregate stats, and a one-paragraph executive summary.

---

## 4. Severity Classification

<!-- Standardize how we treat findings of different severity, so triage is consistent across reviews. -->

| Severity | Definition | Response time | Required action |
|---|---|---|---|
| **Critical** | Output could cause regulatory violation or unsafe decision | 24 h | Hot-fix, all-hands incident, post-mortem |
| **High** | Output is misleading enough to cause a wrong decision | 1 week | Prompt or retrieval fix in next release |
| **Medium** | Output is partially wrong but recoverable in context | Next sprint | Track in `eval` issues |
| **Low** | Cosmetic or tone issue | Backlog | Group with similar issues |

---

## 5. Disagreement Resolution

When the AI Lead and expert disagree on a finding:

1. **Document both positions** in the sign-off doc
2. **Default to the more conservative** action (the one that would catch more failure modes)
3. **Open a research item** in `docs/spikes/` to investigate further
4. **Escalate to a second expert** if the disagreement is foundational (re-litigates the system's purpose)

---

## 6. Validation Cadence

| Phase | Cadence | Sample size |
|---|---|---|
| Pre-MVP (Phase 0–2 of `07-roadmap-timeline.md`) | One-off baseline review | `<10>` |
| MVP development | Bi-weekly | `<20>` |
| Pre-launch | One-off launch sign-off | `<50>` |
| Post-launch | Monthly | `<30>` |
| Ad-hoc | On user-flagged issue | All flagged |

---

## 7. Public Communication

<!-- What can and cannot be said publicly about expert validation. -->

| OK to say publicly | Not OK to say publicly |
|---|---|
| Generic title (e.g. "Senior Actuary at a Top-5 Indonesian insurer") | Expert's full name without explicit consent post |
| Aggregate metrics (e.g. "94% rated correct or partially correct") | Per-sample reviewer comments |
| Methodology of the review process | Identifying details of any production query |
| The published sign-off doc | Internal disagreements |

If the expert plans to publicly endorse, agree on the post wording in advance and grant approval rights.

---

## 8. Anti-patterns

- **Self-validation.** "I checked it myself and it looks right" is not validation in a regulated domain.
- **Single review at launch only.** Drift happens; cadence prevents it.
- **Verbal-only feedback.** If it isn't in `eval/sign-off/`, it didn't happen.
- **Treating the expert as a free QA service.** Respect time boundaries; pay if needed.
- **Confusing eval and validation.** Eval = consistency. Validation = correctness.

---

## 9. Open Questions

-
-
