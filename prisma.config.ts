// Prisma’s config loader does not read `.env` files; `env()` only sees `process.env`.
// Run the CLI with Bun so `.env` is loaded (e.g. `bun --bun run prisma …`, `bunx --bun prisma …`).
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
