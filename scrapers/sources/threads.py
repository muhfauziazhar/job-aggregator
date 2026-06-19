"""Threads scraper (US-16) — scaffold.

Threads has no official jobs API; the plan is to parse public "we're hiring"
posts and extract role/company/apply signal. This is inherently fuzzy and
fragile (HTML/layout changes, rate limits), so it's treated as a bonus signal
source, not a primary feed. See docs/adr/0002-threads-inclusion.md.

Implementation plan: fetch public hiring-tagged posts, filter to genuine job
posts, extract title/company/apply link, map to Job(source="threads", ...) with
tier="unknown" when seniority isn't stated. Tracked in US-16."""

from __future__ import annotations

import logging

from ..common.models import Job

log = logging.getLogger(__name__)


def scrape(session=None, limit: int | None = None) -> list[Job]:
    # TODO(US-16): fetch + parse public hiring posts and map to Job(...).
    log.warning("threads: scraper not yet implemented — skipping")
    return []
