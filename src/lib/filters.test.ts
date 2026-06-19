import { describe, it, expect } from "vitest";
import {
  EMPTY_FILTERS,
  applyFilters,
  filtersFromSearchParams,
  filtersToSearchParams,
  techFacets,
  type FilterState,
} from "./filters";
import type { Job } from "@/types/job";

function job(overrides: Partial<Job>): Job {
  return {
    id: "x",
    source: "remoteok",
    externalId: "1",
    title: "Engineer",
    company: "Acme",
    location: "Remote",
    remoteType: "remote",
    description: "build things",
    applyUrl: "https://example.com",
    postedAt: "2026-06-01T00:00:00.000Z",
    tier: "mid",
    techStack: [],
    ...overrides,
  };
}

const filters = (o: Partial<FilterState>): FilterState => ({
  ...EMPTY_FILTERS,
  ...o,
});

describe("applyFilters", () => {
  const jobs = [
    job({ id: "a", source: "remoteok", tier: "senior", techStack: ["go", "aws"], postedAt: "2026-06-03T00:00:00Z" }),
    job({ id: "b", source: "linkedin", tier: "mid", techStack: ["react", "typescript"], postedAt: "2026-06-01T00:00:00Z" }),
    job({ id: "c", source: "threads", tier: "mid", techStack: ["go"], postedAt: "2026-06-02T00:00:00Z" }),
  ];

  it("returns all jobs with empty filters, newest first", () => {
    const out = applyFilters(jobs, EMPTY_FILTERS);
    expect(out.map((j) => j.id)).toEqual(["a", "c", "b"]);
  });

  it("sorts oldest first when requested", () => {
    const out = applyFilters(jobs, filters({ sort: "oldest" }));
    expect(out.map((j) => j.id)).toEqual(["b", "c", "a"]);
  });

  it("filters by source", () => {
    const out = applyFilters(jobs, filters({ sources: ["linkedin"] }));
    expect(out.map((j) => j.id)).toEqual(["b"]);
  });

  it("filters by tier", () => {
    const out = applyFilters(jobs, filters({ tiers: ["mid"] }));
    expect(out.map((j) => j.id).sort()).toEqual(["b", "c"]);
  });

  it("requires ALL selected tech tags (AND)", () => {
    expect(applyFilters(jobs, filters({ tech: ["go"] })).map((j) => j.id).sort()).toEqual(["a", "c"]);
    expect(applyFilters(jobs, filters({ tech: ["go", "aws"] })).map((j) => j.id)).toEqual(["a"]);
  });

  it("does tokenized AND search across fields", () => {
    const out = applyFilters(
      [job({ id: "m", title: "Senior Go Engineer", company: "Stripe" })],
      filters({ query: "go stripe" }),
    );
    expect(out).toHaveLength(1);
    expect(applyFilters(out, filters({ query: "go java" }))).toHaveLength(0);
  });
});

describe("techFacets", () => {
  it("returns tags ordered by frequency then name", () => {
    const jobs = [
      job({ techStack: ["go", "aws"] }),
      job({ techStack: ["go"] }),
      job({ techStack: ["aws", "react"] }),
    ];
    // go=2, aws=2 (tie → alphabetical), react=1
    expect(techFacets(jobs)).toEqual(["aws", "go", "react"]);
  });
});

describe("URL state round-trip", () => {
  it("serializes and parses back to the same filters", () => {
    const f = filters({
      query: "rust",
      sources: ["remoteok", "linkedin"],
      remoteTypes: ["remote"],
      tiers: ["senior"],
      tech: ["go", "aws"],
      sort: "oldest",
    });
    const parsed = filtersFromSearchParams(filtersToSearchParams(f));
    expect(parsed).toEqual(f);
  });

  it("omits defaults from the query string", () => {
    expect(filtersToSearchParams(EMPTY_FILTERS)).toBe("");
  });
});
