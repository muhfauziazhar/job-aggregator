# ADR-0001: LinkedIn scraping strategy

**Status:** Accepted
**Date:** 2026-06-18

## Context

LinkedIn hosts a large fraction of software engineering jobs (corp, non-tech, mid-tier). Its public-facing job board is scrape-able. Legal/ToS risk: LinkedIn's TOS forbids automated scraping; cf. *hiQ Labs v. LinkedIn* (public data is OK in US, but ToS still applies contractually). Enforcement against small job-aggregator operators is historically low.

## Decision

- Use **one disposable LinkedIn account** (dummy) for scraping, accept ban risk.
- Use `py-linkedin-jobs-scraper` (Selenium-based, MIT).
- Scrape only public job listings, never profile data, never 1st-degree connections.
- Cap at 50–100 requests/hour per account. If ban: pause for 24h, retry; if persistent: drop LinkedIn source and document.
- No PII stored. Only job metadata (title, company, location, apply URL).
- Repo documents this risk prominently in README + CONTRIBUTING.md.

## Consequences

**Positive:**
- Coverage gap filled for corp + non-ATS roles.
- Library is mature, MIT-licensed.

**Negative:**
- LinkedIn may IP-ban. Mitigation: residential proxy pool (cost: ~$5-15/GB).
- Fragile to LinkedIn HTML changes. Mitigation: scraper isolated, easy to disable.
- Ethical concern: aggregating competitor data. Mitigation: don't republish profiles, only public job listings.

## Alternatives Considered

- **LinkedIn official Jobs API**: gated to approved partners, $$$. Rejected for MVP cost.
- **Bright Data / Apify LinkedIn Scraper**: $0.50–1.00 per 1000 jobs. Rejected — adds vendor lock-in, breaks open-source ethos.
- **Drop LinkedIn entirely**: cuts ~30% of listings, reduces value. Rejected for MVP, can revisit post-launch.
