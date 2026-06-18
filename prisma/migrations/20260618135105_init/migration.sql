-- CreateEnum
CREATE TYPE "Source" AS ENUM ('greenhouse', 'lever', 'ashby', 'remoteok', 'linkedin', 'threads');

-- CreateEnum
CREATE TYPE "RemoteType" AS ENUM ('remote', 'hybrid', 'onsite', 'unknown');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('intern', 'entry', 'mid', 'senior', 'staff', 'principal', 'unknown');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('running', 'success', 'partial', 'failed');

-- CreateEnum
CREATE TYPE "RunMode" AS ENUM ('full', 'incremental');

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL,
    "source" "Source" NOT NULL,
    "external_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "company_domain" TEXT,
    "location" TEXT NOT NULL,
    "remote_type" "RemoteType" NOT NULL DEFAULT 'unknown',
    "department" TEXT,
    "description" TEXT NOT NULL,
    "apply_url" TEXT NOT NULL,
    "posted_at" TIMESTAMPTZ(6) NOT NULL,
    "expires_at" TIMESTAMPTZ(6),
    "first_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_source_at" TIMESTAMPTZ(6),
    "salary_min" INTEGER,
    "salary_max" INTEGER,
    "salary_currency" TEXT,
    "tier" "Tier" NOT NULL DEFAULT 'unknown',
    "tech_stack" TEXT[],
    "raw" JSONB NOT NULL,
    "is_expired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraper_runs" (
    "id" UUID NOT NULL,
    "source" "Source" NOT NULL,
    "started_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMPTZ(6),
    "status" "RunStatus" NOT NULL DEFAULT 'running',
    "mode" "RunMode" NOT NULL,
    "jobs_seen" INTEGER NOT NULL DEFAULT 0,
    "jobs_inserted" INTEGER NOT NULL DEFAULT 0,
    "jobs_updated" INTEGER NOT NULL DEFAULT 0,
    "jobs_expired" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "scraper_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_source_posted_at_idx" ON "jobs"("source", "posted_at" DESC);

-- CreateIndex
CREATE INDEX "jobs_is_expired_posted_at_idx" ON "jobs"("is_expired", "posted_at" DESC);

-- CreateIndex
CREATE INDEX "jobs_tech_stack_idx" ON "jobs" USING GIN ("tech_stack");

-- CreateIndex
CREATE INDEX "jobs_last_seen_at_idx" ON "jobs"("last_seen_at");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_source_external_id_key" ON "jobs"("source", "external_id");

-- CreateIndex
CREATE INDEX "scraper_runs_source_started_at_idx" ON "scraper_runs"("source", "started_at" DESC);
