"""LinkedIn scraper (US-15) — scaffold.

LinkedIn forbids automated scraping in its TOS and aggressively blocks
datacenter IPs (which is what GitHub Actions runners use). This module is
therefore a guarded scaffold: it only attempts a scrape when LINKEDIN_EMAIL /
LINKEDIN_PASSWORD are present, and otherwise returns nothing so the rest of the
pipeline keeps working. See docs/adr/0001-linkedin-scraping-strategy.md.

Implementation plan: use spinlud/py-linkedin-jobs-scraper (Selenium) with the
disposable account, cap to 50-100 req/hour, optional RESIDENTIAL_PROXY_URL.
Map each result into a Job(source="linkedin", ...). Tracked in US-15."""

from __future__ import annotations

import logging
import os

from ..common.models import Job

log = logging.getLogger(__name__)


def scrape(session=None, limit: int | None = None) -> list[Job]:
    email = os.environ.get("LINKEDIN_EMAIL")
    password = os.environ.get("LINKEDIN_PASSWORD")
    if not email or not password:
        log.warning(
            "linkedin: LINKEDIN_EMAIL/PASSWORD not set — skipping (see US-15)"
        )
        return []

    # TODO(US-15): drive py-linkedin-jobs-scraper here and map to Job(...).
    log.warning("linkedin: scraper not yet implemented — skipping")
    return []
