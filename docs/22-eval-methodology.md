# 22 — Eval Methodology

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | AI Lead |
| Status | Draft |
| Add-on | AI |

> **AI add-on doc.** Skip this file for projects that don't ship an LLM-powered feature. Required when shipping anything that calls a hosted LLM in production (RAG, agent, generation, classification, scoring).

---

## 1. Why this doc exists

LLM-powered features fail differently from traditional software. Unit tests catch regressions in deterministic logic; they do not catch a prompt change that drops faithfulness from 0.84 to 0.71. This doc defines how we measure quality so every prompt, retrieval, and model change can be answered with a number, not a vibe.

The contract: **no production-bound LLM change ships without a delta against the golden set.**

---

## 2. Golden Dataset

### 2.1 Composition

<!-- Define the dataset that scores everything. Source, size, coverage, refresh cadence. -->

| Property | Value |
|---|---|
| Total Q&A pairs | `<N>` |
| Source | `<exam questions / curated user logs / domain expert authored / public benchmark>` |
| Coverage buckets | `<list>` (e.g., calculation, methodology, regulation, edge cases) |
| Refresh cadence | `<monthly / on each new feature / never frozen>` |
| Storage | `eval/dataset.jsonl` (versioned in repo) |
| Reviewer | `<domain expert name + role>` |

### 2.2 Schema

```jsonl
{
  "id": "q001",
  "question": "...",
  "expected_answer": "...",
  "ground_truth_sources": ["doc_a.pdf#page=4", "doc_b.md#section-2"],
  "expected_tools_used": ["<tool_name>", "..."],
  "category": "<calculation | methodology | regulation | edge>",
  "difficulty": "<easy | medium | hard>",
  "author": "<reviewer initials>",
  "created_at": "YYYY-MM-DD"
}
```

### 2.3 Coverage matrix

<!-- Fill in actual question counts per bucket. The matrix shows blind spots. -->

| Category \ Difficulty | Easy | Medium | Hard | Total |
|---|---:|---:|---:|---:|
| `<bucket A>` |  |  |  |  |
| `<bucket B>` |  |  |  |  |
| `<bucket C>` |  |  |  |  |
| **Total** |  |  |  |  |

---

## 3. Metrics

<!-- Pick the metrics relevant to your system. Document why each one is included. -->

| Metric | Definition | Threshold to ship | Why it matters |
|---|---|---|---|
| **Faithfulness** | Are claims grounded in retrieved sources? | ≥ `<0.80>` | Hallucination guard |
| **Answer Relevancy** | Does answer address the question asked? | ≥ `<0.75>` | Off-topic guard |
| **Context Precision** | Are top-k retrieved chunks relevant? | ≥ `<0.70>` | Retrieval quality |
| **Context Recall** | Do retrieved chunks cover ground truth? | ≥ `<0.65>` | Missing-info guard |
| **Tool Call Accuracy** | Right tool, right args, right order? | ≥ `<0.85>` | Agent loop quality |
| **Citation Validity** | Cited sources actually contain claim? | ≥ `<0.90>` | Trust signal |
| **Cost / query** | Tokens × $/token | ≤ `<$0.005>` | Unit economics |
| **Latency p95** | Wall-clock from query to last token | ≤ `<3s>` | UX bar |

---

## 4. Eval Harness

### 4.1 Run command

```bash
make eval                  # full run against current main
make eval QUICK=1          # 10-question smoke test for PR-level CI
make eval DIFF=baseline    # delta against last frozen baseline
```

### 4.2 Output artifacts

- `eval/results/<run-id>/summary.md` — human-readable report
- `eval/results/<run-id>/per_question.jsonl` — full traces
- `eval/results/<run-id>/cost_breakdown.json` — token + dollar accounting
- Langfuse trace links per question (when configured)

### 4.3 Where evals run

| Stage | Trigger | Cost cap | Action on regression |
|---|---|---|---|
| Local dev | manual | `<$0.20/run>` | Engineer decides |
| PR CI | on label `eval-required` | `<$1/run>` | Block merge if any metric drops > 5pt |
| Nightly | cron | `<$5/run>` | Slack alert + GitHub issue |
| Pre-release | tag push | `<$10/run>` | Required green to ship |

---

## 5. Domain Expert Validation

<!-- For domain-sensitive systems (medical, legal, financial, actuarial), self-rated golden sets are insufficient. Document who reviews and how often. -->

| Property | Value |
|---|---|
| Domain expert | `<name + role + relationship>` |
| Review cadence | `<every N questions / monthly / per feature>` |
| Review SOP | See `26-validation-process.md` |
| Sign-off artifact | `eval/sign-off/<YYYY-MM-DD>-<expert>.md` |

---

## 6. Comparison Studies

<!-- Use this section to plan the ablations that turn into blog posts. -->

Planned comparisons:

- [ ] Baseline (dense retrieval only) vs hybrid vs hybrid+rerank
- [ ] `<model A>` vs `<model B>` vs `<model C>` on same prompts
- [ ] Prompt v1 vs v2 vs v3 on faithfulness
- [ ] Tool-calling agent vs single-shot RAG
- [ ] Our system vs `<reference competitor>` on golden subset

Each comparison ships with a `eval/studies/<study-name>.md` write-up.

---

## 7. Anti-patterns to avoid

- **Eval set built only by author.** Bias guaranteed. Always have a second pair of eyes.
- **Metrics that only go up.** If your eval can't fail, it's not measuring anything.
- **No cost tracking.** A "better" answer at 10× the cost is rarely better.
- **Frozen dataset.** Real users surface failure modes the original set won't catch. Add new failures monthly.
- **Eval results only in CI logs.** Publish to a markdown table reviewers can scan in 30 seconds.

---

## 8. Open Questions

<!-- Track unresolved methodology decisions here so they don't get lost. -->

-
-
-
