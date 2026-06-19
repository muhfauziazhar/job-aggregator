# 07 — Roadmap & Timeline

Milestones. Each has explicit exit criteria.

> **v0.2 pivot:** the project is now a static site (GitHub Pages) with a JSON
> data file, and sources are RemoteOK + LinkedIn + Threads (the ATS scrapers
> US-09..US-11 are dropped — covered by Feashliaa). RemoteOK, the cron, the
> tier/tech classifiers, expiry, and the frontend filters/search are done; what
> remains in M1 is wiring up the live Pages deploy and the source-stats page.

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

**Goal:** End-to-end static job board with the RemoteOK source live.

**Scope:**
- US-01 to US-06 (browse + filters + search, client-side) — **done**
- US-07 (job detail) — **done** as inline expand (no dedicated page on a static site)
- US-08 (source stats page) — open
- US-12 (RemoteOK scraper) — **done**
- US-13, US-14 (tier + tech classifiers) — **done**
- US-17 (cron workflow) — **done**
- US-18 (first-run full crawl) — **done** (runner crawls from an empty file)
- US-19 (expire stale, >30d) — **done**
- US-20 (deploy) — **repurposed** from Vercel to GitHub Pages; workflow in place, pending Pages enablement + first live deploy

**Dropped:** US-09 (Greenhouse), US-10 (Lever), US-11 (Ashby) — ATS sources covered by Feashliaa.

**Exit criteria:**
- [ ] RemoteOK scraper running on 6h cron, refreshing jobs.json
- [ ] Static site deployed on GitHub Pages, loads and filters/searches the data
- [ ] Lighthouse Performance (mobile) ≥ 85
- [ ] `docs/15-definition-of-done.md` checklist green

---

## M2 — Polish & Launch

**Goal:** Production-grade launch with LinkedIn + Threads + analytics.

**Scope:**
- US-15 (LinkedIn scraper — implement the scaffold)
- US-16 (Threads scraper — implement the scaffold)
- ~~URL state sync for filters~~ — **done early** in M1
- OG meta tags for share previews
- Error monitoring (optional)
- Public launch post (HackerNews Show, Reddit r/cscareerquestions, dev.to)

**Exit criteria:**
- [ ] 3 sources live (RemoteOK + LinkedIn + Threads)
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
