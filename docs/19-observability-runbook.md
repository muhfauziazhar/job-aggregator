# 19 — Observability & Runbook

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | DevOps |
| Status | Draft |

---

## 0. Deployment

Hosting is **Vercel**, project `job-aggregator` (team `muhfauziazhars-projects`), connected to the GitHub repo for automatic deploys.

| Trigger | Result |
|---|---|
| Push to `main` | Production deploy |
| Open / update a PR | Preview deploy with its own URL (commented on the PR) |

**Production URL:** https://job-aggregator-gold.vercel.app

**Environment variables** (set in Vercel project settings, all three targets):

| Key | Production | Preview | Development |
|---|---|---|---|
| `DATABASE_URL` | ✓ | ✓ | ✓ |

Points at the dedicated `jobagg` database on the shared Postgres host. Prisma 7 reads it via `prisma.config.ts` + dotenv locally; on Vercel it comes from the project env.

**Adding a new env var** (preview target needs the REST API because the CLI prompts interactively for a branch):

```bash
curl -s -X POST \
  "https://api.vercel.com/v10/projects/$PROJECT_ID/env?teamId=$TEAM_ID&upsert=true" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"KEY","value":"VALUE","type":"encrypted","target":["preview"]}'
```

Production / development targets work fine with `vercel env add KEY production`.

**Migrations** are not run automatically on deploy. Apply schema changes manually before merging the PR that needs them: `pnpm exec prisma migrate deploy` against the target database.

---

## 1. Signals We Watch

| Signal | Source | Why |
|---|---|---|
| Error rate (client) | Sentry | User-visible breakage |
| Error rate (server) | Logs / APM | Backend health |
| Latency p95 | APM | UX + capacity |
| Database connections | Provider dashboard | Capacity headroom |
| Job queue depth (if any) | Queue dashboard | Backpressure |
| Vendor cost per day | Vendor dashboards / cron | Cost runaway |
| `<key business KPI>` | Analytics dashboard | Real impact |

---

## 2. Alert Rules

| Alert | Condition | Severity | Routes to |
|---|---|---|---|
| Error rate spike | > 5% over 5 min | S2 | On-call |
| Latency p95 high | > 2× baseline for 10 min | S2 | On-call |
| 5xx burst | > 50/min | S2 | On-call |
| Auth failure spike | > 100/min | S2 | On-call + security |
| Unhandled crash spike (mobile) | > 0.5% of sessions | S2 | On-call |
| Vendor cost daily | > N% above 30-day avg | S3 | DevOps channel |
| Backup not completed | last backup older than 26h | S2 | DevOps + on-call |
| Cert expiring | < 14 days | S3 | DevOps |
| Storage > 80% | | S3 | DevOps |

S1 = page immediately, 24/7.
S2 = page during business hours, message off-hours.
S3 = message only.

---

## 3. On-Call

| Period | Primary | Secondary | Notes |
|---|---|---|---|
| Business hours | rotation | TL | |
| Off-hours | rotation | DevOps | Only S1 + S2 escalates off-hours |

Rotation managed in `<PagerDuty / Opsgenie / cron>`.

---

## 4. Incident Severity

| Level | Definition | Response |
|---|---|---|
| **SEV-1** | Production down or data loss for any user | Immediate page; war-room; status page; PM update every 30 min |
| **SEV-2** | Major feature broken; many users affected; no workaround | Page; fix or workaround in working hours |
| **SEV-3** | Minor feature broken or one user affected | Triage in business hours |
| **SEV-4** | Cosmetic / non-blocking | Backlog |

---

## 5. Incident Workflow

1. **Acknowledge** the alert (within 5 min).
2. **Open an incident channel** — name format: `inc-YYYY-MM-DD-short-name`.
3. **Triage** — determine severity, assign Incident Commander, communicate to stakeholders.
4. **Mitigate** — restore service first, root-cause later. Use feature flags or rollback if mitigation is faster than fix.
5. **Communicate** — status updates every 30 min for SEV-1 / SEV-2, including customer-facing copy.
6. **Resolve** — service restored, monitor for recurrence at least 1 hour.
7. **Postmortem** — written within 5 business days for any SEV-1 / SEV-2. See template below.

---

## 6. Postmortem Template

```markdown
# Postmortem: <incident name>

- Date:
- Duration:
- Severity:
- Incident Commander:

## Summary

## Impact

## Timeline (UTC)

- HH:MM — alert fired
- HH:MM — IC assigned
- HH:MM — mitigation
- HH:MM — resolved

## Root Cause

## What Went Well

## What Went Poorly

## Action Items

| # | Action | Owner | Due |
|---|---|---|---|
```

Postmortems are blameless. Action items are tracked as GitHub issues.

---

## 7. Common Runbooks

> Add a runbook every time an incident is resolved. The next on-call deserves a head start.

### RB-01 — `<symptom>`

**Symptom:**

**Likely cause:**

**Diagnose:**

```bash
# command(s) to verify
```

**Mitigate:**

```bash
# command(s) to fix or work around
```

**Verify:**

```bash
# command(s) to confirm fix
```

**Escalate when:** `<condition>`.

---

### RB-02 — `<symptom>`

---

## 8. Rollback Procedure

| Component | Rollback method | Time to safe state |
|---|---|---|
| Application code | Re-deploy previous tag | < 5 min |
| Database migration | `<expand/contract pattern; revert migration NN>` | < 15 min |
| Mobile build | Stop OTA channel rollout; force update if critical | < 30 min for OTA |
| Feature flag | Toggle off in `<flag tool>` | < 1 min |

Rolling back is normal. Don't be a hero.

---

## 9. Disaster Recovery Drill

- At least once before MVP launch and once per year after.
- Restore from backup into a scratch environment, run smoke tests, document RTO/RPO actuals.
- Update this doc with any deviations from documented targets.
