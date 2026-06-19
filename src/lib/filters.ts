import {
  type Job,
  type RemoteType,
  type Source,
  type Tier,
  TIERS,
} from "@/types/job";

export type SortKey = "newest" | "oldest";

export interface FilterState {
  query: string;
  sources: Source[];
  remoteTypes: RemoteType[];
  tiers: Tier[];
  tech: string[];
  sort: SortKey;
}

export const EMPTY_FILTERS: FilterState = {
  query: "",
  sources: [],
  remoteTypes: [],
  tiers: [],
  tech: [],
  sort: "newest",
};

// Display order for seniority tiers.
const TIER_ORDER: Record<Tier, number> = Object.fromEntries(
  TIERS.map((t, i) => [t, i]),
) as Record<Tier, number>;

// --- Search ------------------------------------------------------------------

function searchableText(job: Job): string {
  return `${job.title} ${job.company} ${job.description}`.toLowerCase();
}

// Tokenized AND match across title/company/description.
function matchesQuery(job: Job, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = searchableText(job);
  return tokens.every((t) => haystack.includes(t));
}

// --- Filtering ---------------------------------------------------------------

export function applyFilters(jobs: Job[], f: FilterState): Job[] {
  const filtered = jobs.filter((job) => {
    if (f.sources.length && !f.sources.includes(job.source)) return false;
    if (f.remoteTypes.length && !f.remoteTypes.includes(job.remoteType))
      return false;
    if (f.tiers.length && !f.tiers.includes(job.tier)) return false;
    if (f.tech.length && !f.tech.every((t) => job.techStack.includes(t)))
      return false;
    if (!matchesQuery(job, f.query)) return false;
    return true;
  });

  const dir = f.sort === "newest" ? -1 : 1;
  return filtered.sort((a, b) => {
    const cmp = a.postedAt.localeCompare(b.postedAt);
    return cmp !== 0 ? cmp * dir : TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
  });
}

// --- Facets ------------------------------------------------------------------

// Tech tags present in the dataset, most frequent first.
export function techFacets(jobs: Job[], limit = 24): string[] {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    for (const tag of job.techStack) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag]) => tag);
}

// --- URL state ---------------------------------------------------------------
// Filters serialize to the query string so searches are shareable.

export function filtersToSearchParams(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.query) p.set("q", f.query);
  if (f.sources.length) p.set("source", f.sources.join(","));
  if (f.remoteTypes.length) p.set("remote", f.remoteTypes.join(","));
  if (f.tiers.length) p.set("tier", f.tiers.join(","));
  if (f.tech.length) p.set("tech", f.tech.join(","));
  if (f.sort !== "newest") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

function splitList(value: string | null): string[] {
  return value ? value.split(",").filter(Boolean) : [];
}

export function filtersFromSearchParams(search: string): FilterState {
  const p = new URLSearchParams(search);
  return {
    query: p.get("q") ?? "",
    sources: splitList(p.get("source")) as Source[],
    remoteTypes: splitList(p.get("remote")) as RemoteType[],
    tiers: splitList(p.get("tier")) as Tier[],
    tech: splitList(p.get("tech")),
    sort: p.get("sort") === "oldest" ? "oldest" : "newest",
  };
}
