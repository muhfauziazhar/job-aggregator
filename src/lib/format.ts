import type { Job } from "@/types/job";

// "3 days ago" style relative time. `now` is injectable for deterministic tests.
export function relativeDate(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const sec = Math.round((now - then) / 1000);
  const day = Math.floor(sec / 86400);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (day === 1) return "yesterday";
  if (day < 30) return `${day} days ago`;
  if (day < 60) return "a month ago";
  return `${Math.floor(day / 30)} months ago`;
}

// "$120k–$160k" / "from $120k" / "" when no salary on the listing.
export function salaryLabel(job: Pick<Job, "salaryMin" | "salaryMax" | "salaryCurrency">): string {
  const { salaryMin, salaryMax, salaryCurrency } = job;
  if (salaryMin == null && salaryMax == null) return "";
  const cur = salaryCurrency ?? "USD";
  const sym = cur === "USD" ? "$" : `${cur} `;
  const fmt = (n: number) =>
    n >= 1000 ? `${sym}${Math.round(n / 1000)}k` : `${sym}${n}`;
  if (salaryMin != null && salaryMax != null) return `${fmt(salaryMin)}–${fmt(salaryMax)}`;
  if (salaryMin != null) return `from ${fmt(salaryMin)}`;
  return `up to ${fmt(salaryMax!)}`;
}
