// In production the site is served under /job-aggregator (GitHub Pages), so
// static asset fetches must be prefixed. next.config.ts injects the value;
// it is empty in dev.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const dataUrl = (file: string): string => `${BASE_PATH}/data/${file}`;
