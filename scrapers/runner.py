"""Scraper entrypoint.

Usage:
    python -m scrapers.runner --source all
    python -m scrapers.runner --source remoteok --mode full
    python -m scrapers.runner --source remoteok --limit 50 --dry-run

Loads the existing published jobs file, runs the selected source(s), upserts the
results, prunes entries older than --max-age days, and writes the file back.
Run from the repo root."""

from __future__ import annotations

import argparse
import logging
import sys

from .common import store
from .common.http import make_session
from .sources import linkedin, remoteok, threads

SOURCES = {
    "remoteok": remoteok.scrape,
    "linkedin": linkedin.scrape,
    "threads": threads.scrape,
}

log = logging.getLogger("scrapers")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Job Aggregator scrapers")
    p.add_argument(
        "--source",
        default="all",
        choices=[*SOURCES.keys(), "all"],
        help="source to scrape (default: all)",
    )
    p.add_argument(
        "--mode",
        default="incremental",
        choices=["full", "incremental"],
        help="full crawl vs incremental (advisory; sources self-manage)",
    )
    p.add_argument("--limit", type=int, default=None, help="cap jobs per source")
    p.add_argument(
        "--max-age", type=int, default=30, help="prune jobs older than N days"
    )
    p.add_argument(
        "--dry-run",
        action="store_true",
        help="scrape and report counts but don't write the file",
    )
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
    )
    args = parse_args(argv)

    selected = list(SOURCES) if args.source == "all" else [args.source]
    path = store.data_path()
    existing = store.load_existing(path)
    log.info("loaded %d existing jobs from %s", len(existing), path)

    session = make_session()
    total_scraped = 0
    for name in selected:
        try:
            jobs = SOURCES[name](session=session, limit=args.limit)
        except Exception as exc:  # one bad source shouldn't kill the run
            log.error("source %s failed: %s", name, exc)
            continue
        log.info("source %s: scraped %d jobs", name, len(jobs))
        total_scraped += len(jobs)
        existing = store.merge(existing, jobs)

    before = len(existing)
    existing = store.prune(existing, max_age_days=args.max_age)
    log.info("pruned %d stale jobs (>%dd)", before - len(existing), args.max_age)

    if args.dry_run:
        log.info("dry-run: would write %d jobs (scraped %d)", len(existing), total_scraped)
        return 0

    count = store.write(path, existing)
    log.info("wrote %d jobs to %s", count, path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
