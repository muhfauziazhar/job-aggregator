"""Shared HTTP session: sane User-Agent, timeouts and retry/backoff."""

from __future__ import annotations

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

USER_AGENT = (
    "job-aggregator/0.1 (+https://github.com/muhfauziazhar/job-aggregator)"
)


def make_session() -> requests.Session:
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=1.5,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET"],
        respect_retry_after_header=True,
    )
    session.mount("https://", HTTPAdapter(max_retries=retry))
    session.headers.update(
        {"User-Agent": USER_AGENT, "Accept": "application/json"}
    )
    return session
