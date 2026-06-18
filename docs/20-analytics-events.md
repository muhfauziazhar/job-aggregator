# 20 — Analytics Events Catalog

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Product Owner |
| Status | Draft |

---

## 1. Purpose

Single source of truth for the analytics event taxonomy. Engineers implement; product analysts query. If an event isn't in this doc, it shouldn't be in the codebase.

---

## 2. Naming Convention

```
<domain>.<entity>.<action>
```

Examples:
- `auth.user.signed_in`
- `listing.detail.viewed`
- `messaging.conversation.started`

Rules:
- Snake_case throughout.
- Past-tense verb (`viewed`, not `view`).
- Stable across versions (don't rename — deprecate and add new).

---

## 3. Required Properties (every event)

| Property | Type | Notes |
|---|---|---|
| `event_id` | uuid | Idempotency key |
| `event_name` | string | From naming convention |
| `event_time` | iso8601 | Client-emitted; server may add `received_at` |
| `session_id` | uuid | Random UUID per session — must NOT be derived from device id, email, OAuth subject, phone, or other PII |
| `user_id` | uuid \| null | Null for anonymous |
| `app_version` | string | |
| `platform` | string | `ios` / `android` / `web` |
| `env` | string | `staging` / `production` |

---

## 4. Event Catalog

### `auth.*`

| Event | When | Required props |
|---|---|---|
| `auth.user.signed_in` | Successful sign-in | `provider` |
| `auth.user.signed_out` | Sign-out | — |
| `auth.user.sign_in_failed` | Failed attempt | `reason` |

### `<domain>.*`

| Event | When | Required props |
|---|---|---|
| | | |

### `<domain>.*`

---

## 5. PII Rules

Events must NOT include:
- Email
- Phone number
- Full name
- Password / token / API key
- Free-form user content (message body, notes, search query containing PII)

When user input is needed for analytics (e.g. search), capture only what's necessary and document why.

---

## 6. Funnel & KPI Mappings

> Map success metrics from `01-project-charter.md` to the events that compute them.

| KPI | Event(s) | Formula |
|---|---|---|
| `<KPI>` | `<events>` | `<count, ratio, etc.>` |

---

## 7. Adding / Changing Events

1. Open a PR that updates this doc + the implementation in the same change.
2. Get PO approval (CODEOWNER on this file).
3. After merge, the event appears in the dashboards within `<X>` hours.
4. Renames are deprecations: keep the old event firing for 30 days while the new one ramps; then remove.
