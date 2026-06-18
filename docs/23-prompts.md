# 23 — Prompts

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | AI Lead |
| Status | Draft |
| Add-on | AI |

> **AI add-on doc.** Skip this file for projects without LLM features. The prompt is product spec for an LLM-powered system — it deserves the same versioning rigor as `05-api-specification.md`.

---

## 1. Why this doc exists

A prompt change is a behavior change. Without a registry, prompts drift across files, copy-paste errors creep in, and rollback is guesswork. This doc is the canonical home for every prompt that ships, with version history and the eval delta each version produced.

---

## 2. Prompt Inventory

| ID | Used By | Purpose | Current Version | File |
|---|---|---|---|---|
| `system.main` | All agent calls | Master persona + rules | `v3` | `src/prompts/system.ts` |
| `tool.<name>` | Tool description | What this tool does, when to call | `v1` | `src/prompts/tools/<name>.ts` |
| `user.<flow>` | User-facing flow | Compose final user prompt | `v1` | `src/prompts/user/<flow>.ts` |
| ... | ... | ... | ... | ... |

---

## 3. Personas

<!-- If your system has multiple user roles or modes, document persona prompts here. -->

### 3.1 `<persona_name>` (e.g. junior, senior, admin)

| Property | Value |
|---|---|
| Audience | `<who is this for>` |
| Tone | `<formal / friendly / terse>` |
| Verbosity | `<one-line / paragraph / report>` |
| Default outputs | `<numbers / explanation / both>` |
| Tool priorities | `<calculator-first / retrieve-first / mixed>` |

System prompt addendum:
```
<paste full text>
```

---

## 4. Prompt Versioning

### 4.1 Lifecycle

```
draft → in-eval → shipped → deprecated
```

A prompt may not advance to `shipped` until it has run through `make eval` and the result is logged in section 5.

### 4.2 Version metadata header

Every prompt file MUST start with this header:

```ts
/**
 * @prompt-id   system.main
 * @version     v3
 * @parent      v2
 * @author      <handle>
 * @created     YYYY-MM-DD
 * @eval-run    eval/results/<run-id>/summary.md
 * @status      shipped
 * @rollback    Set ACTIVE_PROMPT_VERSION=v2 in env (no redeploy needed)
 */
```

### 4.3 Rollback strategy

Active prompt version is selectable via env var so we can roll back without redeploying:

```
ACTIVE_PROMPT_VERSION=v3   # default
```

Rollback to v2: change env, restart. No code change needed.

---

## 5. Version History

<!-- Append to the top. Do not delete entries. Each row should answer: what changed, why, what improved, what cost. -->

### `system.main` — v3 (YYYY-MM-DD)

**Author:** `<handle>` · **Parent:** v2 · **Eval:** `<run-id>`

**Change:**
- Added explicit citation requirement
- Tightened response length cap from 200 to 150 words

**Eval delta vs v2:**

| Metric | v2 | v3 | Δ |
|---|---:|---:|---:|
| Faithfulness | 0.78 | 0.84 | +0.06 |
| Answer Relevancy | 0.81 | 0.80 | -0.01 |
| Cost / query | $0.0042 | $0.0038 | -$0.0004 |

**Decision:** Ship.

---

## 6. Few-Shot Examples

<!-- Curated bad → good pairs that go into prompts. Maintain here so they're discoverable and reviewable. -->

| ID | Used By | Bad input | Good output | Why this teaches |
|---|---|---|---|---|
|  |  |  |  |  |

---

## 7. Anti-patterns

- **Inline prompts in route handlers.** Move every prompt to `src/prompts/`.
- **Prompt edits without an eval run.** Block via PR template checkbox.
- **Hand-tuning by author only.** Have at least one other person review prompt changes.
- **Forgetting the parent version.** Every shipped prompt has a parent; the chain enables rollback and post-hoc analysis.
- **Mixing system rules with user-data templating.** Keep them in different files.

---

## 8. Open Questions

-
-
