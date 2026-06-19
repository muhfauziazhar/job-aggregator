"""RemoteOK scraper (US-12).

RemoteOK exposes a single public JSON endpoint that returns the full active
feed. The first array element is a legal/metadata notice, not a job, so we skip
any element without an id/position. All RemoteOK jobs are remote by definition."""

from __future__ import annotations

import re

import requests

from ..common.classify import classify_tier, extract_tech
from ..common.http import make_session
from ..common.models import Job
from ..common.normalize import strip_html, to_iso

API_URL = "https://remoteok.com/api"

_ENG_TITLE = re.compile(
    r"\b(software|engineer|developer|programmer|swe|sde|back[- ]?end|front[- ]?end|full[- ]?stack|devops|sre|platform|mobile|ios|android|data engineer|data scientist|data analyst|machine learning)\b",
    re.I,
)


def _is_engineering(title: str) -> bool:
    # Title-driven: tech tags alone are too noisy (a bare "go"/"react" mention in
    # a non-eng description would otherwise let it through).
    return bool(_ENG_TITLE.search(title))


def scrape(
    session: requests.Session | None = None, limit: int | None = None
) -> list[Job]:
    session = session or make_session()
    resp = session.get(API_URL, timeout=30)
    resp.raise_for_status()
    feed = resp.json()

    jobs: list[Job] = []
    for item in feed:
        if not isinstance(item, dict) or "id" not in item or not item.get("position"):
            continue  # legal/metadata header or malformed entry

        title = str(item.get("position", "")).strip()
        description = strip_html(item.get("description"))
        tags = " ".join(str(t) for t in item.get("tags", []) if t)
        if not _is_engineering(title):
            continue

        # Tag from the title + RemoteOK's curated tags only. Scanning the
        # free-text description produces false positives (e.g. "go" the verb,
        # "scala" inside "scalable").
        tech = extract_tech(f"{title} {tags}")

        salary_min = item.get("salary_min") or None
        salary_max = item.get("salary_max") or None

        jobs.append(
            Job(
                source="remoteok",
                externalId=str(item["id"]),
                title=title,
                company=(item.get("company") or "").strip() or "Unknown",
                location=(item.get("location") or "").strip() or "Remote",
                remoteType="remote",
                description=description,
                applyUrl=(
                    item.get("apply_url")
                    or item.get("url")
                    or f"https://remoteok.com/remote-jobs/{item['id']}"
                ),
                postedAt=to_iso(item.get("date") or item.get("epoch")),
                salaryMin=int(salary_min) if salary_min else None,
                salaryMax=int(salary_max) if salary_max else None,
                salaryCurrency="USD" if (salary_min or salary_max) else None,
                tier=classify_tier(title),
                techStack=tech,
            )
        )
        if limit and len(jobs) >= limit:
            break

    return jobs
