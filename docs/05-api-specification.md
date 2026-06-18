# 05 — API & Integration Specification

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Backend Engineer |
| Status | Draft |

---

## 1. Overview

API surface for {{PRODUCT_NAME}}.

| Surface | Used by | Auth |
|---|---|---|
| Direct DB / ORM (RLS-protected reads & writes) | Client | User JWT |
| Server functions / API endpoints | Client | User JWT |
| Webhooks (inbound) | External services | Signing secret |
| Internal admin endpoints | Admin UI / scripts | Service role |

---

## 2. Conventions

### 2.1 Base URL

| Env | URL |
|---|---|
| local | `http://localhost:<port>` |
| staging | `https://staging.api.{{PRODUCT_NAME_LOWER}}.<tld>` |
| production | `https://api.{{PRODUCT_NAME_LOWER}}.<tld>` |

### 2.2 Auth header

```
Authorization: Bearer <jwt>
```

### 2.3 Request ID

Every request must include or be assigned `X-Request-Id` (UUID v4). The server echoes it in responses and logs.

### 2.4 Error Envelope (standard)

All non-2xx responses use this shape:

```json
{
  "error": {
    "code": "string.snake_case",
    "message": "Human-readable summary",
    "details": { "field": "optional structured detail" },
    "request_id": "uuid"
  }
}
```

| HTTP | When |
|---|---|
| 400 | Validation failure (`code: "validation_failed"`) |
| 401 | Missing / invalid auth |
| 403 | Authn'd but not authorized |
| 404 | Resource not found OR hidden by RLS (don't leak existence) |
| 409 | Conflict (uniqueness, state mismatch) |
| 422 | Semantic validation failure |
| 429 | Rate-limited (`Retry-After` header set) |
| 500 | Unexpected server error (logged; client shows generic copy) |
| 503 | Dependency down (degraded mode) |

### 2.5 Pagination

Cursor-based by default:

```
GET /resources?limit=50&cursor=<opaque>
```

Response:

```json
{
  "data": [ ... ],
  "next_cursor": "opaque-or-null"
}
```

### 2.6 Idempotency

Mutating endpoints accept `Idempotency-Key` header. Server stores result for 24h and replays on retry.

---

## 3. Endpoints

> Group by domain. Each entry: method, path, auth required, request, response, error cases.

### 3.1 `<Domain — e.g. Auth>`

#### `POST /<endpoint>`

**Purpose:**

**Auth:** required / optional / service role

**Request:**

```json
{
}
```

**Response 200:**

```json
{
}
```

**Errors:**

| Code | Trigger |
|---|---|
| `validation_failed` | |
| `not_found` | |

---

### 3.2 `<Domain 2>`

---

## 4. Webhooks (Inbound)

| Source | Endpoint | Verification |
|---|---|---|
| | | HMAC-SHA256 over body, header `X-Signature`, secret in vault |

---

## 5. External Integrations (Outbound)

| Service | Purpose | Auth | Rate limit |
|---|---|---|---|
| | | | |

---

## 6. Realtime / Streaming

| Channel | Payload | Subscribers |
|---|---|---|

---

## 7. Versioning

API uses URL path versioning when needed: `/v1/...`. Breaking changes require a new version + 90-day deprecation window.

---

## 8. Open Questions

| ID | Question | Owner | Due |
|---|---|---|---|
