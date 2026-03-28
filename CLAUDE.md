# CLAUDE.md

We're building the app described in @SPEC.MD. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information. Use the DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
bun dev           # Start development server
bun run build     # Build for production
bun run lint      # Run ESLint

bun run prisma:generate   # Regenerate Prisma Client after schema changes
bun run prisma:migrate    # Run migrations (dev)
bun run prisma:studio     # Open Prisma Studio GUI
```

## Architecture

This is a **Next.js App Router** app (Next.js 16, React 19) using **Bun** as the runtime. The project is in an early scaffolding state — the planned structure from `SPEC.md` is not yet implemented.

**Source layout** (root-level, no `src/` wrapper):

```
app/                      # Next.js App Router — route segments only
├── (auth)/               # login, register pages
└── (dashboard)/          # protected dashboard routes
components/
├── ui/                   # Shadcn/Radix primitives
├── customers/            # Customer-specific components
└── auth/                 # Auth form components
lib/
├── auth/
│   ├── lucia.ts          # Lucia instance + Prisma adapter
│   └── session.ts        # validateRequest, createSession, invalidateSession
├── validations/          # Shared Zod schemas (auth + customer)
└── prisma.ts             # Prisma client singleton
actions/                  # Server Actions — all mutations live here
├── auth.actions.ts
└── customer.actions.ts
middleware.ts             # Protects /dashboard/:path*
```

**Key architectural decisions:**

- All mutations use **Server Actions** — no manual `fetch('/api/...')` calls.
- **Lucia** handles session-based auth; sessions stored in Postgres via Prisma adapter. Password hashing uses `@node-rs/argon2`.
- **Data isolation:** every Prisma query must filter by `session.user.id` from `validateRequest()`. Customers belong to a single user via `userId` FK.
- `middleware.ts` protects `/dashboard/:path*` by calling `validateRequest` and redirecting unauthenticated users to `/login`.
- Shared **Zod schemas** in `lib/validations/` are used for both client-side form validation (`react-hook-form` + Zod resolver) and server-side action validation.
- UI components come from **Shadcn** (built on Radix UI) with Tailwind CSS v4. Toast notifications use **sonner**.

## Database

PostgreSQL via Supabase. Requires `DATABASE_URL` env var. Schema is in `prisma/schema.prisma`. The `Session` table is managed entirely by Lucia — do not add application logic to it.
