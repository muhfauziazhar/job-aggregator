# 02 — Technical Requirements

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Tech Lead |
| Status | Draft |

---

## 1. Functional Requirements

> Use `FR-<DOMAIN>-NN` IDs. Priority: **Must** (MVP gate) / **Should** (preferred) / **Could** (nice-to-have) / **Won't** (explicitly excluded for this version).

### 1.1 `<Domain 1>` — e.g. Buyer / Customer / Reader

| ID | Requirement | Priority |
|---|---|---|
| FR-XXX-01 | | Must |
| FR-XXX-02 | | Must |

### 1.2 `<Domain 2>`

| ID | Requirement | Priority |
|---|---|---|

### 1.3 Backend / Service Layer

| ID | Requirement | Priority |
|---|---|---|

### 1.4 Admin / Operator

| ID | Requirement | Priority |
|---|---|---|

---

## 2. Non-Functional Requirements

### 2.1 Performance

| ID | Requirement | Target |
|---|---|---|
| NFR-PERF-01 | API p95 latency | `< 300ms` |
| NFR-PERF-02 | Cold start (mobile) | `< 2.5s` |
| NFR-PERF-03 | Bundle size (mobile, JS) | `< 4 MB` |
| NFR-PERF-04 | Time to interactive (web) | `< 3s on 4G` |

### 2.2 Reliability

| ID | Requirement | Target |
|---|---|---|
| NFR-REL-01 | Uptime (production) | `99.5%` monthly |
| NFR-REL-02 | Crash-free sessions | `>= 99.5%` |
| NFR-REL-03 | RTO (recovery time objective) | `< 1 hour` |
| NFR-REL-04 | RPO (recovery point objective) | `< 5 minutes` |

### 2.3 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | Authn via `<provider>` only; no password storage |
| NFR-SEC-02 | Authz via `<RLS / RBAC / scopes>` |
| NFR-SEC-03 | Secrets stored in `<vault>`; never in client bundle |
| NFR-SEC-04 | All API calls over HTTPS / TLS 1.2+ |

### 2.4 Privacy

| ID | Requirement |
|---|---|
| NFR-PRIV-01 | PII inventory documented in `13-security-compliance.md` |
| NFR-PRIV-02 | Right-to-erasure flow specified |
| NFR-PRIV-03 | Audit log for admin access to private user data |

### 2.5 Accessibility

| ID | Requirement |
|---|---|
| NFR-A11Y-01 | All interactive elements have accessible labels |
| NFR-A11Y-02 | Color contrast meets WCAG AA |
| NFR-A11Y-03 | Critical journeys testable with screen reader |

### 2.6 Observability

| ID | Requirement |
|---|---|
| NFR-OBS-01 | Errors flow to Sentry (or equivalent) |
| NFR-OBS-02 | Edge / API logs centralized to `<tool>` |
| NFR-OBS-03 | Business events flow to `20-analytics-events.md` catalog |

### 2.7 Compatibility

| ID | Requirement |
|---|---|
| NFR-COMPAT-01 | Mobile: `<min iOS / Android version>` |
| NFR-COMPAT-02 | Web: `<browser matrix>` |

---

## 3. Constraints

- `<e.g. iOS-first; Android is post-MVP>`
- `<e.g. Single region; multi-region is post-MVP>`

---

## 4. Open Questions

| ID | Question | Owner | Due |
|---|---|---|---|
