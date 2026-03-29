// Prisma’s config loader does not read `.env` files; `env()` only sees `process.env`.
// Run the CLI with Bun so `.env` is loaded (e.g. `bun --bun run prisma …`, `bunx --bun prisma …`).
//
// Migrations (`prisma migrate`, `db push`) must use a direct Postgres TCP URL — not a PgBouncer
// pooler (e.g. Supabase `:6543`). Pooler URLs often make `migrate dev` appear stuck. Set DIRECT_URL
// to the “direct” connection from Supabase (host `db.<project>.supabase.co`, port `5432`). The app
// can keep using a pooled `DATABASE_URL` in your driver adapter (`lib/db.ts`).
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seeds.ts",
  },
  datasource: {
    url: env("DIRECT_URL"), // CLI/migrations must use direct TCP connection, not the PgBouncer pooler
  },
});
