# Project Progress

## Done

### Features
- **Auth** — register, login, logout via Lucia (Argon2id hashing, session cookies, Prisma adapter)
- **Route protection** — `proxy.ts` edge middleware + `validateRequest()` DB-layer check in dashboard layout
- **Customer CRUD** — create, read, update, delete with ownership enforcement (`userId` scoping)
- **Customer list** — TanStack Table with server-side search, pagination, client-side sorting, empty state
- **Customer detail page** — full field view with copy-to-clipboard, edit/delete actions
- **Dashboard overview** — stat cards (total customers, new this month, new this week, latest)
- **Settings page** — theme switcher (light / dark / system)
- **Profile page** — displays authenticated user's name, email, and role
- **Landing page** — hero, features, CTA, footer, auth shell layout
- **Loading skeletons** — all dashboard routes have `loading.tsx`
- **Toast notifications** — Sonner for action feedback + `redirect-toast` for post-redirect messages
- **Form system** — `useActionState` + `<Form>` + `<FormControl>` + `<FieldError>` + `SubmitButton`

---

## Known Bugs & Issues (from code review)

### Critical
- [x] **Cross-user duplicate check** — `createCustomer` and `updateCustomer` check `fileNumber` / `taxRegistrationNumber` / `nationalId` uniqueness across all users, not just the current user's customers (`features/customers/actions/index.ts:62–114`)
- [x] **Missing `revalidatePath` in `createCustomer`** — table cache not invalidated after creation; new customer only appears after hard refresh (`features/customers/actions/index.ts:74–79`)
- [x] **`updateCustomer` — unsafe `id` extraction** — `formData.get("id") as string` runs before auth and casts `null` to the string `"null"`, causing a silent "not found" error on missing hidden field (`features/customers/actions/index.ts:86`)
- [x] **Seed data fails form validation** — `taxRegistrationNumber` in seeds is 14 chars (e.g. `TRN-EG-1000001`); schema requires exactly 9. Seeded customers cannot be saved via the edit form (`prisma/seeds.ts` vs `lib/validations/customer.schema.ts:10`)

### Security
- [x] **Session token logged to console** — `console.log` in `createSession` prints the raw cookie value; will leak tokens in production logs (`lib/auth/session.ts:38`)
- [ ] **Arbitrary cookie write via Server Action** — `setCookieByKey(name, value)` accepts any cookie name from the client; a caller could overwrite the session cookie (`actions/cookies.actions.ts:5–8`)

### Bugs
- [ ] **`cursor-wait` class never applied** — `clsx({ pending: "cursor-wait" })` adds the class `"pending"` (always truthy string key), not `cursor-wait` (`components/shared/submit-button/index.tsx:48`)
- [ ] **`deleteCookieByKey` not awaited** — silent failure; toast cookie may persist and re-appear on next navigation (`components/shared/redirect-toast/index.tsx:16–17`)

### Architecture
- [ ] **Data-fetch functions marked as Server Actions** — `getCustomers`, `getCustomer`, `getDashboardStats` live in `"use server"` files making them POST-only endpoints; data fetching should use plain async functions (`features/customers/actions/index.ts`, `features/dashboard/actions/index.ts`)
- [ ] **`createColumns` not memoized** — recreated on every render, causing `useReactTable` to re-initialize unnecessarily (`features/customers/components/customers-table.tsx:58–65`)
- [ ] **Query logging unconditional** — `log: ["query"]` in `PrismaClient` runs in production; floods logs and may expose data (`lib/prisma.ts:17`)
- [ ] **Sidebar active-link too strict** — `pathname === href` exact match means nested routes (e.g. `/dashboard/customers/abc`) don't highlight the parent nav item (`features/dashboard/components/sidebar.tsx:42`)
- [ ] **Redundant `/api/customers` REST route** — dead endpoint alongside the Server Actions that serve the same data (`app/api/customers/route.ts`)

### Minor
- [ ] **`useActionFeedback` — `options` in dep array** — object created inline each render causes the effect to run every render (timestamp guard prevents double-firing but it's wasteful) (`components/shared/form/hooks/use-action-feedback.ts:30`)
- [ ] **`Label` missing `htmlFor`** — clicking the label doesn't focus the input; accessibility issue (`components/shared/form-control/index.tsx:28`)
- [ ] **`getInitials` crashes on empty word segments** — `name.split(" ").map(w => w[0])` returns `undefined` for consecutive spaces (`features/customers/components/customer-detail.tsx:21–26`)
- [ ] **Unused dependencies** — `react-hook-form` and `@hookform/resolvers` are installed but never used (`package.json`)

---

## Not Yet Implemented

- **ADMIN role** — defined in schema and `Role` enum, but has no effect anywhere in the app (no access control, no admin-only views)
- **Password change** — no way for a user to update their password from the profile page
- **Account settings** — only theme switching; no name/email editing
