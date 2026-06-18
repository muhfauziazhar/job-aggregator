# 13 — Security & Compliance

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Tech Lead + Legal |
| Status | Draft |

---

## 1. Security Principles

- Authz on every public table / endpoint.
- Service-role / privileged credentials only inside server-side code, never in clients.
- Secrets never ship in client bundles (mobile or web).
- Admin mutations are audited.
- Private data is readable only by the data subject and explicitly authorized roles.
- All transport TLS 1.2+.
- Dependencies scanned weekly; high/critical findings block release.

---

## 2. Authentication

- Provider: `<e.g. Supabase Auth, Auth0, Cognito>`.
- Methods: `<Google / Apple / Email magic-link / etc.>`.
- Session storage: secure platform storage (Keychain / Keystore / httpOnly cookie).
- New users default to the lowest-privilege role.
- Admin role is bootstrapped manually, then managed through admin tools with audit logging.

If iOS app uses Google Sign-In, Apple Sign In is required by App Store policy.

---

## 3. Authorization

- Define roles in `02-technical-requirements.md`.
- Enforce at the data layer (RLS) AND the API layer (defense in depth).
- All authz policies have positive AND negative tests (`10-test-plan.md`).

---

## 4. PII Inventory

| Field | Source | Storage | Retention | Subject access? |
|---|---|---|---|---|
| Email | OAuth | DB (auth schema) | While account active | Yes |
| Display name | User-provided | DB | While account active | Yes |
| Avatar | User-provided | Object storage | While account active | Yes |
| `<sensitive field>` | | | | |

PII fields must never appear in:
- Logs
- Error breadcrumbs (Sentry)
- URLs (use IDs, not emails)
- Analytics events (use anonymous IDs)

---

## 5. Privacy Posture

- No third-party advertising SDK.
- No cross-app tracking.
- Operator may access private user content only for moderation; documented in privacy policy.
- Privacy Policy and Terms of Service live before public launch and are linked in store metadata + in-app.

### Data Retention

| Asset | Retention |
|---|---|
| User content (active account) | Indefinite |
| User content (deleted account) | 30 days then permanent delete or anonymize |
| Audit logs | 1 year minimum |
| Analytics | Aggregated indefinitely; raw events 90 days |
| Backups | 30 days |

### Subject Rights

- Access / export: response within 30 days.
- Erasure: response within 30 days; legal-hold exceptions documented.

---

## 6. Store / Platform Risk

> Adapt to your distribution channel. iOS and Android stores have different policy hot zones.

Common policy traps:

- **Off-platform commerce / digital goods** → handle through store IAP if subject to platform fee, or document why exempt.
- **External messenger CTAs** (WhatsApp / Instagram / phone) → high rejection risk for marketplace apps.
- **Undisclosed data collection** → privacy manifest must match actual behavior.
- **User-generated content without moderation** → must offer block/report + admin removal.
- **Sensitive content categories** (health, finance, kids) → extra review.

Mitigation goes here:

-
-

---

## 7. Audit Logging

- Every admin mutation creates an audit log row: actor, action, target, before/after, timestamp, request_id.
- Audit log is append-only.
- Read access to audit log restricted; documented in this doc.

---

## 8. Vulnerability Response

- Security disclosure via private GitHub Security Advisory (`.github/ISSUE_TEMPLATE/config.yml`).
- Triage SLA: acknowledge within 24h, severity within 72h.
- Critical vulnerabilities patched within 7 days; ship release out-of-band if needed.

---

## 9. Compliance

| Regulation | Applies? | Notes |
|---|---|---|
| GDPR | | If serving EU users |
| CCPA | | If serving California residents |
| HIPAA | | If health data |
| PCI-DSS | | If touching card data directly |
| Local data residency | | |

---

## 10. Release Security Checklist

- [ ] No service-role key or vendor secret in client bundle (verified via build inspection)
- [ ] Authz tests green (positive + negative)
- [ ] Dependency scan clean (no high/critical)
- [ ] Secret scan on repo clean
- [ ] PII inventory matches code reality
- [ ] Privacy policy + ToS updated if behavior changed
- [ ] Penetration test findings addressed (if performed this cycle)
