# Job Aggregator — Project Documentation

| Field | Value |
|---|---|
| Project | Job Aggregator |
| Documentation Version | 0.1 |
| Last Updated | YYYY-MM-DD |
| Status | Draft |

---

## Purpose

This folder is the canonical home for product, technical, and operational documentation for **Job Aggregator**.

It is built from the [`app-blueprint`](https://github.com/muhfauziazhar/app-blueprint) template and follows the convention:

> **Docs = source of truth for *intent*. GitHub Issues + Milestones = source of truth for *progress*.**

---

## Document Index

| # | Document | Audience | Owner | Status |
|---|---|---|---|---|
| 01 | [Project Charter](./01-project-charter.md) | Stakeholder, Sponsor | PM | Draft |
| 02 | [Technical Requirements](./02-technical-requirements.md) | Engineering | Tech Lead | Draft |
| 03 | [System Architecture](./03-architecture.md) | Engineering, DevOps | Tech Lead | Draft |
| 04 | [Database Schema](./04-database-schema.md) | Backend, Mobile | Backend Eng | Draft |
| 05 | [API Specification](./05-api-specification.md) | Engineering | Backend Eng | Draft |
| 06 | [User Stories](./06-user-stories.md) | Product, QA, Eng | Product Owner | Draft |
| 07 | [Roadmap & Timeline](./07-roadmap-timeline.md) | All | PM | Draft |
| 08 | [Team & RACI](./08-team-raci.md) | All | PM | Draft |
| 09 | [Risk Register](./09-risk-register.md) | PM, Stakeholder | PM | Living document |
| 10 | [Test Plan](./10-test-plan.md) | QA, Engineering | QA Lead | Draft |
| 11 | [DevOps & Deployment](./11-devops-deployment.md) | DevOps, Engineering | DevOps | Draft |
| 12 | [Cost & Budget](./12-cost-budget.md) | Finance, PM | PM + Finance | Draft |
| 13 | [Security & Compliance](./13-security-compliance.md) | Engineering, Legal | Tech Lead + Legal | Draft |
| 14 | [Go-to-Market](./14-go-to-market.md) | Sales, Marketing | Marketing | Draft |
| 15 | [Definition of Done](./15-definition-of-done.md) | Engineering, QA | Tech Lead + QA | Draft |
| 16 | [Coding Standards](./16-coding-standards.md) | Engineering | Tech Lead | Draft |
| 17 | [Glossary](./17-glossary.md) | All | PM | Living document |
| 18 | [Decision Log](./18-decision-log.md) | Engineering | Tech Lead | Living document |
| 19 | [Observability & Runbook](./19-observability-runbook.md) | DevOps, On-call | DevOps | Draft |
| 20 | [Analytics Events Catalog](./20-analytics-events.md) | Product, Engineering | Product Owner | Draft |
| 21 | [Feature Flags & Rollout](./21-feature-flags.md) | Engineering, Product | Tech Lead | Draft |

### AI add-on (optional — required only when shipping LLM-powered features)

These docs are skipped for projects without LLM features. Required when the product calls a hosted LLM in production (RAG, agent, generation, classification, scoring). See `../README.md` § *Project type* for when to enable the add-on.

| # | Document | Audience | Owner | Status |
|---|---|---|---|---|
| 22 | [Eval Methodology](./22-eval-methodology.md) | AI / QA / Product | AI Lead | Draft |
| 23 | [Prompts](./23-prompts.md) | AI / Engineering | AI Lead | Draft |
| 24 | [Agent Architecture](./24-agent-architecture.md) | AI / Engineering | AI Lead | Draft |
| 25 | [LLM Cost & Budget](./25-llm-cost-budget.md) | AI / Finance | AI Lead + Finance | Draft |
| 26 | [Validation Process](./26-validation-process.md) | AI / Domain Expert | AI Lead + Expert | Draft |
| 27 | [Data Governance (AI)](./27-data-governance.md) | AI / Tech Lead | AI Lead + Tech Lead | Draft |

Supplemental:

| Path | Purpose |
|---|---|
| [`./adr/`](./adr/) | Architectural Decision Records (one file per decision) |
| [`./spikes/`](./spikes/) | Technical spike notes — provisional findings before formal architecture |
| [`./diagrams/`](./diagrams/) | Higher-fidelity diagrams (committed `.mmd` source + exports) |

---

## Reading Order

**For new engineers (1–2 hour onboarding read):**

1. `01-project-charter.md` — what & why
2. `02-technical-requirements.md` — what we're building (functional + non-functional)
3. `03-architecture.md` — how systems fit together
4. `04-database-schema.md` — data model
5. `05-api-specification.md` — contract between client and backend
6. `16-coding-standards.md` — how we write code
7. `15-definition-of-done.md` — quality bar

**Role-specific deep dives:**

- **Product / PM:** 06, 07, 09, 14, 20
- **Backend / Mobile / Web Eng:** 02, 03, 04, 05, 16, 21
- **QA:** 10, 15, 06, 20
- **DevOps:** 11, 13, 19, 21
- **Designer:** 01, 06, 14
- **Finance / Ops:** 12, 14, 09
- **AI / ML Eng (when add-on is enabled):** 22, 23, 24, 25, 27 — plus 03, 13
- **Domain Expert (when add-on is enabled):** 22, 26, 14

---

## Status Lifecycle

```
Draft → In Review → Approved → (revised → Draft → ...)
```

`Living document` is a separate track — these docs (09, 17, 18) update continuously and are never "frozen".

A doc may not advance to **Approved** until it has been reviewed by its CODEOWNER (see `.github/CODEOWNERS`).

---

## Change Log

Doc-level change log is maintained per-doc in the version metadata at the top. Cross-doc decisions are recorded in `18-decision-log.md`.
