# App Blueprint

Standard documentation skeleton + GitHub project structure for new app projects. Use this as a GitHub Template — every new product gets a consistent set of docs (charter, architecture, schema, API, roadmap, risks, ops) **and** a consistent development flow (docs → milestones → issues → PRs).

**Reference project**: [muhfauziazhar/cv-ats-generator](https://github.com/muhfauziazhar/cv-ats-generator) — full end-to-end example built from this template.

---

## How to Use This Template

### 1. Create a new repo

```bash
gh repo create <your-org>/<your-app> \
  --template muhfauziazhar/app-blueprint \
  --private \
  --description "<one-line elevator pitch>" \
  --clone
```

### 2. Replace placeholders

```bash
cd <your-app>
find . -type f \( -name "*.md" -o -name "*.yml" -o -name "CODEOWNERS" \) -not -path './.git/*' -exec sed -i \
  -e 's/Job Aggregator/<Real Name>/g' \
  -e 's/job-aggregator/<repo-slug>/g' \
  -e 's/muhfauziazhar/<your-org>/g' \
  -e 's/Next.js 15 + TS strict + Tailwind v4 + Postgres + Prisma + Zustand + Zod/<Next.js 15 + Postgres + Prisma>/g' \
  -e 's/Postgres + Python scraper workers/<Postgres>/g' \
  -e 's/Muhammad Fauzi Azhar/<Lead Name>/g' \
  {} +
```

Placeholders to fill:
- `Job Aggregator` — full product name (e.g. *CV ATS Generator*, *ForYourPurse*)
- `job-aggregator` — repo slug (e.g. `cv-ats-generator`)
- `muhfauziazhar` — GitHub org / user (e.g. `muhfauziazhar`)
- `Next.js 15 + TS strict + Tailwind v4 + Postgres + Prisma + Zustand + Zod` — short stack description
- `Postgres + Python scraper workers` — main DB / backend choice
- `Muhammad Fauzi Azhar` — accountable lead

### 3. Pick project type (standard or AI)

| Project type | Use these docs | Skip these docs |
|---|---|---|
| **Standard web/mobile app** | `01–21` | `22–27` |
| **AI add-on (LLM-powered)** | `01–27` | (none) |

Enable the AI add-on when the product calls a hosted LLM in production — RAG, agent loops, generation, classification, scoring. The add-on docs cover concerns the standard 21 don't (eval methodology, prompt versioning, agent guardrails, LLM-specific cost dynamics, expert validation, AI data flows). Drop them by deleting `docs/22-*` through `docs/27-*` if your project doesn't ship LLM features.

### 4. Fill the docs (MVP-relevant level)

Walk `docs/00-README.md` and tailor each doc. **Target "MVP-relevant", not "production-grade"** — docs are *living documents* that update as the project progresses.

Required at kickoff (status: `Approved`):
- `01-project-charter.md`
- `03-architecture.md`
- `22-eval-methodology.md` *(AI add-on only — eval methodology must be locked before any prompt iteration)*

Everything else can stay `Draft` and evolve.

### 5. Self-review + initial commit

```bash
# Sanity checks
grep -r '{{' docs/ && echo "⚠ Unreplaced placeholders found"
grep -rE '\[.+?\]\([^)]+?\)' docs/  # check links

git add -A
git commit -m "feat: initial documentation skeleton"
git push -u origin main
```

### 6. Seed labels, milestones, issues

```bash
REPO=<your-org>/<your-app> bash scripts/seed-labels-milestones.sh
# Edit scripts/seed-issues.sh — turn each user story in docs/06 into a create_issue call
REPO=<your-org>/<your-app> bash scripts/seed-issues.sh
```

This creates standard labels (`type:*`, `area:*`, `priority:p0/p1/p2`, `effort:S/M/L`, `status:*`), 4 milestones (M0–M3), and one issue per user story. The seeder includes a separate `area:ai-*` label group that's only useful when the AI add-on is enabled — harmless if unused.

### 7. Start working through issues

Follow the [development flow](#development-flow) below. One issue → one branch → one PR.

---

## Development Flow

This template enforces a **docs-first, PR-driven** flow. The full spec is in [`CONTRIBUTING.md`](./CONTRIBUTING.md). TL;DR:

```
PROJECT KICKOFF (run once)
└─ Phase 1
   ├─ Create repo from template
   ├─ Replace placeholders
   ├─ Fill the relevant docs (MVP-level; only Charter, Architecture, and — for AI projects — Eval Methodology need Approved)
   ├─ Initial commit + push to main
   └─ Seed labels, milestones, issues from user stories

PER-ISSUE LOOP (every feature/fix)
└─ Phase 2
   ├─ Pick the issue (P0 first, lowest issue number that's unblocked)
   ├─ For effort:L → write a plan first (.hermes/plans/<num>-plan.md)
   ├─ Branch: <type>/<num>-<slug>  e.g. feat/12-jd-matcher
   ├─ Implement; commit using Conventional Commits with `Refs #N`
   ├─ Open PR: title is conventional, body has `Closes #N`
   ├─ Self-review; lint + typecheck + test + build all green
   ├─ Squash-merge with --delete-branch (issue auto-closes)
   └─ Comment on issue ONLY if there's a non-obvious decision/learning

PER-MILESTONE WRAP (every milestone close)
└─ Phase 3
   ├─ Update living docs (02, 04, 05, 09, 17, 18) with new learnings
   ├─ Close the milestone
   └─ Move incomplete P1/P2 to next milestone (re-evaluate priority)
```

### Why squash-merge?

- `main` history stays clean: 1 commit per issue, easy to revert
- Branch detail (every commit during dev) is preserved on the PR page
- `Closes #N` in the squashed message auto-attaches the commit to the issue timeline
- No merge commits cluttering `git log`

### Why no manual "I'm working on this" comments?

The PR linked to the issue is the single source of truth for status. Comment on issues only when there's a **decision or learning that future maintainers will need** — not for routine progress updates.

---

## What's in the Box

### Documentation

| Group | Docs |
|---|---|
| **Foundation** | 01 Charter, 02 Tech Requirements, 03 Architecture, 04 DB Schema, 05 API Spec |
| **Delivery** | 06 User Stories, 07 Roadmap, 08 Team & RACI, 15 Definition of Done |
| **Operations** | 09 Risk Register, 10 Test Plan, 11 DevOps, 19 Observability Runbook, 21 Feature Flags |
| **Business** | 12 Cost & Budget, 14 Go-to-Market |
| **Quality** | 13 Security & Compliance, 16 Coding Standards, 20 Analytics Events |
| **Knowledge** | 17 Glossary, 18 Decision Log + `docs/adr/` |
| **AI add-on** *(optional, when shipping LLM features)* | 22 Eval Methodology, 23 Prompts, 24 Agent Architecture, 25 LLM Cost & Budget, 26 Validation Process, 27 Data Governance (AI) |

Plus `docs/spikes/_template.md` for time-boxed experiments and `docs/diagrams/` for Mermaid sources.

### GitHub Configuration

- `.github/CODEOWNERS` — auto-requires Tech Lead review for critical docs
- `.github/PULL_REQUEST_TEMPLATE.md` — DoD checklist + Closes #N reminder
- `.github/ISSUE_TEMPLATE/` — bug, feature, user-story, risk
- `.github/workflows/pr-conventions.yml` — validates PR title (Conventional Commits) + body has `Closes #N`

### Scripts

- `scripts/seed-labels-milestones.sh` — idempotent label + milestone setup
- `scripts/seed-issues.sh` — idempotent issue creation from user stories

---

## Versioning & Status

Every doc carries a metadata table at the top:

| Field | Meaning |
|---|---|
| Version | Semantic-ish (0.1, 0.2, 1.0). Bump on substantive change. |
| Owner | Person accountable for keeping the doc current. |
| Status | `Draft` → `In Review` → `Approved` → `Living document` |

`Living document` = always-current (e.g. risk register, ADR index). Everything else freezes at `Approved` until the next intentional revision.

---

## Conventions

- **One change per PR.** Doc-only PRs are encouraged — they're cheap to review and create a clear paper trail.
- **No "TBD" without an owner + due date.** Either fill it or delete it.
- **Cross-link generously.** If doc 03 mentions a table, link to doc 04. If a story has AC, link to the test plan.
- **Diagrams as code (Mermaid)** for anything in markdown. Higher-fidelity diagrams go in `docs/diagrams/` with `.mmd` source committed alongside.
- **Living docs over snapshot docs.** Update the doc in the same PR as the code change.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full development flow, branching strategy, commit conventions, and PR rules.
