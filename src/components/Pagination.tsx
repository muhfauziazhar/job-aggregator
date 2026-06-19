"use client";

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav
      className="mt-6 flex items-center justify-center gap-3 text-sm"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-full border border-black/15 px-3 py-1 disabled:opacity-40 dark:border-white/20"
      >
        ← Prev
      </button>
      <span className="text-zinc-500">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        className="rounded-full border border-black/15 px-3 py-1 disabled:opacity-40 dark:border-white/20"
      >
        Next →
      </button>
    </nav>
  );
}
