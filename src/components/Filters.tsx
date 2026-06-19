"use client";

import { REMOTE_TYPES, SOURCES, TIERS } from "@/types/job";
import { useFilters } from "@/store/filters";

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
          : "border-black/15 text-zinc-700 hover:border-black/40 dark:border-white/20 dark:text-zinc-300 dark:hover:border-white/50"
      }`}
    >
      {label}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
        {title}
      </h2>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function Filters({ techOptions }: { techOptions: string[] }) {
  const f = useFilters();
  const hasFilters =
    f.query ||
    f.sources.length ||
    f.remoteTypes.length ||
    f.tiers.length ||
    f.tech.length ||
    f.sort !== "newest";

  return (
    <aside className="flex flex-col gap-5">
      <input
        type="search"
        value={f.query}
        onChange={(e) => f.setQuery(e.target.value)}
        placeholder="Search title, company, description…"
        aria-label="Search jobs"
        className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-white/20 dark:bg-zinc-950"
      />

      <Group title="Source">
        {SOURCES.map((s) => (
          <Chip
            key={s}
            label={s}
            active={f.sources.includes(s)}
            onClick={() => f.toggle("sources", s)}
          />
        ))}
      </Group>

      <Group title="Remote">
        {REMOTE_TYPES.map((r) => (
          <Chip
            key={r}
            label={r}
            active={f.remoteTypes.includes(r)}
            onClick={() => f.toggle("remoteTypes", r)}
          />
        ))}
      </Group>

      <Group title="Seniority">
        {TIERS.map((t) => (
          <Chip
            key={t}
            label={t}
            active={f.tiers.includes(t)}
            onClick={() => f.toggle("tiers", t)}
          />
        ))}
      </Group>

      {techOptions.length > 0 && (
        <Group title="Tech stack">
          {techOptions.map((t) => (
            <Chip
              key={t}
              label={t}
              active={f.tech.includes(t)}
              onClick={() => f.toggle("tech", t)}
            />
          ))}
        </Group>
      )}

      <div className="flex items-center justify-between gap-2">
        <label className="text-xs text-zinc-500">
          Sort{" "}
          <select
            value={f.sort}
            onChange={(e) =>
              f.setSort(e.target.value === "oldest" ? "oldest" : "newest")
            }
            className="rounded border border-black/15 bg-white px-1.5 py-1 text-xs dark:border-white/20 dark:bg-zinc-950"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </label>
        {hasFilters && (
          <button
            type="button"
            onClick={f.reset}
            className="text-xs text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Clear all
          </button>
        )}
      </div>
    </aside>
  );
}
