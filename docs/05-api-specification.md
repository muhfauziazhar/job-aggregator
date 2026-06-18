# 05 — API Specification

Public read-only API. No auth, no writes from client. All responses JSON.

---

## 1. Conventions

- Base URL: `https://jobagg.muhfauziazhar.com/api` (placeholder, set at deploy)
- Content-Type: `application/json`
- All times ISO 8601 UTC
- Pagination: cursor-based
- Errors: `{ "error": { "code": "string", "message": "string", "details"?: {} } }`

---

## 2. Endpoints

### `GET /api/jobs`

List jobs with filter + sort + paginate.

**Query parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `q` | string | — | Full-text search across title/company/description |
| `source` | string[] | — | Filter by source. Repeat param or comma-separate |
| `tier` | string[] | — | `entry`, `mid`, `senior`, etc. |
| `remote` | string[] | — | `remote`, `hybrid`, `onsite` |
| `tech` | string[] | — | Tech-stack tags. Repeat/comma |
| `company` | string | — | Exact match (case-insensitive) |
| `posted_after` | ISO date | — | `posted_at >= posted_after` |
| `sort` | enum | `recent` | `recent` \| `relevance` (only with `q`) |
| `cursor` | string | — | Opaque cursor from prior response |
| `limit` | int | `20` | Max `100` |

**Response 200:**

```json
{
  "data": [
    {
      "id": "uuid",
      "source": "greenhouse",
      "title": "Senior Backend Engineer",
      "company": "Acme Inc",
      "location": "Remote (US)",
      "remote_type": "remote",
      "tier": "senior",
      "tech_stack": ["go", "postgres"],
      "salary_min": 150000,
      "salary_max": 200000,
      "salary_currency": "USD",
      "apply_url": "https://...",
      "posted_at": "2026-06-15T10:00:00Z",
      "first_seen_at": "2026-06-15T10:05:23Z"
    }
  ],
  "next_cursor": "string|null",
  "total_estimate": 12345
}
```

---

### `GET /api/jobs/:id`

Single job detail.

**Response 200:** Full job object including `description`, `raw` (truncated to 50KB).

**Response 404:** `{ "error": { "code": "not_found" } }`

---

### `GET /api/sources`

List sources with aggregate counts.

**Response 200:**

```json
{
  "data": [
    { "source": "greenhouse", "active_count": 82341, "last_run_at": "...", "last_run_status": "success" },
    ...
  ]
}
```

---

### `GET /api/stats`

High-level system stats.

**Response 200:**

```json
{
  "total_active": 234567,
  "by_source": { "greenhouse": 82341, ... },
  "by_tier": { "mid": 120000, ... },
  "freshness_p50_hours": 4.2,
  "freshness_p90_hours": 11.8
}
```

---

## 3. Errors

| HTTP | Code | When |
|---|---|---|
| 400 | `invalid_query` | Bad filter, e.g. unknown source |
| 404 | `not_found` | Job id not in DB |
| 429 | `rate_limited` | IP exceeded quota (e.g. 60 req/min) |
| 500 | `internal_error` | Unhandled exception (logged server-side) |

---

## 4. Rate Limiting

- Anonymous IP: 60 req/min, burst 100.
- Strategy: Vercel Edge Middleware + Upstash Redis (or simple in-memory if self-hosting single region).
- 429 includes `Retry-After` header.

---

## 5. Versioning

- Path-based: `/api/v1/...` once we ship breaking changes.
- For MVP, no `/v1` prefix; add when needed.
