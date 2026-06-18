# 01 — Project Charter

| Field | Value |
|---|---|
| Project Name | Job Aggregator |
| Charter Version | 0.1 |
| Date | 2026-06-18 |
| Owner | Muhammad Fauzi Azhar |
| Status | Approved |

---

## 1. Purpose

Job Aggregator is a **multi-source software engineering job board** for **job-seeking software engineers (mid–senior, global, English-first)**. It helps them **discover fresh, deduplicated listings from ATS platforms and LinkedIn in one place**, with a focus on **freshness (6h crawl cadence), tech-stack tagging, and remote-friendly filtering** without login walls or auto-apply.

Differentiation vs LinkedIn / Indeed / Glassdoor: no login, no tracking, no upsell — just clean aggregated listings with strong filters (source ATS, remote type, tech stack, seniority tier).

---

## 2. Scope

### In Scope (MVP)

- Scrape 6 sources: **Greenhouse, Lever, Ashby, RemoteOK, LinkedIn, Threads** (hiring posts)
- Normalize into unified schema, dedupe cross-source
- Tag: source ATS, remote type, seniority tier (entry/mid/senior), tech stack (regex extract)
- Next.js 16 frontend: search, filter, sort, table/card view
- Postgres storage, 6h incremental cron (first-run full crawl)
- Public open-source repo, self-hostable

### Out of Scope (MVP)

- User accounts / auth
- Auto-apply, application tracking
- Email alerts, push notifications
- Salary scraping from sources that don't expose it
- Mobile native apps
- Indonesian-language sources (Glints, Tech in Asia) — possible M3+

---

## 3. Target User

**Primary:** Software engineers (mid–senior, 3+ YoE) actively job-hunting or passively browsing. Comfortable with technical filters, prefers signal over volume.

**Secondary:** Recruiters / hiring managers using it as market-intel (job title frequency, salary benchmarks).

---

## 4. Success Metrics (MVP)

| Metric | Target |
|---|---|
| Active listings count | ≥ 100K within 30 days of launch |
| Cron success rate | ≥ 95% over 7-day window |
| Median data freshness | < 12 hours (50th percentile last-crawled-at) |
| Lighthouse Performance (mobile) | ≥ 85 |
| Public deploy uptime | ≥ 99% |

---

## 5. Non-Goals

- Building a job search engine better than LinkedIn (LinkedIn wins on volume; we win on freshness + filtering)
- Covering non-tech roles
- Mobile-first UX (responsive web OK)

---

## 6. Open Questions

- Domain for production deploy? (Decision deferred to M1 deploy step)
- LinkedIn account rotation strategy — single dummy or pool? (See ADR-0001)
- Threads signal — actually use, or YAGNI for MVP? (See ADR-0002)

---

## 7. References

- [Architecture](./03-architecture.md)
- [Roadmap](./07-roadmap-timeline.md)
- [User Stories](./06-user-stories.md)
- [ADR-0001: LinkedIn scraping strategy](./adr/0001-linkedin-scraping-strategy.md)
- [ADR-0002: Threads inclusion](./adr/0002-threads-inclusion.md)
