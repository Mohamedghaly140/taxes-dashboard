import { defineConfig, env } from "prisma/config";

/** Migrate / CLI: prefer direct URL (e.g. Supabase); else fall back to DATABASE_URL. */
function migrateUrl(): string {
  return process.env.DIRECT_URL ?? env("DATABASE_URL");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: migrateUrl(),
  },
});
