# 07 — Roadmap & Timeline

Milestones. Each has explicit exit criteria.

---

## M0 — Project Setup

**Goal:** Repo scaffolded, docs filled, CI green, scraper cron live, schema migrated.

**Scope:**
- Repo from `app-blueprint` template ✓
- Bucket A docs (charter, architecture) marked Approved
- Bucket B docs (schema, API, user stories, roadmap, devops) drafted
- Labels, milestones, M1 issues seeded
- Prisma schema migrated to staging Postgres
- CI green (lint + typecheck + test + build on PR)

**Exit criteria:**
- [ ] All placeholders replaced
- [ ] 4 milestones visible on GitHub
- [ ] 20 user-story issues seeded under M1
- [ ] Vercel preview deploy renders `/`
- [ ] CI green on main

---

## M1 — Core MVP

**Goal:** End-to-end job browsing experience with 4 ATS sources live.

**Scope:**
- US-01 to US-08 (frontend + API)
- US-09 to US-12 (Greenhouse, Lever, Ashby, RemoteOK scrapers)
- US-13, US-14 (tier + tech classifiers)
- US-17 (cron workflow)
- US-18 (first-run full crawl)
- US-19 (expire stale)
- US-20 (Vercel deploy)

**Exit criteria:**
- [ ] 4 ATS scrapers running on 6h cron, success rate ≥ 90% over 7 days
- [ ] Frontend at `/jobs` returns ≥ 50K listings, searchable + filterable
- [ ] Lighthouse Performance (mobile) ≥ 85
- [ ] Public API responds < 500ms p95
- [ ] `docs/15-definition-of-done.md` checklist green

---

## M2 — Polish & Launch

**Goal:** Production-grade launch with LinkedIn + Threads + analytics.

**Scope:**
- US-15 (LinkedIn scraper)
- US-16 (Threads scraper)
- URL state sync for filters (shareable searches)
- Source stats page (US-08 polish)
- OG meta tags for share previews
- Error monitoring (Sentry or similar)
- Public launch post (HackerNews Show, Reddit r/cscareerquestions, dev.to)

**Exit criteria:**
- [ ] 6 sources live, ≥ 100K active listings
- [ ] Median freshness < 12h
- [ ] Public launch post published
- [ ] 1000 unique visitors in first week

---

## M3 — Post-MVP

Candidates (re-prioritize after M2 feedback):

- Indonesian sources (Glints, Tech in Asia, Dealls)
- Email digest opt-in
- Saved searches with webhook alerts
- Salary distribution charts
- Company pages (aggregate jobs per company)
- Application tracker (requires auth)
- Auto-apply (against charter — likely declined)
- RSS feeds per source/tag combo
- Slack/Discord bot integration
- Sponsor slots / job highlight (ethical only — labeled)

---

## Open Questions (carry into M1+)

- LinkedIn account rotation: 1 dummy vs pool? (ADR-0001)
- Self-host vs Vercel-only? Cost-vs-simplicity trade-off.
- Add `company` as a separate table for analytics, or denormalize? See ADR-0003.
