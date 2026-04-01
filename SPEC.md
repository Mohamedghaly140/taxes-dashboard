# Technical Specification: Taxes-Dashboard

## 1. Project Overview

**Taxes-Dashboard** is a full-stack web application designed to replace Excel-based customer management for tax professionals. It provides a secure, multi-tenant environment where each authenticated user manages their own list of customers and their sensitive tax-related data.

- **Primary Goal:** Data centralization, security, and CRUD efficiency.
- **Architecture:** Next.js App Router with Server Components and Server Actions.

---

## 2. Tech Stack

| Layer          | Technology               |
| -------------- | ------------------------ |
| Framework      | Next.js 16 (App Router)  |
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
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  // No url field — Prisma v7 reads the connection URL from prisma.config.ts,
  // not from schema.prisma. Set datasource.url there to DIRECT_URL.
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

  @@index([userId])
}

// -- Application Tables --

model Customer {
  id                    String  @id @default(cuid())
  name                  String
  email                 String
  emailPassword         String  // Credentials for the customer's email account
  username              String  // Tax portal username
  portalPassword        String  // Tax portal password
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
  emailPassword: z.string().min(1, "Email password is required"),
  username: z.string().min(1, "Username is required"),
  portalPassword: z.string().min(1, "Portal password is required"),
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

## 6. Project Structure (Feature-Based Architecture)

```
├── app/                              # Next.js App Router — routes only, no logic
│   ├── (auth)/
│   │   ├── login/page.tsx            # → renders <LoginForm /> from @/features/auth
│   │   └── register/page.tsx         # → renders <RegisterForm /> from @/features/auth
│   └── (dashboard)/
│       └── dashboard/
│           ├── layout.tsx            # → renders <Sidebar /> from @/features/dashboard
│           ├── page.tsx              # → renders <DashboardOverview /> from @/features/dashboard
│           ├── loading.tsx           # skeleton matching overview layout
│           ├── customers/
│           │   ├── page.tsx          # → renders <CustomersView searchParams={…} /> from @/features/customers
│           │   └── loading.tsx       # skeleton matching customers table
│           ├── profile/
│           │   ├── page.tsx
│           │   └── loading.tsx
│           └── settings/
│               ├── page.tsx
│               └── loading.tsx
│
├── features/                         # Feature modules — all domain logic lives here
│   ├── auth/
│   │   ├── actions/
│   │   │   └── index.ts              # register, login, logout (Server Actions)
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   └── index.ts                  # barrel: export { LoginForm, RegisterForm }
│   ├── customers/
│   │   ├── actions/
│   │   │   └── index.ts              # getCustomers, createCustomer, updateCustomer, deleteCustomer
│   │   ├── components/
│   │   │   ├── columns.tsx
│   │   │   ├── customer-form.tsx
│   │   │   ├── customer-modal.tsx
│   │   │   ├── customers-table.tsx
│   │   │   └── customers-view.tsx    # smart server component — fetches + renders
│   │   └── index.ts                  # barrel: export { CustomersView }
│   └── dashboard/
│       ├── actions/
│       │   └── index.ts              # getDashboardStats
│       ├── components/
│       │   ├── overview.tsx          # smart server component — fetches + renders stat cards
│       │   └── sidebar.tsx
│       └── index.ts                  # barrel: export { DashboardOverview, Sidebar }
│
├── components/                       # Shared, non-domain UI
│   ├── ui/                           # Shadcn primitives (never edit manually)
│   └── shared/                       # Cross-feature building blocks
│       ├── form/                     # Server Action form wrapper + helpers
│       │   ├── form.tsx
│       │   ├── field-error.tsx
│       │   ├── hooks/use-action-feedback.ts
│       │   └── utils/to-action-state.ts
│       ├── form-control/
│       ├── confirm-dialog/
│       ├── redirect-toast/
│       ├── submit-button/
│       └── spinner/
│
├── lib/
│   ├── auth/
│   │   ├── lucia.ts                  # Lucia instance + adapter
│   │   └── session.ts                # validateRequest, createSession, invalidateSession
│   ├── validations/
│   │   ├── auth.schema.ts
│   │   └── customer.schema.ts
│   └── prisma.ts                     # Prisma client singleton
│
├── actions/                          # Global shared Server Actions (cross-feature)
│   └── cookies.actions.ts            # setCookieByKey, getCookieByKey, deleteCookieByKey
│
└── nuqs/
    └── search-params.ts              # Shared URL search param parsers + cache
```

---

### 6.1 UI Component Policy

**All UI components must come from Shadcn UI (`components/ui/`).** Never build a native HTML element (select, dialog, checkbox, etc.) when a Shadcn equivalent exists.

- Install missing components with `npx shadcn@latest add <component>` — this generates the file in `components/ui/`.
- Import exclusively from `@/components/ui/<component>` — never from `radix-ui` or other primitives directly.
- Do not modify generated Shadcn files unless the change is intentional and project-wide.
- For one-off layout or utility needs (spacing, flex, grid) use Tailwind classes directly — no wrapper component needed.

**Currently installed Shadcn components:**

| Component | Path |
| --- | --- |
| Alert Dialog | `components/ui/alert-dialog.tsx` |
| Button | `components/ui/button.tsx` |
| Dialog | `components/ui/dialog.tsx` |
| Input | `components/ui/input.tsx` |
| Label | `components/ui/label.tsx` |
| Select | `components/ui/select.tsx` |
| Skeleton | `components/ui/skeleton.tsx` |
| Sonner (Toaster) | `components/ui/sonner.tsx` |
| Spinner | `components/ui/spinner.tsx` |
| Table | `components/ui/table.tsx` |

---

### 6.2 Component Design Principles (SOLID)

We apply SOLID principles at the component level. The most impactful rules in practice:

**Single Responsibility** — every component does one thing. If a component renders a form AND handles pagination AND manages a modal, split it. Good signals that a split is needed: the file exceeds ~80 lines, or the component name needs "and" to describe it.

**Example — customers table split:**

| File | Responsibility |
| --- | --- |
| `customers-table.tsx` | Orchestrator: owns state, wires sub-components |
| `customers-toolbar.tsx` | Search input + Add button |
| `customers-data-table.tsx` | TanStack table rendering (header + body + empty state) |
| `customers-pagination.tsx` | Rows-per-page select + prev/next controls + result count |

**Rules to follow when building components:**

- **One concern per file.** Data fetching, rendering, and user interactions are separate concerns — don't mix them in a single component unless the component is explicitly an orchestrator.
- **Orchestrators are allowed.** A parent component that owns state and passes props/callbacks to focused children is fine — that is composition, not a violation.
- **Props over internal coupling.** Sub-components receive plain props and callbacks; they never import sibling state or call actions directly unless they own that responsibility (e.g. a delete button component that owns the delete action).
- **Name components by what they do.** `CustomersPagination`, `CustomersToolbar`, `CustomersDataTable` — not `CustomersBottom`, `CustomersTop`.
- **Props type naming:** always name the props type `<ComponentName>Props` — e.g. `CustomersTableProps`, `CustomersPaginationProps`. Never use a generic name like `Props` or `TableProps`. This makes the type instantly identifiable when reading imports or error messages.
- **Keep files under ~80 lines where practical.** Longer files are a signal to extract a sub-component.

---

### 6.3 Feature Module Convention

Every feature follows the same shape. When adding a new feature (e.g. `invoices`):

```
features/invoices/
├── actions/
│   └── index.ts        # "use server" — all Server Actions for this feature
├── components/
│   ├── invoices-view.tsx   # smart server component: fetches data + renders
│   └── *.tsx               # sub-components used internally
└── index.ts            # barrel — only export what pages need
```

**Rules:**
- `actions/index.ts` must have `"use server"` at the top.
- Internal components import actions via relative path (`../actions`), never via `@/features/…/actions`.
- The page file imports **only** from the feature's `index.ts` barrel (`@/features/invoices`).
- `components/shared/` and `components/ui/` are imported via `@/components/…` from anywhere.
- `lib/` and `nuqs/` are imported via `@/lib/…` and `@/nuqs/…` from anywhere.
- Feature actions **must not** import from another feature's actions — share logic via `lib/` instead.
- Cross-feature Server Actions (e.g. cookie helpers) live in `actions/` at the root — **not** inside any feature folder. Import them via `@/actions/…`. Add new files there when an action is genuinely shared across two or more features.
- `lib/validations/` holds the Zod schema for each feature — add `invoices.schema.ts` there.

**Smart server component pattern (`*-view.tsx`):**

The view component is an `async` Server Component that owns data fetching for its route. The page just passes `searchParams` (or nothing) through:

```tsx
// app/(dashboard)/dashboard/invoices/page.tsx
import { InvoicesView } from "@/features/invoices";

export default function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  return <InvoicesView searchParams={searchParams} />;
}
```

```tsx
// features/invoices/components/invoices-view.tsx
import { searchParamsCache } from "@/nuqs/search-params";
import { getInvoices } from "../actions";
import { InvoicesTable } from "./invoices-table";

export async function InvoicesView({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { search, page, limit } = await searchParamsCache.parse(searchParams);
  const { invoices, total, pageCount } = await getInvoices({ search, page, limit });
  return <InvoicesTable invoices={invoices} total={total} pageCount={pageCount} />;
}
```

---

### 6.4 `components/shared/`

**Purpose:** UI building blocks reused across multiple features. Nothing domain-specific lives here.

| Path | Role |
| --- | --- |
| `form/` | Server Action–oriented form shell, `ActionState` typing, Zod → state helpers, field errors |
| `form-control/` | Accessible label + input + error composition |
| `confirm-dialog/` | Reusable destructive-action confirmation modal |
| `redirect-toast/` | Shows a Sonner toast once after redirect (reads a cookie set by server action) |
| `submit-button/` | Button that reads `useFormStatus()` internally for pending state |
| `spinner/` | Shared loading indicator |

### 6.5 `components/shared/form/form.tsx`

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
