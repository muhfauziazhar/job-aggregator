# 21 — Feature Flags & Rollout

| Field | Value |
|---|---|
| Version | 0.1 |
| Owner | Tech Lead |
| Status | Draft |

---

## 1. When to Use a Flag

Use a flag when:

- The feature is large enough to need progressive rollout.
- The feature touches a risky or expensive code path.
- The feature is launching to a subset of users (pilot, A/B, beta).
- A kill switch is valuable in case of regression.

Don't use a flag for:

- Trivial PRs that ship in one release.
- Pure refactors with no behavioral change.

---

## 2. Flag Types

| Type | Lifetime | Example |
|---|---|---|
| **Release flag** | Days–weeks | Hide a feature until ready to launch |
| **Operational kill switch** | Permanent | Disable a degraded vendor integration without redeploy |
| **Permission flag** | Permanent | Gate an admin-only feature |
| **Experiment flag** | Days–months | A/B test a UX change |

Release and experiment flags must have an **expiry**. When expired, the flag is removed and the winning code path becomes default.

---

## 3. Naming

```
<area>.<feature>.<scope>
```

Examples:
- `messaging.unread_badge.enabled`
- `live.replay.experiment`
- `vendor.zegocloud.kill_switch`

---

## 4. Flag Catalog

| Flag | Type | Default | Owner | Sunset |
|---|---|---|---|---|
| | | | | |

---

## 5. Rollout Procedure

1. Land code behind flag (default off).
2. Enable in staging; verify.
3. Enable for internal users (1–5 accounts) in production; verify.
4. Ramp: 1% → 10% → 50% → 100% with checkpoints between (typically 24h).
5. At 100% for `<N>` days with no regression, remove the flag.

If any checkpoint shows regression:
- Roll back to previous percentage.
- Investigate before resuming.
- Document the finding in the flag's tracking issue.

---

## 6. Tooling

| Concern | Tool |
|---|---|
| Flag store | `<vendor / DB table / config>` |
| Targeting | `<rules / percentage / user list>` |
| Audit | `<log of who flipped what when>` |

---

## 7. Cleanup Cadence

Flags are reviewed monthly. Any flag that has been at 100% for `> 30 days` is a candidate for removal. Tech Lead is accountable for keeping the catalog clean.
