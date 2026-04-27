# TaxDash — Playwright Test Report

**Date:** 2026-04-17  
**Tester:** Claude (automated via Playwright MCP)  
**Base URL:** http://localhost:3000

---

## Summary

| Category | Passed | Failed |
|---|---|---|
| Authentication | 5 | 1 |
| Customer CRUD | 5 | 0 |
| Dashboard / Overview | 1 | 0 |
| Settings | 1 | 0 |
| Profile | 0 | 1 |
| Security | 0 | 2 |
| **Total** | **12** | **4** |

---

## Issues Found

### 🔴 BUG-001 — Duplicate email registration gives no feedback

**Page:** `/register`  
**Steps:**
1. Register with `testuser@taxdash.test` (succeeds)
2. Sign out
3. Attempt to register again with the same email
4. Submit

**Expected:** Error toast or field error saying "Email already in use"  
**Actual:** Form stays on `/register` with no toast, no field error, and no indication of failure. The user has no idea what went wrong.

---

### 🔴 BUG-002 — Profile update shows no success/error feedback

**Page:** `/dashboard/profile`  
**Steps:**
1. Change the Name field
2. Click "Save changes"

**Expected:** A success toast ("Profile updated" or similar)  
**Actual:** Page reloads silently. No toast notification is shown. It is unclear to the user whether the save succeeded or failed.

---

### 🟠 SEC-001 — Passwords displayed in plaintext on customer detail page

**Page:** `/dashboard/customers/[id]`  
**Details:** The "Portal Password" and "Email Password" fields are shown in plaintext in the Personal Information section. These are sensitive credentials.

**Recommendation:** Mask the values by default (e.g., `••••••••`) with a show/hide toggle, similar to a standard password input pattern.

---

### 🟠 SEC-002 — CSV export includes plaintext passwords

**Endpoint:** `/api/customers/export`  
**Details:** The exported `customers.csv` file contains the `Email Password` and `Portal Password` columns in plaintext. Example row:

```
cmo36232e...,Acme Corp Updated,billing@acme.com,emailpass123,acmeuser,portalpass123,...
```

**Recommendation:** Either omit the password columns from the export entirely, or add a confirmation step warning the user that the file will contain sensitive credentials.

---

## Passed Tests

### Authentication

| Test | Result |
|---|---|
| Empty register form shows field-level validation errors | ✅ Pass |
| Valid registration redirects to `/dashboard` | ✅ Pass |
| Empty login form shows field-level validation errors | ✅ Pass |
| Login with wrong password shows "Invalid email or password" toast | ✅ Pass |
| Login with correct credentials redirects to `/dashboard` | ✅ Pass |
| Unauthenticated access to `/dashboard` redirects to `/login` | ✅ Pass |
| Logged-in user visiting `/login` is redirected to `/dashboard` | ✅ Pass |
| Sign out redirects to `/login` and clears session | ✅ Pass |

### Customer Management

| Test | Result |
|---|---|
| Empty Add Customer form shows validation errors on all required fields | ✅ Pass |
| Adding a valid customer shows success toast and appears in the table | ✅ Pass |
| Clicking a customer row navigates to the detail page | ✅ Pass |
| Edit dialog opens pre-populated with existing values | ✅ Pass |
| Saving edits updates the customer and shows "Customer updated" toast | ✅ Pass |
| Delete button shows confirmation dialog with customer name | ✅ Pass |
| Confirming delete removes the customer from the list | ✅ Pass |
| Name filter (`?search=...`) correctly filters table results | ✅ Pass |
| Column header sort button becomes active when clicked | ✅ Pass |

### Dashboard Overview

| Test | Result |
|---|---|
| Total Customers, New This Month, New This Week counters reflect real data | ✅ Pass |
| Latest Customer card shows the most recently added customer and date | ✅ Pass |

### Settings

| Test | Result |
|---|---|
| Dark / Light / System theme toggles apply immediately | ✅ Pass |

### CSV Export

| Test | Result |
|---|---|
| Clicking Export CSV triggers a file download of `customers.csv` | ✅ Pass |
| CSV contains correct customer records | ✅ Pass |

---

## Minor Observations

- **Page `<title>` is always "Taxes Dashboard"** — does not change per route. Browser tabs and history entries are indistinguishable. Consider adding route-specific titles (e.g., "Customers — TaxDash").
- **Console warnings:** 2 warnings present on most dashboard pages (non-fatal, but worth investigating).
- **Customer avatar initials** update correctly when the name is changed via Edit.
- **Pagination** controls and rows-per-page selector are present; could not be fully exercised with only 1–2 records.
