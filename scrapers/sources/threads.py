"""Threads scraper (US-16) — best-effort, no-auth.

Threads has no official jobs API. The intended approach was to read public
"#hiring" posts. Probing the public surface (2026-06) shows the tag/search pages
(threads.com/tag/hiring) return only a logged-out **app shell**: the post data is
loaded afterwards via authenticated Relay/GraphQL calls, so the initial HTML
contains no posts to parse.

This module therefore makes a genuine best-effort attempt — fetch the public tag
page and parse any embedded post JSON it finds — but returns nothing when the
page is gated (the current reality). It never raises, so it can't break a run.

A real implementation would need a logged-in Threads/Instagram session (cookies +
lsd token) and a replicated GraphQL query for the hashtag feed, then NLP-ish
filtering of free-text posts into role/company/apply signal. That's fragile and
low-yield; tracked as future work in US-16 / ADR-0002."""

from __future__ import annotations

import json
import logging
import re

import requests

from ..common.models import Job
from ..common.normalize import iso_now, strip_html

log = logging.getLogger(__name__)

TAG_URL = "https://www.threads.com/tag/hiring"

_BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

_HIRING_RE = re.compile(r"\b(hiring|we'?re hiring|join (our|the) team|open role|apply)\b", re.I)
# Post blobs embedded by Meta carry a caption.text and a permalink code.
_CAPTION_RE = re.compile(r'"caption"\s*:\s*\{[^}]*?"text"\s*:\s*"([^"]{20,})"')
_CODE_RE = re.compile(r'"code"\s*:\s*"([A-Za-z0-9_-]{8,})"')


def _parse_embedded_posts(html: str) -> list[Job]:
    jobs: list[Job] = []
    for block in re.findall(r'<script type="application/json"[^>]*>(.*?)</script>', html, re.S):
        if '"caption"' not in block:
            continue
        for cap_match in _CAPTION_RE.finditer(block):
            text = json.loads(f'"{cap_match.group(1)}"')  # unescape
            if not _HIRING_RE.search(text):
                continue
            code_match = _CODE_RE.search(block)
            code = code_match.group(1) if code_match else None
            if not code:
                continue
            jobs.append(
                Job(
                    source="threads",
                    externalId=code,
                    title=strip_html(text)[:80] or "Hiring post",
                    company="(Threads post)",
                    location="Unknown",
                    description=strip_html(text),
                    applyUrl=f"https://www.threads.com/t/{code}",
                    postedAt=iso_now(),
                    tier="unknown",
                )
            )
    return jobs


def scrape(session=None, limit: int | None = None) -> list[Job]:
    try:
        resp = requests.get(
            TAG_URL,
            headers={"User-Agent": _BROWSER_UA, "Accept-Language": "en-US,en;q=0.9"},
            timeout=30,
        )
    except requests.RequestException as exc:
        log.warning("threads: fetch failed (%s) — skipping", exc)
        return []

    if resp.status_code != 200:
        log.warning("threads: HTTP %s — skipping", resp.status_code)
        return []

    jobs = _parse_embedded_posts(resp.text)
    if not jobs:
        log.warning(
            "threads: no public post data in page (auth-gated) — skipping (US-16)"
        )
        return jobs[:limit] if limit else jobs

    log.info("threads: parsed %d hiring posts", len(jobs))
    return jobs[:limit] if limit else jobs
