-- Full-text search GIN index for job listings.
-- Prisma can't express tsvector GIN indexes natively (see prisma/schema.prisma),
-- so this is a manual migration. Backs US-06 (full-text search) via:
--   WHERE to_tsvector('english', title || ' ' || company || ' ' || description)
--         @@ websearch_to_tsquery('english', :q)

CREATE INDEX IF NOT EXISTS jobs_fts_idx
  ON jobs
  USING GIN (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(company, '') || ' ' || coalesce(description, '')
    )
  );
