"""Seniority tier classifier (US-13) and tech-stack tagger (US-14).

Both are keyword heuristics over the title/description — deliberately simple and
deterministic so they're cheap to run and easy to unit test. Refine the keyword
tables as gaps show up rather than reaching for ML."""

from __future__ import annotations

import re

# --- Tier classifier ---------------------------------------------------------

# Checked in order; first match wins. Ordering matters: intern/principal/staff
# are more specific than senior/entry, and senior is checked before entry.
_TIER_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("intern", re.compile(r"\b(intern|internship|co-?op)\b", re.I)),
    ("principal", re.compile(r"\b(principal|distinguished|fellow)\b", re.I)),
    ("staff", re.compile(r"\bstaff\b", re.I)),
    ("senior", re.compile(r"\b(senior|sr\.?|lead|tech lead|architect)\b", re.I)),
    ("entry", re.compile(r"\b(junior|jr\.?|entry[- ]level|graduate|grad|associate|trainee)\b", re.I)),
]


def classify_tier(title: str, description: str = "") -> str:
    text = f"{title} {description}"
    for tier, pattern in _TIER_PATTERNS:
        if pattern.search(text):
            return tier
    # A plausible engineering title with no seniority signal defaults to mid.
    if re.search(r"\b(engineer|developer|programmer|swe|sde)\b", title, re.I):
        return "mid"
    return "unknown"


# --- Tech tagger -------------------------------------------------------------

# canonical name -> regex of aliases. Single-letter / highly ambiguous names are
# avoided to keep precision high.
_TECH: dict[str, str] = {
    "python": r"python",
    "javascript": r"javascript|\bjs\b",
    "typescript": r"typescript|\bts\b",
    "react": r"\breact(\.js)?\b|reactjs",
    "vue": r"\bvue(\.js)?\b|vuejs",
    "angular": r"angular",
    "svelte": r"svelte(kit)?",
    "node": r"node(\.js)?|nodejs",
    "nextjs": r"next\.?js",
    "go": r"golang|\bgo\b",
    "rust": r"\brust\b",
    "java": r"\bjava\b",
    "kotlin": r"kotlin",
    "scala": r"\bscala\b",
    "ruby": r"\bruby\b",
    "rails": r"rails|ruby on rails",
    "php": r"\bphp\b",
    "laravel": r"laravel",
    "c++": r"c\+\+",
    "c#": r"c#|\.net|dotnet",
    "swift": r"\bswift\b",
    "django": r"django",
    "flask": r"flask",
    "fastapi": r"fastapi",
    "spring": r"spring boot|spring framework",
    "graphql": r"graphql",
    "postgresql": r"postgres(ql)?",
    "mysql": r"mysql",
    "mongodb": r"mongo(db)?",
    "redis": r"redis",
    "elasticsearch": r"elasticsearch|elastic search",
    "kafka": r"kafka",
    "docker": r"docker",
    "kubernetes": r"kubernetes|\bk8s\b",
    "terraform": r"terraform",
    "ansible": r"ansible",
    "aws": r"\baws\b|amazon web services",
    "gcp": r"\bgcp\b|google cloud",
    "azure": r"\bazure\b",
    "tensorflow": r"tensorflow",
    "pytorch": r"pytorch",
    "spark": r"\bspark\b",
    "sql": r"\bsql\b",
    "graphdatabase": r"neo4j",
    "tailwind": r"tailwind",
    "linux": r"\blinux\b",
}

_TECH_COMPILED: list[tuple[str, re.Pattern[str]]] = [
    (name, re.compile(pattern, re.I)) for name, pattern in _TECH.items()
]


def extract_tech(text: str, limit: int = 15) -> list[str]:
    if not text:
        return []
    found = [name for name, pattern in _TECH_COMPILED if pattern.search(text)]
    return found[:limit]
