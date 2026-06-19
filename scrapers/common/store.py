"""Load / merge / prune / write the published jobs file.

The published file is the single source of truth, so a run is: load existing ->
upsert scraped jobs (keyed by id) -> prune entries older than N days -> write.
This keeps re-runs idempotent (US-18 first-run full crawl just starts from an
empty file) and expires stale jobs (US-19)."""

from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone

from .models import Job
from .normalize import iso_now

# scrapers/common/store.py -> repo root -> public/data/jobs.json
_DATA_PATH = os.path.normpath(
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "..",
        "..",
        "public",
        "data",
        "jobs.json",
    )
)


def data_path() -> str:
    return _DATA_PATH


def load_existing(path: str) -> dict[str, dict]:
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return {job["id"]: job for job in data.get("jobs", []) if "id" in job}


def merge(existing: dict[str, dict], scraped: list[Job]) -> dict[str, dict]:
    for job in scraped:
        existing[job.id] = job.to_dict()
    return existing


def prune(jobs: dict[str, dict], max_age_days: int = 30) -> dict[str, dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)
    kept: dict[str, dict] = {}
    for key, job in jobs.items():
        raw = str(job.get("postedAt", ""))
        try:
            posted = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            kept[key] = job  # keep if we can't parse a date
            continue
        if posted >= cutoff:
            kept[key] = job
    return kept


def write(path: str, jobs: dict[str, dict]) -> int:
    items = sorted(jobs.values(), key=lambda j: j.get("postedAt", ""), reverse=True)
    payload = {"generatedAt": iso_now(), "count": len(items), "jobs": items}
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")
    return len(items)
