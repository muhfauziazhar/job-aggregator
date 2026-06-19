"""Canonical job model. Mirrors src/types/job.ts — keys are emitted in camelCase
so the published JSON validates against JobsFileSchema on the frontend."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field


@dataclass
class Job:
    source: str  # "remoteok" | "linkedin" | "threads"
    externalId: str
    title: str
    company: str
    location: str
    description: str
    applyUrl: str
    postedAt: str  # ISO 8601
    remoteType: str = "unknown"
    tier: str = "unknown"
    techStack: list[str] = field(default_factory=list)
    companyDomain: str | None = None
    department: str | None = None
    expiresAt: str | None = None
    salaryMin: int | None = None
    salaryMax: int | None = None
    salaryCurrency: str | None = None

    @property
    def id(self) -> str:
        return f"{self.source}-{self.externalId}"

    def to_dict(self) -> dict:
        d = asdict(self)
        d["id"] = self.id
        return d
