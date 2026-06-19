import { JobsFileSchema, type JobsFile } from "@/types/job";
import { dataUrl } from "./basePath";

// Loads and validates the published jobs file. Runs client-side against the
// static asset at /data/jobs.json (under basePath in production).
export async function loadJobs(signal?: AbortSignal): Promise<JobsFile> {
  const res = await fetch(dataUrl("jobs.json"), { signal, cache: "no-cache" });
  if (!res.ok) {
    throw new Error(`Failed to load jobs.json (${res.status})`);
  }
  const json: unknown = await res.json();
  return JobsFileSchema.parse(json);
}
