# 08 — Team & RACI

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | PM |
| Status | Draft |

---

## 1. Recommended Team

> Tailor FTE to project size. Below is a typical small-team MVP composition.

| Role | FTE | Notes |
|---|---:|---|
| Product Owner / Operator | 0.5–1.0 | Acceptance, content quality, priorities |
| Project Manager | 0.5 | Timeline, risk, coordination |
| Tech Lead | 1.0 | Architecture, review, code quality |
| Frontend / Mobile Engineer | 1.0–2.0 | Client-side work |
| Backend Engineer | 1.0 | API, schema, RLS, server-side logic |
| Specialist Engineer (e.g. ML, streaming, integrations) | 0.5 | As needed |
| QA Lead | 0.5–1.0 | Test plan, release gates |
| Designer | 0.5–0.7 | UX, design system |
| DevOps | 0.5 | CI/CD, infra, monitoring, incident support |

---

## 2. RACI

R = Responsible (does the work)
A = Accountable (one person, owns outcome)
C = Consulted (input before decision)
I = Informed (after decision)

| Deliverable | PO | PM | TL | FE | BE | Specialist | QA | Design | DevOps |
|---|---|---|---|---|---|---|---|---|---|
| Scope approval | A | R | C | I | I | I | I | C | I |
| Architecture | C | I | A/R | C | C | C | I | I | C |
| DB schema / authz | C | I | A | I | R | I | C | I | C |
| Client architecture | C | I | A | R | I | I | C | R | I |
| Feature implementation | A | C | C | R | R | I | C | R | I |
| QA / test plan | A | C | C | C | C | I | R | C | I |
| CI / CD | I | I | A | C | C | I | I | I | R |
| Incident response | C | I | C | C | C | C | C | I | A/R |
| Release approval | A | R | C | C | C | C | C | C | C |

---

## 3. Communication Cadence

| Forum | Frequency | Attendees |
|---|---|---|
| Engineering standup | Daily | Engineering |
| Product / engineering sync | 2x weekly | PO, PM, TL |
| Sprint demo | Biweekly | All + sponsor |
| Risk review | Biweekly | PO, PM, TL, DevOps |
| Sponsor update | Weekly or biweekly | Sponsor, PO, PM |
| Retro | End of milestone | All |

---

## 4. Escalation

1. Engineer → Tech Lead (technical blockers)
2. Tech Lead → Product Owner (scope ambiguity)
3. Product Owner → Sponsor (priority / budget conflicts)
4. Anyone → DevOps + Tech Lead (production incidents)
