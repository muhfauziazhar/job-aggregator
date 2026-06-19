"use client";

import { useEffect, useMemo, useState } from "react";
import type { Job } from "@/types/job";
import { loadJobs } from "@/lib/jobs";
import { applyFilters, filtersToSearchParams, techFacets } from "@/lib/filters";
import { useFilters } from "@/store/filters";
import { Filters } from "./Filters";
import { JobCard } from "./JobCard";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 25;

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; jobs: Job[]; generatedAt: string };

export function JobBoard() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [page, setPage] = useState(1);

  const filters = useFilters();
  const hydrateFromUrl = useFilters((s) => s.hydrateFromUrl);

  // Load data + restore filters from the URL once on mount.
  useEffect(() => {
    hydrateFromUrl();
    const controller = new AbortController();
    loadJobs(controller.signal)
      .then((file) =>
        setState({
          status: "ready",
          jobs: file.jobs,
          generatedAt: file.generatedAt,
        }),
      )
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      });
    return () => controller.abort();
  }, [hydrateFromUrl]);

  const allJobs = useMemo(
    () => (state.status === "ready" ? state.jobs : []),
    [state],
  );

  const techOptions = useMemo(() => techFacets(allJobs), [allJobs]);

  const filtered = useMemo(
    () => applyFilters(allJobs, filters),
    [allJobs, filters],
  );

  // Reset to the first page whenever the active filters change. Adjusting state
  // during render (vs. in an effect) is the React-recommended pattern here.
  const filterSig = filtersToSearchParams(filters);
  const [prevSig, setPrevSig] = useState(filterSig);
  if (filterSig !== prevSig) {
    setPrevSig(filterSig);
    setPage(1);
  }

  if (state.status === "loading") {
    return <p className="py-20 text-center text-zinc-500">Loading jobs…</p>;
  }

  if (state.status === "error") {
    return (
      <p className="py-20 text-center text-red-600 dark:text-red-400">
        Couldn’t load jobs: {state.message}
      </p>
    );
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );

  return (
    <div className="grid gap-8 md:grid-cols-[16rem_1fr]">
      <div className="md:sticky md:top-6 md:self-start">
        <Filters techOptions={techOptions} />
      </div>

      <div>
        <p className="mb-4 text-sm text-zinc-500">
          {filtered.length.toLocaleString()} job
          {filtered.length === 1 ? "" : "s"}
          {filtered.length !== allJobs.length &&
            ` of ${allJobs.length.toLocaleString()}`}
        </p>

        {visible.length === 0 ? (
          <p className="py-20 text-center text-zinc-500">
            No jobs match these filters.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </ul>
        )}

        <Pagination page={current} pageCount={pageCount} onChange={setPage} />
      </div>
    </div>
  );
}
