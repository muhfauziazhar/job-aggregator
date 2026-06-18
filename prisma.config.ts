// Prisma 7 config. Connection URL lives here (no longer in schema datasource).
// Assumes prisma + dotenv installed as devDeps.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
