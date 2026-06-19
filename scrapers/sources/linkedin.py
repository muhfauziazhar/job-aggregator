"""LinkedIn scraper (US-15).

Uses LinkedIn's public *guest* jobs endpoint — no login, no Selenium. It returns
HTML job cards that we parse with BeautifulSoup; the full description is fetched
per job from the guest jobPosting endpoint (best-effort, skipped on failure).

Reality check: these endpoints are rate-limited and block datacenter IPs (like
GitHub Actions runners) aggressively. So the scraper is deliberately polite (low
volume, delays) and *graceful* — on a 429/block it logs and returns whatever it
got rather than failing the whole run. Set RESIDENTIAL_PROXY_URL to improve
reliability on CI. See docs/adr/0001-linkedin-scraping-strategy.md."""

from __future__ import annotations

import logging
import os
import re
import time

import requests
from bs4 import BeautifulSoup

from ..common.classify import classify_tier, extract_tech
from ..common.models import Job
from ..common.normalize import strip_html, to_iso

log = logging.getLogger(__name__)

LIST_URL = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
DETAIL_URL = "https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"

_BROWSER_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# Indonesia + Remote-worldwide, software engineering. f_WT=2 = remote;
# f_TPR=r2592000 = posted in the last 30 days (matches our prune window).
QUERIES: list[dict] = [
    {"keywords": "software engineer", "location": "Indonesia", "remote": False},
    {"keywords": "software engineer", "location": "Worldwide", "remote": True},
]

_PAGES_PER_QUERY = 3  # 10 cards per page
_PAGE_SIZE = 10
_REQUEST_DELAY = 1.0  # seconds between requests, be polite
_JOB_ID_RE = re.compile(r"-(\d{6,})(?:\?|$)")


def _make_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": _BROWSER_UA,
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
        }
    )
    proxy = os.environ.get("RESIDENTIAL_PROXY_URL")
    if proxy:
        session.proxies.update({"http": proxy, "https": proxy})
        log.info("linkedin: using residential proxy")
    return session


def _job_id(href: str) -> str | None:
    m = _JOB_ID_RE.search(href.split("?")[0] + "?")
    return m.group(1) if m else None


def _fetch_description(session: requests.Session, job_id: str) -> str:
    try:
        resp = session.get(DETAIL_URL.format(job_id=job_id), timeout=20)
        if resp.status_code != 200:
            return ""
        soup = BeautifulSoup(resp.text, "html.parser")
        el = soup.select_one(".show-more-less-html__markup") or soup.select_one(
            ".description__text"
        )
        return strip_html(str(el)) if el else ""
    except requests.RequestException:
        return ""


def _parse_cards(html: str, remote: bool) -> list[tuple[str, Job]]:
    """Returns (job_id, partial Job) pairs; description filled in later."""
    soup = BeautifulSoup(html, "html.parser")
    out: list[tuple[str, Job]] = []
    for card in soup.select("li"):
        title_el = card.select_one("h3.base-search-card__title")
        link_el = card.select_one("a.base-card__full-link")
        if not title_el or not link_el:
            continue
        href = link_el.get("href", "")
        job_id = _job_id(href)
        if not job_id:
            continue

        company_el = card.select_one("h4.base-search-card__subtitle")
        loc_el = card.select_one(".job-search-card__location")
        time_el = card.select_one("time")
        posted = (time_el.get("datetime") if time_el else None) or (
            time_el.get_text(strip=True) if time_el else None
        )
        title = title_el.get_text(strip=True)

        out.append(
            (
                job_id,
                Job(
                    source="linkedin",
                    externalId=job_id,
                    title=title,
                    company=(company_el.get_text(strip=True) if company_el else "")
                    or "Unknown",
                    location=(loc_el.get_text(strip=True) if loc_el else "")
                    or "Unknown",
                    remoteType="remote" if remote else "unknown",
                    description="",
                    applyUrl=href.split("?")[0],
                    postedAt=to_iso(posted),
                    tier=classify_tier(title),
                    techStack=extract_tech(title),
                ),
            )
        )
    return out


def scrape(
    session: requests.Session | None = None, limit: int | None = None
) -> list[Job]:
    session = _make_session()  # always a browser-headed session
    seen: set[str] = set()
    jobs: list[Job] = []
    blocked = False

    for query in QUERIES:
        if blocked:
            break
        for page in range(_PAGES_PER_QUERY):
            params = {
                "keywords": query["keywords"],
                "location": query["location"],
                "f_TPR": "r2592000",
                "start": page * _PAGE_SIZE,
            }
            if query["remote"]:
                params["f_WT"] = "2"
            try:
                resp = session.get(LIST_URL, params=params, timeout=30)
            except requests.RequestException as exc:
                log.warning("linkedin: request failed (%s) — stopping", exc)
                blocked = True
                break
            if resp.status_code == 429:
                log.warning("linkedin: rate-limited (429) — stopping early")
                blocked = True
                break
            if resp.status_code != 200 or not resp.text.strip():
                break  # no more results for this query

            cards = _parse_cards(resp.text, remote=query["remote"])
            if not cards:
                break
            for job_id, job in cards:
                if job_id in seen:
                    continue
                seen.add(job_id)
                job.description = _fetch_description(session, job_id)
                if job.description:
                    job.techStack = extract_tech(f"{job.title} {job.description}")
                jobs.append(job)
                if limit and len(jobs) >= limit:
                    return jobs
                time.sleep(_REQUEST_DELAY)
            time.sleep(_REQUEST_DELAY)

    log.info("linkedin: collected %d jobs", len(jobs))
    return jobs
