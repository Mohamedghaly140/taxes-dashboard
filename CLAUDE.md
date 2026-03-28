# CLAUDE.md

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

**Planned source layout** (under `src/`, not yet created):

```
src/
├── app/                  # Route segments only — no business logic
│   ├── (auth)/           # login, register pages
│   └── (dashboard)/      # protected dashboard routes
├── components/
│   ├── ui/               # Shadcn/Radix primitives
│   ├── customers/        # Customer-specific components
│   └── auth/             # Auth form components
├── lib/
│   ├── auth/
│   │   ├── lucia.ts      # Lucia instance + Prisma adapter
│   │   └── session.ts    # validateRequest, createSession, invalidateSession
│   ├── validations/      # Shared Zod schemas (auth + customer)
│   └── db.ts             # Prisma client singleton
└── actions/              # Server Actions — all mutations live here
    ├── auth.actions.ts
    └── customer.actions.ts
```

**Key architectural decisions:**
- All mutations use **Server Actions** — no manual `fetch('/api/...')` calls.
- **Lucia** handles session-based auth; sessions stored in Postgres via Prisma adapter. Password hashing uses `@node-rs/argon2`.
- **Data isolation:** every Prisma query must filter by `session.user.id` from `validateRequest()`. Customers belong to a single user via `userId` FK.
- `src/middleware.ts` protects `/dashboard/:path*` by calling `validateRequest` and redirecting unauthenticated users to `/login`.
- Shared **Zod schemas** in `src/lib/validations/` are used for both client-side form validation (`react-hook-form` + Zod resolver) and server-side action validation.
- UI components come from **Shadcn** (built on Radix UI) with Tailwind CSS v4. Toast notifications use **sonner**.

## Database

PostgreSQL via Supabase. Requires `DATABASE_URL` env var. Schema is in `prisma/schema.prisma`. The `Session` table is managed entirely by Lucia — do not add application logic to it.
