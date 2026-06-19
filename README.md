# Job Aggregator

> Software engineering job board — fresh listings from RemoteOK, with LinkedIn and Threads hiring posts as bonus sources. No login, no upsell, no auto-apply. Just a searchable table, filterable by tech stack and seniority.

**Live:** _coming soon (GitHub Pages)_ · **Stack:** Next.js 16 (static export) · TypeScript strict · Tailwind v4 · Zustand · Zod · Python scrapers

---

## Why

LinkedIn buries fresh roles behind login walls and "promoted" noise. Indeed throws aggregator spam at you. Glassdoor needs an account. Most job boards optimize for engagement, not signal.

**Job Aggregator** does one thing: collect fresh software engineering listings into a single searchable table, with strong filters (source, remote type, tech stack, seniority tier). No login. No tracking. No emails. No database to run — the whole thing is a static site plus a scraper. Open source — fork it and self-host for free.

This project deliberately **does not** re-scrape the ATS platforms (Greenhouse, Lever, Ashby, BambooHR, iCIMS, Workday, …) already covered well by [`Feashliaa/job-board-aggregator`](https://github.com/Feashliaa/job-board-aggregator). It focuses on sources that project doesn't: RemoteOK now, LinkedIn and Threads next.

---

## Features

- **Sources:** RemoteOK (live), LinkedIn + Threads hiring posts (scaffolded, see roadmap)
- **Filter by:** source, remote/hybrid/onsite, seniority tier (intern/entry/mid/senior/staff/principal), tech stack tags
- **Full-text search** across title / company / description — runs client-side, instantly
- **Shareable searches** — every filter lives in the URL
- **6h refresh** — a cron scraper republishes the data
- **Salary extraction** when the source exposes it
- **Zero backend** — static export, no server, no database
- **Self-hostable for free** — fork → enable GitHub Pages → done

---

## Architecture

```
[Scraper (Python, GitHub Actions cron 6h)]
  RemoteOK · LinkedIn* · Threads*          (*scaffolded)
            ↓ scrape → normalize → tag → merge → prune (>30d)
   public/data/jobs.json   (committed to the repo)
            ↓ git push to main
[GitHub Actions: build Next.js static export → deploy to GitHub Pages]
            ↓
[Static site] loads jobs.json client-side → filter / search / paginate
```

No database. The scraper produces a JSON file; the frontend reads it in the browser. See [`docs/03-architecture.md`](./docs/03-architecture.md).

---

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 16 App Router (`output: 'export'`), TS strict, Tailwind v4, Zustand, Zod |
| Data | `public/data/jobs.json` (validated with Zod against `src/types/job.ts`) |
| Scraper | Python 3.12, `requests` (Selenium for LinkedIn when implemented) |
| Cron | GitHub Actions every 6h |
| Deploy | GitHub Pages (static) |

---

## Local Development

### Prerequisites

- Node.js 22+ and [pnpm](https://pnpm.io)
- Python 3.12+ (only if running the scrapers)

### App

```bash
pnpm install
pnpm dev            # → http://localhost:3000
```

The app reads `public/data/jobs.json`, which is committed, so it runs with real data out of the box.

### Scrapers

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r scrapers/requirements.txt

# Refresh jobs.json from all sources (run from the repo root):
python -m scrapers.runner --source all

# Or a single source, capped, without writing:
python -m scrapers.runner --source remoteok --limit 20 --dry-run
```

### Quality gate

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

---

## Deployment (GitHub Pages)

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

After that it's automatic:

- Push to `main` → `.github/workflows/deploy.yml` builds the static export and deploys it.
- The scraper cron (`.github/workflows/scraper-cron.yml`) commits a fresh `jobs.json` every 6h, which triggers a redeploy.

The site is served under `/job-aggregator` (configured via `basePath` in `next.config.ts`).

---

## Project Status

In active MVP build. Track progress on the [Issues](../../issues) page.

| Milestone | Focus | Status |
|---|---|---|
| M0 — Project Setup | Scaffolding, CI, deploy | Done |
| M1 — Core MVP | Static site + filters/search + RemoteOK scraper + cron | In progress |
| M2 — Polish & Launch | LinkedIn + Threads scrapers, OG tags, launch | Planned |
| M3 — Post-MVP | Improvements from feedback | Planned |

---

## ⚠️ LinkedIn Scraping Disclaimer

This project includes a LinkedIn scraper scaffold ([ADR-0001](./docs/adr/0001-linkedin-scraping-strategy.md)). When implemented it uses a **disposable account** and caps request volume to minimize abuse. LinkedIn's TOS forbids automated scraping, and datacenter IPs (like GitHub Actions runners) are aggressively blocked — so this source is best-effort. **If you self-host**, use your own account and don't republish profile data — only public job listings.

---

## Contributing

1. Pick an [open issue](../../issues) (P0 first, lowest unblocked)
2. Branch: `feat/<issue-num>-<slug>`
3. Conventional commits, PR body has `Closes #N`
4. Lint + typecheck + test + build all green
5. Squash-merge

Full spec in [`CONTRIBUTING.md`](./CONTRIBUTING.md). Docs are living — update them in the same PR as code changes.

---

## Acknowledgements

- [`Feashliaa/job-board-aggregator`](https://github.com/Feashliaa/job-board-aggregator) — static GitHub Pages aggregator + tier/tech classifier inspiration
- [`spinlud/py-linkedin-jobs-scraper`](https://github.com/spinlud/py-linkedin-jobs-scraper) — MIT-licensed LinkedIn scraper
- [`muhfauziazhar/app-blueprint`](https://github.com/muhfauziazhar/app-blueprint) — docs / milestone / issue scaffolding

---

## License

MIT — see [`LICENSE`](./LICENSE).
