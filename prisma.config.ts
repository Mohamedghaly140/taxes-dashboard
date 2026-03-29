import { defineConfig, env } from "prisma/config";

// Prisma’s config loader does not read `.env`; `env()` only sees `process.env`.
// Use `bun run prisma:*` (see package.json) so Bun loads `.env` before the CLI runs. Avoid `bunx prisma`
// or `bun prisma` alone — the latter can resolve the local `prisma/` folder instead of the package.
//
// Migrations (`prisma migrate`, `db push`) must use a direct Postgres TCP URL — not a PgBouncer
// pooler (e.g. Supabase `:6543`). Pooler URLs often make `migrate dev` appear stuck. Set DIRECT_URL
// to the “direct” connection from Supabase (host `db.<project>.supabase.co`, port `5432`). The app
// can keep using a pooled `DATABASE_URL` in your driver adapter (`lib/db.ts`).

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
