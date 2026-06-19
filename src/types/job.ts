import { z } from "zod";

// Canonical job shape for the static site. This is the published JSON contract
// between the Python scrapers (which write public/data/jobs.json) and the
// frontend (which reads it client-side). Storage-only fields from the old
// Postgres schema (raw payload, first/last seen, is_expired) are intentionally
// dropped here — they stay internal to the scraper.

export const SOURCES = ["remoteok", "linkedin", "threads"] as const;
export const REMOTE_TYPES = ["remote", "hybrid", "onsite", "unknown"] as const;
export const TIERS = [
  "intern",
  "entry",
  "mid",
  "senior",
  "staff",
  "principal",
  "unknown",
] as const;

export type Source = (typeof SOURCES)[number];
export type RemoteType = (typeof REMOTE_TYPES)[number];
export type Tier = (typeof TIERS)[number];

export const JobSchema = z.object({
  id: z.string(),
  source: z.enum(SOURCES),
  externalId: z.string(),
  title: z.string(),
  company: z.string(),
  companyDomain: z.string().nullish(),
  location: z.string(),
  remoteType: z.enum(REMOTE_TYPES).default("unknown"),
  department: z.string().nullish(),
  description: z.string(),
  applyUrl: z.string().url(),
  postedAt: z.string(), // ISO 8601
  expiresAt: z.string().nullish(),
  salaryMin: z.number().int().nullish(),
  salaryMax: z.number().int().nullish(),
  salaryCurrency: z.string().nullish(),
  tier: z.enum(TIERS).default("unknown"),
  techStack: z.array(z.string()).default([]),
});

export type Job = z.infer<typeof JobSchema>;

// Top-level shape of public/data/jobs.json.
export const JobsFileSchema = z.object({
  generatedAt: z.string(), // ISO 8601, when the scraper produced this file
  count: z.number().int(),
  jobs: z.array(JobSchema),
});

export type JobsFile = z.infer<typeof JobsFileSchema>;
