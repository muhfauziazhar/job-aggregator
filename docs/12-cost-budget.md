# 12 — Cost & Budget

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | PM + Finance |
| Status | Draft |

---

## 1. Cost Drivers

> List the variables that move the bill. Replace with your actual stack.

| Component | Driver |
|---|---|
| `<Hosting / PaaS>` | DB size, function invocations, bandwidth |
| `<Object storage>` | Storage GB, ops, egress |
| `<Realtime / streaming>` | Concurrent connections / minutes |
| `<AI service>` | Tokens or image calls |
| Error tracking | Event volume |
| Mobile / web store fees | Annual / per-transaction |
| Domains, certs, email | Recurring |

---

## 2. Assumptions

| Metric | Pilot | MVP |
|---|---:|---:|
| Active users | | |
| Power users | | |
| `<key load metric>` | | |
| `<key cost metric>` | | |

> Vendor unit prices below are **planning placeholders**, not signed quotes. Refresh during procurement.

---

## 3. Estimated Monthly Cost

Currency: USD. Convert to local currency at finance-approved exchange rate at approval time.

### Pilot

| Component | Unit assumption | Qty | Est. unit cost | Est. total |
|---|---:|---:|---:|---:|
| | | | | |
| **Estimated pilot total** | | | | **$XXX/mo** |

### MVP Scale

| Component | Unit assumption | Qty | Est. unit cost | Est. total |
|---|---:|---:|---:|---:|
| | | | | |
| **Estimated MVP total** | | | | **$XXX/mo** |

---

## 4. One-Time Costs

| Item | Cost | Notes |
|---|---:|---|
| Apple Developer Program | $99/yr | If iOS |
| Google Play Console | $25 once | If Android |
| Domain | | |
| SSL / certs | | Usually included |
| Design assets | | Logo, illustrations |
| Legal review | | Privacy policy, ToS |

---

## 5. Cost Controls

- **Per-tenant / per-seller rate limits** on expensive operations.
- **Daily spend alerts** wired to ops channel (see `19-observability-runbook.md`).
- **Sentry sampling** configured before public launch.
- **AI rate-limits** to prevent runaway spend. When the AI add-on is enabled, LLM-specific cost dynamics — per-query budget, model routing, caching, circuit breakers — live in `25-llm-cost-budget.md`. This file covers infrastructure and SaaS costs at the project level; LLM cost has finer-grained tracking that scales with usage rather than headcount.
- **R2 / object storage lifecycle rules** to expire stale assets.

---

## 6. Budget Approval

| Approver | Role | Date | Decision |
|---|---|---|---|
| | Finance | | |
| | Sponsor | | |
