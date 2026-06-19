"use client";

import { useState } from "react";
import type { Job, Source } from "@/types/job";
import { relativeDate, salaryLabel } from "@/lib/format";

const SOURCE_STYLES: Record<Source, string> = {
  remoteok: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  linkedin: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  threads: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
};

const REMOTE_LABEL: Record<Job["remoteType"], string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
  unknown: "—",
};

export function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const salary = salaryLabel(job);

  return (
    <li className="rounded-lg border border-black/10 bg-white p-4 transition-colors hover:border-black/25 dark:border-white/15 dark:bg-zinc-950 dark:hover:border-white/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
            {job.title}
          </h3>
          <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
            {job.company} · {job.location}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${SOURCE_STYLES[job.source]}`}
        >
          {job.source}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded bg-zinc-100 px-2 py-0.5 capitalize text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {job.tier}
        </span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          {REMOTE_LABEL[job.remoteType]}
        </span>
        {salary && (
          <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-300">
            {salary}
          </span>
        )}
        <span className="text-zinc-500 dark:text-zinc-500">
          {relativeDate(job.postedAt)}
        </span>
      </div>

      {job.techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.techStack.map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {open && (
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {job.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm">
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-zinc-900 px-4 py-1.5 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Apply ↗
        </a>
        {job.description && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {open ? "Hide details" : "Details"}
          </button>
        )}
      </div>
    </li>
  );
}
