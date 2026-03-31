# Technical Specification: Taxes-Dashboard

## 1. Project Overview

**Taxes-Dashboard** is a full-stack web application designed to replace Excel-based customer management for tax professionals. It provides a secure, multi-tenant environment where each authenticated user manages their own list of customers and their sensitive tax-related data.

- **Primary Goal:** Data centralization, security, and CRUD efficiency.
- **Architecture:** Next.js App Router with Server Components and Server Actions.

---

## 2. Tech Stack

| Layer          | Technology               |
| -------------- | ------------------------ |
| Framework      | Next.js 15+ (App Router) |
| Runtime        | Bun                      |
| Language       | TypeScript               |
| Database       | PostgreSQL (Supabase)    |
| ORM            | Prisma                   |
| Authentication | Lucia                    |
| Validation     | Zod                      |
| UI Components  | Shadcn UI (Radix UI)     |
| Styling        | Tailwind CSS             |
| Icons          | Lucide-react             |

---

## 3. Database Schema (`prisma/schema.prisma`)

The schema enforces a one-to-many relationship. Each `Customer` is strictly tied to a `User` via `userId`.

Lucia requires two dedicated tables: `User` and `Session`. The `Session` table is managed entirely by Lucia and must not be confused with application-level user data.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -- Auth Tables (managed by Lucia) --

enum Role {
  CLIENT
  ADMIN
}

enum Status {
  ACTIVE
  INACTIVE
}


model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String    // Hashed with Argon2 via @node-rs/argon2
  role         Role      @default(CLIENT)
  status       Status    @default(ACTIVE)

  sessions  Session[]
  customers Customer[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// -- Application Tables --

model Customer {
  id                    String  @id @default(cuid())
  name                  String
  email                 String
  emailPassword         String? // Credentials for the customer's email account
  username              String? // Tax portal username
  fileNumber            String  @unique
  taxRegistrationNumber String  @unique
  nationalId            String  @unique

  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

---

## 4. Data Validation (Zod Schemas)

Shared schemas are defined once and used for both client-side form validation and server-side action validation.

### Auth Schemas

```typescript
// lib/validations/auth.schema.ts

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
```

### Customer Schema

```typescript
// lib/validations/customer.schema.ts

import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  emailPassword: z.string().optional(),
  username: z.string().min(3, "Username is required"),
  fileNumber: z.string().min(1, "File number is required"),
  taxRegistrationNumber: z.string().length(9, "Must be 9 digits"),
  nationalId: z.string().length(14, "Must be 14 digits"),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
```

---

## 5. Feature Breakdown & Implementation

### A. Authentication (Lucia)

Lucia is a session-based auth library that gives full control over the auth flow with no magic abstractions.

**Core setup files:**

- `lib/auth/lucia.ts` — initializes the Lucia instance with the Prisma adapter.
- `lib/auth/session.ts` — server-side helpers: `createSession`, `validateRequest`, `invalidateSession`.
- `middleware.ts` — protects `/dashboard/:path*` by calling `validateRequest` and redirecting unauthenticated users to `/login`.

**Flow:**

1. **Register:** Hash password with `@node-rs/argon2`, create `User` record, create a Lucia `Session`, set the session cookie.
2. **Login:** Fetch user by email, verify password hash, create a new `Session`, set the session cookie.
3. **Logout:** Call `lucia.invalidateSession(sessionId)`, blank the session cookie.
4. **Data isolation:** All Prisma queries filter by `session.user.id` obtained from `validateRequest()`.

**Session cookie** is set as `HttpOnly`, `Secure` (in production), and `SameSite=Lax`.

### B. Dashboard & CRUD (Server Actions)

Server Actions handle all mutation logic, providing end-to-end type safety with no manual `fetch('/api/...')` calls.

- `getCustomers()` — fetches all customers for the authenticated user.
- `createCustomer(data)` — validates with Zod, checks for duplicates, saves to Postgres.
- `updateCustomer(id, data)` — validates ownership, updates the record.
- `deleteCustomer(id)` — validates ownership, removes the record (confirmed via modal).

### C. UI/UX Design (Shadcn)

- **Layout:** Sidebar navigation with "Customers," "Settings," and "Profile."
- **Data Table:** Shadcn `DataTable` (TanStack Table) with filtering and sorting.
- **Forms:** `react-hook-form` integrated with Zod resolvers.
- **Feedback:** `sonner` toast notifications and loading skeletons.

---

## 6. Project Structure (Clean Architecture)

```

├── app/                        # Next.js App Router (routes only)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       └── dashboard/
│           ├── layout.tsx
│           └── page.tsx
│
├── components/                 # Reusable UI components
│   ├── ui/                     # Shadcn primitives
│   ├── shared/                 # Cross-feature UI (not domain-specific)
│   │   ├── form/               # Server Action form wrapper + helpers
│   │   │   ├── form.tsx        # Form shell + toast feedback (see below)
│   │   │   ├── field-error.tsx # Field-level error display
│   │   │   ├── hooks/
│   │   │   │   └── use-action-feedback.ts
│   │   │   └── utils/
│   │   │       └── to-action-state.ts  # ActionState, Zod → state helpers
│   │   ├── form-control/       # Label + control + errors composition
│   │   ├── redirect-toast/     # Toast after redirect (e.g. cookie flags)
│   │   └── spinner/            # Loading indicator
│   ├── customers/              # Customer-specific components
│   └── auth/                   # Auth form components
│
├── lib/
│   ├── auth/
│   │   ├── lucia.ts            # Lucia instance + adapter
│   │   └── session.ts          # validateRequest, createSession, etc.
│   ├── validations/
│   │   ├── auth.schema.ts
│   │   └── customer.schema.ts
│   └── prisma.ts               # Prisma client singleton
│
└── actions/                    # Server Actions (use cases)
    ├── auth.actions.ts
    └── customer.actions.ts
```

### 6.1 `components/shared/`

**Purpose:** UI pieces reused across auth, dashboard, and future features. Domain-specific building blocks stay under `components/customers/`, `components/auth/`, etc.; anything that applies to multiple features lives here.

**Contents (current):**

| Path | Role |
| --- | --- |
| `form/` | Server Action–oriented forms: shared `Form`, `ActionState` typing, Zod → action state helpers, field errors |
| `form-control/` | Accessible label + control + optional description/errors |
| `redirect-toast/` | Client helper to show a toast once after navigation when a server action sets a cookie or search param |
| `spinner/` | Shared loading UI |

### 6.2 `components/shared/form/form.tsx`

**Role:** Thin wrapper around a native `<form>` whose `action` is a **Server Action** (or a function derived from `useFormState`). It wires **feedback** when the action returns: it subscribes to an `ActionState` object (see `form/utils/to-action-state.ts`) and, when that state **changes** (tracked by `timestamp`), shows **Sonner** toasts for `message` on success or error and calls optional `onSuccess` / `onError` callbacks.

**Typical usage:**

1. **Server Action** returns `ActionState` built with helpers from `to-action-state.ts` (e.g. validation errors → `fieldErrors`, business rules → `message` + `status`).
2. **Client page** uses React’s `useFormState` (or equivalent) so each submit updates `actionState`.
3. **Render** `<Form action={…} actionState={actionState}>` and put inputs inside; map `actionState.fieldErrors` to `FieldError` / `form-control` as needed.

**Props:**

| Prop | Purpose |
| --- | --- |
| `action` | `(formData: FormData) => void` — bound server action from `useFormState` |
| `actionState` | Latest `ActionState` from the action (includes `status`, `message`, `fieldErrors`, `timestamp`) |
| `onSuccess` / `onError` | Optional; runs when feedback fires (e.g. reset form, navigate) — toasts for `message` are already handled inside `Form` |

**Related:** `useActionFeedback` only reacts when `actionState.timestamp` changes, so the initial empty state does not fire success/error handlers on mount.

---

## 7. Implementation Roadmap

1. **Initialize:** scaffold Next.js app, install Prisma, initialize Shadcn.
2. **Database:** push `schema.prisma` to Supabase, generate Prisma Client.
3. **Auth:** set up Lucia with the Prisma adapter; implement register/login/logout flows.
4. **Middleware:** protect dashboard routes via session validation.
5. **Actions:** implement `customer.actions.ts` for full CRUD logic.
6. **Views:** build the main Dashboard table and the "Add/Edit Customer" modal.
7. **Optimization:** add loading skeletons and toast notifications.

---

## 8. Outstanding Fixes & Gaps

Items identified during evaluation. Work through these in order.

### Priority

- [x] **P1 — Middleware (`proxy.ts`):** `proxy.ts` exists, exports `proxy`, matches `/dashboard/:path*`, and checks the `auth_session` cookie at the edge. Layout retains `validateRequest()` as a DB-level second layer (also needed to fetch `user` for the Sidebar). Done.

- [x] **P2 — Dashboard `loading.tsx`:** Added `app/(dashboard)/dashboard/loading.tsx` — mirrors page structure (heading + button area + 6-row skeleton table) using the `<Skeleton>` component.

- [x] **P3 — Settings page:** Added stub `app/(dashboard)/dashboard/settings/page.tsx`.

- [x] **P4 — Profile page:** Added `app/(dashboard)/dashboard/profile/page.tsx` — displays authenticated user's name, email, and role.

- [x] **P5 — TanStack `DataTable`:** Replaced plain `<Table>` with TanStack Table v8. Added `columns.tsx` with sortable Name/Email headers. `CustomersTable` now has column filtering (by name) and client-side sorting via `getSortedRowModel` + `getFilteredRowModel`.

- [x] **P6 — `deleteCustomer` ActionState:** Updated to return `Promise<ActionState>`. Keeps `(id: string)` param (button-triggered, no form). Table now checks `result.status === "ERROR"` and uses `result.message` for toasts.

### Minor

- [x] **M1 — `redirect-toast`:** Already wired in `app/template.tsx`. Reads a `toast` cookie on every pathname change and fires a Sonner toast — used for post-redirect feedback from server actions via `setCookieByKey("toast", message)` in `cookies.actions.ts`.

- [x] **M2 — `submit-button`:** Now used in all three forms (`login-form`, `register-form`, `customer-form`). Uses `useFormStatus()` internally so `isPending` no longer needs to be threaded down from `useActionState`.

- [x] **M3 — Leftover action files:** `test.actions.ts` deleted (unused). `cookies.actions.ts` kept — imported by `redirect-toast`.
