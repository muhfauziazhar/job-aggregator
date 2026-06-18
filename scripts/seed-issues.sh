#!/usr/bin/env bash
# Idempotent seeder for issues from user stories.
# Usage: REPO=owner/repo bash scripts/seed-issues.sh
set -euo pipefail

REPO="${REPO:?REPO env var required}"

# Map milestones by title -> number
declare -A MS
while IFS=$'\t' read -r num title; do
  MS["$title"]="$num"
done < <(gh api "repos/$REPO/milestones?state=all&per_page=100" -q '.[] | "\(.number)\t\(.title)"')

existing_titles="$(gh issue list --repo "$REPO" --state all --limit 500 --json title -q '.[].title' || true)"

create_issue() {
  local title="$1"; shift
  local milestone_title="$1"; shift
  local body="$1"; shift
  local labels="$1"; shift

  if echo "$existing_titles" | grep -Fxq "$title"; then
    echo "   ~ $title"
    return
  fi

  local ms_num="${MS[$milestone_title]:-}"
  if [[ -z "$ms_num" ]]; then
    echo "   ! milestone '$milestone_title' not found, skipping: $title"
    return
  fi

  gh issue create --repo "$REPO" \
    --title "$title" \
    --body "$body" \
    --milestone "$milestone_title" \
    --label "$labels" >/dev/null
  echo "   + $title"
}

echo "==> Creating M0 setup issues"

create_issue "M0-01: Initialize Next.js 15 app with TS strict + Tailwind v4 + Prisma + Zustand + Zod" "M0 — Project Setup" \
"Initialize the Next.js 15 application from the blueprint, install all core dependencies, configure TypeScript strict mode, Tailwind v4, Prisma client, Zustand, Zod, and Vitest.

### Acceptance criteria
- [ ] Next.js 15 App Router with `src/` layout
- [ ] `tsconfig.json` strict: true
- [ ] Tailwind v4 configured
- [ ] Prisma client wired with DATABASE_URL placeholder
- [ ] Empty `npm run dev` boots successfully

### References
[docs/02-technical-requirements.md](../docs/02-technical-requirements.md)" \
"type:chore,area:devops,priority:p0,effort:M"

create_issue "M0-02: Migrate Prisma schema to staging Postgres" "M0 — Project Setup" \
"Apply the Prisma schema from docs/04 to a staging Postgres instance. Verify tables, indexes, and enums are created correctly.

### Acceptance criteria
- [ ] `prisma migrate dev --name init` succeeds
- [ ] `jobs` and `scraper_runs` tables exist with all columns
- [ ] Indexes match docs/04 spec

### References
[docs/04-database-schema.md](../docs/04-database-schema.md)" \
"type:chore,area:db,priority:p0,effort:S"

create_issue "M0-03: CI green (lint + typecheck + test + build)" "M0 — Project Setup" \
"Set up `.github/workflows/ci.yml` to run on PRs and main. All four checks must pass for CI green.

### Acceptance criteria
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run test` passes (Vitest)
- [ ] `npm run build` succeeds
- [ ] Required check on GitHub branch protection

### References
[docs/11-devops-deployment.md](../docs/11-devops-deployment.md)" \
"type:chore,area:devops,priority:p0,effort:S"

create_issue "M0-04: Vercel preview deploy from PR" "M0 — Project Setup" \
"Link the repo to Vercel. Preview deploys render on PRs. Document env var setup.

### Acceptance criteria
- [ ] Vercel project created and linked
- [ ] Preview deploy URL appears on PRs
- [ ] Production domain placeholder configured

### References
[docs/11-devops-deployment.md](../docs/11-devops-deployment.md)" \
"type:chore,area:devops,priority:p0,effort:S"

echo "==> Creating M1 user-story issues"

create_issue "US-01: Browse all jobs on landing page" "M1 — Core MVP" \
"As a **job seeker**, I want to **see a paginated list of recent jobs on the home page**, so that I can **scan what's available without signing up**.

### Acceptance criteria
- [ ] \`GET /\` renders a table of jobs, newest first
- [ ] Pagination via cursor, 20 per page
- [ ] Each row shows: title, company, location, source badge, posted_at
- [ ] Click row → opens detail page; Apply button opens \`apply_url\` in new tab

### References
[docs/06-user-stories.md → US-01](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-02: Filter jobs by source" "M1 — Core MVP" \
"As a **job seeker**, I want to **filter by source platform**, so that I can **focus on ATS-tracked roles**.

### Acceptance criteria
- [ ] Filter sidebar checkbox group per source with counts
- [ ] URL query \`?source=greenhouse,lever\` updates and is shareable

### References
[docs/06-user-stories.md → US-02](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:S"

create_issue "US-03: Filter by remote type" "M1 — Core MVP" \
"Remote-only toggle in the filter panel.

### Acceptance criteria
- [ ] \`?remote=remote\` filter
- [ ] Toggle persisted in URL
- [ ] Counts update reactively

### References
[docs/06-user-stories.md → US-03](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:S"

create_issue "US-04: Filter by seniority tier" "M1 — Core MVP" \
"Tier (entry/mid/senior/staff) filter.

### Acceptance criteria
- [ ] Tier badges on each card
- [ ] Multi-select tier filter
- [ ] Tier derived from title via classifier (US-13)

### References
[docs/06-user-stories.md → US-04](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:S"

create_issue "US-05: Filter by tech stack" "M1 — Core MVP" \
"Tech-stack multi-tag filter with autocomplete.

### Acceptance criteria
- [ ] \`?tech=go,postgres\` filter
- [ ] Multi-tag input
- [ ] Tags extracted by US-14

### References
[docs/06-user-stories.md → US-05](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-06: Full-text search" "M1 — Core MVP" \
"Keyword search across title/company/description using Postgres FTS.

### Acceptance criteria
- [ ] Search bar in header
- [ ] Postgres FTS index used
- [ ] Snippet highlighting in results

### References
[docs/06-user-stories.md → US-06](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-07: Job detail page" "M1 — Core MVP" \
"\`GET /jobs/[id]\` shows full description + apply button + OG meta.

### Acceptance criteria
- [ ] Full description rendered with paragraph breaks
- [ ] Apply button → new tab
- [ ] Open Graph meta for share previews

### References
[docs/06-user-stories.md → US-07](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:S"

create_issue "US-08: Source stats page" "M1 — Core MVP" \
"\`GET /sources\` shows per-source active count + last-run status.

### Acceptance criteria
- [ ] Per-source counts
- [ ] Last successful run timestamp
- [ ] Status indicator (green/yellow/red)

### References
[docs/06-user-stories.md → US-08](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p1,effort:S"

create_issue "US-09: Greenhouse scraper" "M1 — Core MVP" \
"Ingest from Greenhouse public API for known company boards.

### Acceptance criteria
- [ ] Fetch companies list, then per-company job list
- [ ] Upsert into \`jobs\` keyed by \`(source='greenhouse', external_id)\`
- [ ] Record \`scraper_runs\` row

### References
[docs/06-user-stories.md → US-09](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-10: Lever scraper" "M1 — Core MVP" \
"Ingest from Lever public API.

### Acceptance criteria
- [ ] Fetch \`https://api.lever.co/v0/postings/{company}?mode=json\`
- [ ] Handle paginated \`next\` cursor
- [ ] Upsert

### References
[docs/06-user-stories.md → US-10](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-11: Ashby scraper" "M1 — Core MVP" \
"Ingest from Ashby public API with compensation fields.

### Acceptance criteria
- [ ] Fetch \`https://api.ashbyhq.com/posting-api/job-board/{board}?includeCompensation=true\`
- [ ] Parse compensation into salary_min/max/currency
- [ ] Upsert

### References
[docs/06-user-stories.md → US-11](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-12: RemoteOK scraper" "M1 — Core MVP" \
"Ingest from RemoteOK public JSON.

### Acceptance criteria
- [ ] Fetch \`https://remoteok.com/api\`
- [ ] Mark all \`remote_type='remote'\`
- [ ] Extract tags → \`tech_stack\`

### References
[docs/06-user-stories.md → US-12](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:S"

create_issue "US-13: Seniority tier classifier" "M1 — Core MVP" \
"Tag each job with seniority tier via title-based regex classifier.

### Acceptance criteria
- [ ] Output: \`intern | entry | mid | senior | staff | principal | unknown\`
- [ ] Weighted keyword scoring
- [ ] Confidence threshold for \`unknown\`

### References
[docs/06-user-stories.md → US-13](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-14: Tech stack tagger" "M1 — Core MVP" \
"Extract tech tags from description using static dictionary.

### Acceptance criteria
- [ ] Dictionary of 50–100 common tech tags
- [ ] Regex match with word boundaries
- [ ] Cap at 10 tags per job
- [ ] Tags stored as \`text[]\` for GIN index

### References
[docs/06-user-stories.md → US-14](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:M"

create_issue "US-17: Cron workflow (6h)" "M1 — Core MVP" \
"GitHub Actions cron every 6h, matrix over sources, parallel execution.

### Acceptance criteria
- [ ] \`.github/workflows/scraper-cron.yml\` on \`0 */6 * * *\`
- [ ] Matrix over sources
- [ ] Secrets: \`DATABASE_URL\`, \`LINKEDIN_EMAIL\`, \`LINKEDIN_PASSWORD\`

### References
[docs/06-user-stories.md → US-17](../docs/06-user-stories.md)" \
"type:user-story,area:devops,priority:p0,effort:S"

create_issue "US-18: First-run full crawl" "M1 — Core MVP" \
"Support initial full crawl via \`--mode full\` flag.

### Acceptance criteria
- [ ] \`scraper.py --source <s> --mode full\` ingests all available
- [ ] Idempotent via upsert
- [ ] Documented in scrapers/README

### References
[docs/06-user-stories.md → US-18](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p0,effort:S"

create_issue "US-19: Expire stale jobs (>30 days)" "M1 — Core MVP" \
"Daily soft-delete jobs not seen for >30 days.

### Acceptance criteria
- [ ] \`UPDATE jobs SET is_expired=true WHERE last_seen_at < now() - interval '30 days' AND is_expired=false\`
- [ ] API filters out expired by default

### References
[docs/06-user-stories.md → US-19](../docs/06-user-stories.md)" \
"type:user-story,area:api,priority:p1,effort:S"

create_issue "US-20: Vercel production deploy on merge to main" "M1 — Core MVP" \
"Auto-deploy production on main.

### Acceptance criteria
- [ ] Merge to main → production deploy within 5 min
- [ ] \`DATABASE_URL\` set in Vercel env
- [ ] No manual steps required

### References
[docs/06-user-stories.md → US-20](../docs/06-user-stories.md)" \
"type:user-story,area:devops,priority:p0,effort:S"

echo "==> Creating M2 issues"

create_issue "US-15: LinkedIn scraper (dummy account)" "M2 — Polish & Launch" \
"Ingest LinkedIn job listings using a disposable account.

### Acceptance criteria
- [ ] Uses \`py-linkedin-jobs-scraper\` with one dummy account
- [ ] Search queries: software/backend/frontend/full-stack engineer
- [ ] 50–100 req/hour cap
- [ ] On 429/ban: log + alert via GH artifact

### References
[docs/06-user-stories.md → US-15](../docs/06-user-stories.md) | [ADR-0001](../docs/adr/0001-linkedin-scraping-strategy.md)" \
"type:user-story,area:api,priority:p0,effort:L"

create_issue "US-16: Threads hiring posts scraper" "M2 — Polish & Launch" \
"Detect 'we're hiring' posts from a seed list of accounts.

### Acceptance criteria
- [ ] Seed list of known founders/eng leaders
- [ ] Keyword match: 'we're hiring', 'hiring', 'looking for'
- [ ] 24h cadence (not 6h)
- [ ] Source \`threads\`, apply_url = post URL

### References
[docs/06-user-stories.md → US-16](../docs/06-user-stories.md) | [ADR-0002](../docs/adr/0002-threads-inclusion.md)" \
"type:user-story,area:api,priority:p1,effort:L"
