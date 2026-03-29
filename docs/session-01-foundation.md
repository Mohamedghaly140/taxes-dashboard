# Session 01 — Foundation & Auth Setup

## What Was Done

Full scaffolding of the app described in `SPEC.md`: database schema fixes, auth implementation (Lucia v3), route protection, validation schemas, server actions, and all pages/components.

---

## 1. Prisma v7 Config Fixes

### `prisma.config.ts`
- Changed `datasource.url` from `DATABASE_URL` (pooled) to `DIRECT_URL` (direct TCP).
- In Prisma v7, the CLI uses `datasource.url` in `prisma.config.ts` for migrations — `directUrl` no longer exists.
- `PrismaClient` at runtime (`lib/prisma.ts`) independently uses `DATABASE_URL` via the `PrismaPg` driver adapter.

### `prisma/schema.prisma`
- `datasource` block has **no `url` field** — this is intentional for Prisma v7.
- Fixed `Role` enum: `USER` → `CLIENT` (to match SPEC).
- Fixed `Customer.username`: removed `@unique`, changed to `String?` (optional, not unique per SPEC).
- Generator uses `provider = "prisma-client"` and outputs to `../generated/prisma`.

### `prisma/seeds.ts`
- Updated `Role.USER` → `Role.CLIENT` to match the enum rename.

---

## 2. Packages Installed

| Package | Version | Purpose |
|---|---|---|
| `@lucia-auth/adapter-prisma` | 4.0.1 | Lucia ↔ Prisma bridge |
| `@node-rs/argon2` | 2.0.2 | Password hashing |
| `zod` | 4.3.6 | Validation schemas |
| `react-hook-form` | 7.72.0 | Form state management |
| `@hookform/resolvers` | 5.2.2 | Zod resolver for RHF |

> Note: `@lucia-auth/adapter-prisma` shows a peer warning about `@prisma/client` version — this is safe to ignore; the adapter works by receiving `prisma.session` and `prisma.user` delegates directly.

---

## 3. Auth Implementation (Lucia v3)

### `lib/auth/lucia.ts`
- Initializes `Lucia` with `PrismaAdapter(prisma.session, prisma.user)`.
- Session cookie: `expires: false`, `secure` in production only.
- `getUserAttributes` exposes `name`, `email`, `role`, `status` on the session user.
- Full TypeScript module augmentation via `declare module "lucia"`.

### `lib/auth/session.ts`
- `validateRequest()` — memoized with `React.cache`, reads session cookie with async `await cookies()` (Next.js 16 cookies API is async), handles session refresh and blank cookie on expiry.
- `createSession(userId)` — creates Lucia session + sets cookie.
- `invalidateSession(sessionId)` — invalidates session + blanks cookie.

### Key Lucia v3 Notes
- `Session.id` has no `@default(...)` in schema — Lucia generates IDs itself via `generateIdFromEntropySize`.
- `User.id` uses `@default(cuid())` — fine since the app (not Lucia) creates users.
- Password hashing params: `memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1`.

---

## 4. Route Protection (`proxy.ts`)

Next.js 16 renamed `middleware.ts` → `proxy.ts` and the export from `middleware` → `proxy`.

- Cannot import Prisma or Lucia in `proxy.ts` — runs on the Edge runtime.
- Only checks for the session cookie's **presence** (`auth_session` — Lucia's default cookie name).
- Full DB session validation happens in `app/(dashboard)/dashboard/layout.tsx` via `validateRequest()`.
- Protects `/dashboard/:path*`.

---

## 5. Validation Schemas

### `lib/validations/auth.schema.ts`
- `registerSchema`: name (min 2), email, password (min 8)
- `loginSchema`: email, password (min 1)

### `lib/validations/customer.schema.ts`
- `customerSchema`: name, email, emailPassword (optional), username (optional), fileNumber, taxRegistrationNumber (length 9), nationalId (length 14)

---

## 6. Server Actions

### `actions/auth.actions.ts`
- `register(formData)` — Zod validate → check duplicate email → `argon2.hash` → create user → `createSession` → `redirect("/dashboard")`
- `login(formData)` — Zod validate → find user → `argon2.verify` → `createSession` → `redirect("/dashboard")`
- `logout()` — `validateRequest` → `invalidateSession` → `redirect("/login")`
- Returns `{ error: fieldErrors }` on failure for client-side error display.

### `actions/customer.actions.ts`
- All actions call `getAuthenticatedUser()` which runs `validateRequest()` and redirects to `/login` if unauthenticated.
- `getCustomers()` — filters by `userId`, ordered by `createdAt desc`.
- `createCustomer(formData)` — Zod validate → duplicate check (fileNumber, taxRegistrationNumber, nationalId) → create → returns `{ success, customer }`.
- `updateCustomer(id, formData)` — ownership check → Zod validate → duplicate check (excluding self) → update → returns `{ success, customer }`.
- `deleteCustomer(id)` — ownership check → delete → returns `{ success }`.

---

## 7. Pages & Components

### Auth
- `app/(auth)/layout.tsx` — centered full-screen layout
- `app/(auth)/login/page.tsx` + `app/(auth)/register/page.tsx` — thin wrappers
- `components/auth/login-form.tsx` + `components/auth/register-form.tsx` — client components using `react-hook-form` + Zod resolver + `useTransition` to call server actions

### Dashboard
- `app/(dashboard)/dashboard/layout.tsx` — re-validates session via `validateRequest`, renders `<Sidebar>`
- `app/(dashboard)/dashboard/page.tsx` — server component, calls `getCustomers()`, renders `<CustomersTable>`
- `components/dashboard/sidebar.tsx` — client component, nav links (Customers/Settings/Profile), logout button
- `components/customers/customers-table.tsx` — client component, optimistic UI with local state, delete with spinner, triggers `<CustomerModal>`
- `components/customers/customer-modal.tsx` — add/edit dialog using Shadcn Dialog + RHF + Zod, pre-fills on edit (converts `null` → `undefined` for form compatibility)

### Root Layout (`app/layout.tsx`)
- Added `<Toaster />` from `components/ui/sonner`
- Updated metadata title/description

---

## 8. API Route (Kept for Testing)

`app/api/customers/route.ts` — protected GET endpoint:
- Calls `validateRequest()`, returns 401 if unauthenticated.
- Returns only the authenticated user's customers.
- Will be removed once testing is complete (replaced by Server Actions).

---

## Known Quirks / Things to Watch

1. **`cookies()` is async in Next.js 16** — always `await cookies()` before calling `.get()` or `.set()`.
2. **`proxy.ts` cannot import Prisma** — Edge runtime limitation. Full validation must happen in Server Components/Actions.
3. **Lucia session cookie name** is `auth_session` by default — hardcoded in `proxy.ts` to avoid importing Lucia there.
4. **`@lucia-auth/adapter-prisma` peer warning** — harmless, adapter works fine with Prisma v7.
5. **Seed uses `Bun.password.hash`** (argon2id) — compatible hash format with `@node-rs/argon2`, but auth actions use `@node-rs/argon2` as specified in SPEC.
