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
│   └── db.ts                   # Prisma client singleton
│
└── actions/                    # Server Actions (use cases)
    ├── auth.actions.ts
    └── customer.actions.ts
```

---

## 7. Implementation Roadmap

1. **Initialize:** scaffold Next.js app, install Prisma, initialize Shadcn.
2. **Database:** push `schema.prisma` to Supabase, generate Prisma Client.
3. **Auth:** set up Lucia with the Prisma adapter; implement register/login/logout flows.
4. **Middleware:** protect dashboard routes via session validation.
5. **Actions:** implement `customer.actions.ts` for full CRUD logic.
6. **Views:** build the main Dashboard table and the "Add/Edit Customer" modal.
7. **Optimization:** add loading skeletons and toast notifications.
