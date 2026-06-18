# 11 — DevOps & Deployment

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | DevOps |
| Status | Draft |

---

## 1. Repositories

| Repo | Purpose |
|---|---|
| `{{ORG_NAME}}/{{REPO_NAME}}` | Application code + this `docs/` folder |
| `{{ORG_NAME}}/<infra-repo>` | IaC (Terraform / Pulumi) — if separated |
| `{{ORG_NAME}}/<landing-repo>` | Marketing / landing site — out of scope here |

---

## 2. Environments

| Env | Purpose | Data | Access |
|---|---|---|---|
| local | Individual development | Seeded | Engineer |
| staging | QA, pilot, store review builds | Sanitized snapshot | Team + selected pilot users |
| production | Live | Real | End users |

Environments are isolated: separate databases, storage buckets, vendor accounts, and secrets.

---

## 3. CI Pipeline

| Stage | Action | Fails if |
|---|---|---|
| Lint | `<linter>` | Style violations |
| Typecheck | `<tsc / mypy / etc>` | Any type error |
| Unit tests | `<jest / vitest / pytest>` | Any failure |
| Integration tests | DB + API + authz | Any failure |
| Build | Production build | Build error |
| Security scan | Dependency audit + secret scan | High/Critical findings |
| Coverage | Coverage report | Drops > 5% from main |

CI runs on every PR and on `main` after merge.

---

## 4. CD Pipeline

| Trigger | Target | Approval |
|---|---|---|
| Merge to `main` | Staging | Automatic |
| Tag `vYYYY.MM.DD.N` | Production | Manual approval (Tech Lead or DevOps) |

Releases use **expand → migrate → contract** for breaking schema changes — never break and re-deploy.

---

## 5. Mobile Build (if applicable)

- `<Expo Dev Client / native CLI>` for development builds.
- `<EAS Build / Fastlane>` profiles: `development`, `preview`, `production`.
- `<EAS Update / CodePush>` channels match build profiles.
- iOS: TestFlight for pilot, App Store for production.
- Android: Internal testing track → closed testing → production (when applicable).

---

## 6. Web Build (if applicable)

- `<Vercel / Cloudflare Pages / static host>` for production.
- Preview deployments per PR for visual review.

---

## 7. Backend Deploy

- Database migrations reviewed via PR; never edited after merge.
- Migrations applied **before** application code referencing them.
- Server functions deployed after migrations.
- Production deploy is staged: canary → 25% → 100% if applicable.

---

## 8. Secrets Management

- Secrets live in `<vault — e.g. GitHub Actions secrets, Doppler, 1Password>`.
- Never committed to repo.
- Rotated on a schedule and after any contractor offboarding.
- Per-environment isolation enforced.

Required secrets (enumerate as the project grows):

```
DATABASE_URL
SERVICE_ROLE_KEY
<VENDOR_A>_API_KEY
<VENDOR_B>_API_KEY
SENTRY_DSN
```

---

## 9. Observability Wiring

| Signal | Tool | Owner |
|---|---|---|
| Client crashes / errors | Sentry | Frontend |
| Server logs | `<centralized log tool>` | DevOps |
| DB performance | Provider dashboard + slow query log | Backend |
| Business events | Internal analytics tables → `20-analytics-events.md` | PO |
| Vendor cost / usage | Vendor dashboards + cron alerts | DevOps |

Alerting rules + on-call: `19-observability-runbook.md`.

---

## 10. Backup & Disaster Recovery

| Asset | Backup | Retention | RTO | RPO |
|---|---|---|---|---|
| Database | Daily full + PITR | 30 days | 1 hr | 5 min |
| Object storage | Versioned bucket | 90 days | 1 hr | N/A |
| Secrets | Vault export quarterly | Indefinite | manual | N/A |

DR drill: at least once before MVP launch, then yearly.

---

## 11. Release Tagging

`vYYYY.MM.DD.N` until semver becomes meaningful. Tag created from `main` after Release DoD passes.
