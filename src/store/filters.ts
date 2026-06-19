import { create } from "zustand";
import {
  EMPTY_FILTERS,
  type FilterState,
  type SortKey,
  filtersFromSearchParams,
  filtersToSearchParams,
} from "@/lib/filters";
import type { RemoteType, Source, Tier } from "@/types/job";

// Array-valued facets that support multi-select toggling.
type ArrayField = "sources" | "remoteTypes" | "tiers" | "tech";
type ValueOf<F extends ArrayField> = FilterState[F][number];

interface FilterStore extends FilterState {
  setQuery: (q: string) => void;
  setSort: (s: SortKey) => void;
  toggle: <F extends ArrayField>(field: F, value: ValueOf<F>) => void;
  reset: () => void;
  hydrateFromUrl: () => void;
}

// Push current filters into the URL without adding a history entry, so the
// page is shareable / refreshable but the back button isn't spammed.
function syncUrl(state: FilterState): void {
  if (typeof window === "undefined") return;
  const qs = filtersToSearchParams(state);
  window.history.replaceState(null, "", qs || window.location.pathname);
}

function toFilterState(s: FilterState): FilterState {
  return {
    query: s.query,
    sources: s.sources,
    remoteTypes: s.remoteTypes,
    tiers: s.tiers,
    tech: s.tech,
    sort: s.sort,
  };
}

export const useFilters = create<FilterStore>((set, get) => ({
  ...EMPTY_FILTERS,

  setQuery: (q) => {
    set({ query: q });
    syncUrl(toFilterState(get()));
  },

  setSort: (s) => {
    set({ sort: s });
    syncUrl(toFilterState(get()));
  },

  toggle: (field, value) => {
    const current = get()[field] as ValueOf<typeof field>[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    set({ [field]: next } as Pick<FilterState, typeof field>);
    syncUrl(toFilterState(get()));
  },

  reset: () => {
    set({ ...EMPTY_FILTERS });
    syncUrl(EMPTY_FILTERS);
  },

  hydrateFromUrl: () => {
    if (typeof window === "undefined") return;
    set(filtersFromSearchParams(window.location.search));
  },
}));

// Re-exported for component prop typing.
export type { Source, RemoteType, Tier };
