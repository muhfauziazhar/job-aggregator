# Job Aggregator

> Multi-source software engineering job board — Greenhouse, Lever, Ashby, RemoteOK, LinkedIn, Threads. No login, no upsell, no auto-apply. Just fresh listings, taggable by tech stack and seniority.

**Live:** _coming soon_ · **Stack:** Next.js 15 · TypeScript strict · Tailwind v4 · Postgres · Prisma · Zustand · Zod · Python scrapers

---

## Why

LinkedIn buries fresh roles behind login walls and "promoted" noise. Indeed throws aggregator spam at you. Glassdoor needs an account. Most job boards optimize for engagement, not signal.

**Job Aggregator** does one thing: collect fresh software engineering listings from multiple sources into a single searchable table, with strong filters (source, remote type, tech stack, seniority tier). No login. No tracking. No emails. Open source — self-host if you want.

---

## Features

- **6 sources:** Greenhouse, Lever, Ashby, RemoteOK, LinkedIn, Threads (hiring posts)
- **Filter by:** source ATS, remote/hybrid/onsite, seniority tier (entry/mid/senior/staff/principal), tech stack tags, company, posted date
- **Full-text search** across title / company / description (Postgres FTS)
- **6h incremental crawl** — new and updated jobs land within hours
- **Salary extraction** when source exposes it (Ashby, Lever, some Greenhouse)
- **Public API** — every page is also an API endpoint, no auth required
- **Self-hostable** — single Postgres + single Next.js + cron workers

---

## Architecture

```
[Scrapers (Python, cron 6h)]
  Greenhouse · Lever · Ashby · RemoteOK · LinkedIn · Threads
            ↓ upsert (source, external_id)
       [Postgres]
            ↓
[Next.js 15 App Router]
  /jobs · /jobs/[id] · /sources · /api/*
```

See [`docs/03-architecture.md`](./docs/03-architecture.md) for full diagram and decision rationale.

---

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 15 (App Router), TS strict, Tailwind v4, Zustand, shadcn/ui |
| Backend | Next.js Route Handlers + Zod validation |
| Database | Postgres 16, Prisma ORM |
| Scraper | Python 3.12, `requests`, `concurrent.futures`, Selenium (LinkedIn) |
| Cron | GitHub Actions every 6h |
| Deploy | Vercel (app) + Neon (Postgres) + GH Actions (cron) |

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.12+
- Docker (for local Postgres)
- `gh` CLI authenticated

### Setup

```bash
# 1. Clone
git clone https://github.com/muhfauziazhar/job-aggregator.git
cd job-aggregator

# 2. Postgres
docker run -d --name jobagg-pg -p 54321:5432 \
  -e POSTGRES_PASSWORD=dev \
  -e POSTGRES_DB=jobagg \
  postgres:16

# 3. App
npm install
cp .env.example .env.local   # fill DATABASE_URL
npx prisma migrate dev
npm run dev                  # → http://localhost:3000

# 4. Scraper (in another terminal)
cd scrapers
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python runner.py --source greenhouse --mode full
```

---

## Project Status

Public open source, in active MVP build. Track progress on the [Issues](../../issues) page.

| Milestone | Status |
|---|---|
| M0 — Project Setup | Open |
| M1 — Core MVP (4 ATS + frontend) | Open |
| M2 — Polish & Launch (LinkedIn + Threads) | Open |
| M3 — Post-MVP | Planned |

---

## ⚠️ LinkedIn Scraping Disclaimer

This project includes a LinkedIn scraper ([ADR-0001](./docs/adr/0001-linkedin-scraping-strategy.md)). It uses a **disposable account** and caps requests at 50–100/hour to minimize abuse. LinkedIn's TOS forbids automated scraping; we accept the ban risk for personal/aggregator use. **If you're self-hosting**, use your own account and don't republish profile data — only public job listings.

---

## Contributing

Contributions welcome. The flow:

1. Pick an [open issue](../../issues) (P0 first, lowest unblocked)
2. Branch: `feat/<issue-num>-<slug>`
3. Conventional commits, PR body has `Closes #N`
4. Lint + typecheck + test + build all green
5. Squash-merge

Full spec in [`CONTRIBUTING.md`](./CONTRIBUTING.md). Docs are living — update them in the same PR as code changes.

---

## Acknowledgements

- [`Feashliaa/job-board-aggregator`](https://github.com/Feashliaa/job-board-aggregator) — multi-ATS scraper inspiration + tier classifier pattern
- [`spinlud/py-linkedin-jobs-scraper`](https://github.com/spinlud/py-linkedin-jobs-scraper) — MIT-licensed LinkedIn scraper
- [`muhfauziazhar/app-blueprint`](https://github.com/muhfauziazhar/app-blueprint) — docs / milestone / issue scaffolding

---

## License

MIT — see [`LICENSE`](./LICENSE).
