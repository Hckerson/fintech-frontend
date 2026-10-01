# Ledgerline Design OS — Phase 7: Frontend Architecture

> Version 2.1.0 · 2026-10-01 (enterprise-grade audit over 2.0.0 of 2026-09-28) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 6 — Interaction Contracts](phase-6-interaction-contracts.md) · Next: [Phase 8 — Implementation Roadmap](phase-8-implementation-roadmap.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [1. Architecture principles](#1-architecture-principles)
- [2. Styling organisation](#2-styling-organisation)
- [3. Folder structure](#3-folder-structure)
- [4. Route structure](#4-route-structure)
- [5. Layouts](#5-layouts)
- [6. Providers](#6-providers)
- [7. Feature folders](#7-feature-folders)
- [8. Hooks](#8-hooks)
- [9. Utilities](#9-utilities)
- [10. Constants](#10-constants)
- [11. Contexts](#11-contexts)
- [12. Stores](#12-stores)
- [13. API organization](#13-api-organization)
- [14. Component organization](#14-component-organization)
- [15. Shared libraries](#15-shared-libraries)
- [16. Design system location](#16-design-system-location)
- [17. Asset organization](#17-asset-organization)
- [18. Naming conventions](#18-naming-conventions)
- [19. Code splitting strategy](#19-code-splitting-strategy)
- [20. Lazy loading](#20-lazy-loading)
- [21. Performance strategy](#21-performance-strategy)
- [22. Security](#22-security)
- [23. Observability](#23-observability)
- [24. Code templates](#24-code-templates)
- [25. Open decisions touched by this phase](#25-open-decisions-touched-by-this-phase)
- [26. Assumptions](#26-assumptions)
- [27. Changes in this version](#27-changes-in-this-version)
- [28. Traceability](#28-traceability)

## 1. Architecture principles

1. **Host conventions win.** `.claude/CLAUDE.md` governs locations, file rules and patterns; this phase maps Ledgerline onto them and names every deviation (OD4).
2. **Server first.** Pages, layouts and static sections are Server Components; client islands only where interaction lives.
3. **Contract-derived.** Every backend shape comes from `@/lib/contract`; no hand-typed response.
4. **One home per concern.** Transport in `lib/api-*`, calls in `lib/actions/`, caching in `lib/hooks/`, rendering in `components/`.
5. **URL is state** for anything shareable; context only for the workspace; no global store.
6. **Exact money end to end.** Minor-unit strings from the wire to C40; `BigInt` where arithmetic is unavoidable.
7. **No styling decisions here.** How anything looks is decided per page at build (§2).
8. **The server decides.** Authorisation is enforced by the backend on every call and repeated in `proxy.ts`, the group layouts and every Server Action; nothing the browser renders or hides is a control (§5.7, §22).
9. **One tenant per cache.** No query result, storage entry or server-side memo outlives or crosses the user and workspace it was read for (§8.1, §22.4).
10. **Fail loudly at start, closed in doubt.** A misconfigured deployment refuses to start (§10.4); an unreadable session, role, switch or response is treated as denied, never as allowed.
11. **Every failure is classified and quotable.** A failed call maps to exactly one error class with one way of being surfaced and a reference the member can quote to support (§13.6, §23).
12. **Every rule has a check.** A convention in this phase names the lint rule, test or CI step that enforces it (§14.1, §14.2); a rule with no check yet is listed as a proposal, not assumed to hold.

## 2. Styling organisation

Styling is organised by the host conventions (`styles/tokens.css`, `styles/globals.css`, Tailwind on house tokens, named classes when a pattern repeats) and decided per page at build with the owner. This design OS specifies no tokens, classes, breakpoints or visual rules.

State of the working tree, recorded for engineers: the owner has changed the host styling rule to allow responsive prefixes, removed the `token-first-classnames` lint rule, added Ledgerline values to `styles/tokens.css`, a `theme-ledgerline` class, and turned `application-register-density` off for `app/page.tsx` and `components/ledgerline/**`. None of these is specified or reversed by this document.

## 3. Folder structure

Legend: **H** host-mandated · **OD4** feature folder pending a host folder-table amendment · **N** Next.js convention · **B** exists in the working tree.

```text
frontend/
├── app/                                  H  routes (section 4)
├── components/
│   ├── ui/                               H  C01–C33 primitives (B: button.tsx)
│   ├── common/                           H  C34–C55 compositions (B: login-form.tsx)
│   ├── wrappers/                         H  C56–C60, C68 (B: motion-wrapper.tsx, reveal-words.tsx)
│   ├── providers/                        H  C61–C63 (B: provider.tsx)
│   ├── ledgerline/                       B  public home page sections S04 S06 S07 S55–S64 (created by the owner; see OD4)
│   ├── shell/                            OD4 S01 S02 S03
│   ├── marketing/                        OD4 S05 (if built separately from ledgerline/)
│   ├── auth/                             OD4 S08
│   ├── onboarding/                       OD4 S09–S13
│   ├── dashboard/                        OD4 S14–S18
│   ├── ledger/                           OD4 S19–S23
│   ├── transactions/                     OD4 S24–S27
│   ├── insights/                         OD4 S28 S29
│   ├── documents/                        OD4 S30–S32
│   ├── counterparties/                   OD4 S33
│   ├── inbox/                            OD4 S34 S36 S37
│   ├── settings/                         OD4 S35 S38–S43
│   ├── payments/                         OD4 S44 S45 (Deferred, OD3)
│   ├── help/                             OD4 S46 S47
│   ├── admin/                            OD4 S48–S53
│   └── system/                           OD4 S54
├── lib/                                  H  no JSX
│   ├── actions/                          H  Server Actions (B: create-user.ts, get-accounts.ts, get-cash-flow.ts)
│   ├── contract/                         H  generated — never edit
│   ├── data/                             H  static copy and config (B: ledgerline/ sample content for P01)
│   ├── enums/                            H  lifecycle tuples
│   ├── hooks/                            H  use-<resource>.ts + query-keys.ts (B: use-login, use-logout, use-register, use-create-user, use-debounced-search, use-accounts, use-cash-flow, use-runway-params, use-online, use-settled, use-damped-pointer)
│   ├── types/                            H  <domain>.ts re-exported by index.ts (B: api.ts, ledgerline.ts)
│   ├── utils/                            H  pure + server-only helpers (B: date-*, internal-path, query-string, local-storage, session, verify-session-token, money, runway, http-status)
│   ├── validations/                      H  Zod composing contract schemas (B: contact.ts)
│   ├── ledgerline/                       B  feature constants and helpers for the public page (constants.ts, money.ts, chart.ts)
│   ├── <feature>/constants.ts            H  feature-scoped constants
│   ├── api-client.ts · api-routes.ts · api-server.ts · constants.ts   H
├── design-os/generated/                  H  this design OS
├── public/fonts/                         H  font.ts
├── styles/                               H  tokens.css, globals.css
├── tools/eslint/rules/ · tools/codemods/ · tools/contract/   H
├── proxy.ts                              N
├── instrumentation.ts                    N  startup configuration check (§10.4), error forwarding (§23)
└── next.config.ts                        N  security headers
```

**OD4 — feature folders.** The host table lists only flat `ui`, `common`, `wrappers`, `providers` under `components/`. Sixty-four data-bound sections in `common/` would blur reusable compositions and single-page sections. The owner's `components/ledgerline/` is precedent that a feature folder is acceptable in practice, but the host folder table has not been amended. Proposed row: `/components/<feature>` · *(flat per feature)* · *Sections for one product area; import from ui/common/wrappers, never from another feature folder.*

`lib/data/` holds static copy and config. Product balances, transactions and people come from the backend seed (BR11). The public page's sample content in `lib/data/ledgerline/` is permitted by the host rule for sample data and is the subject of OD9 facet d.

**Type-name collision (2.0.0 finding).** `lib/types/ledgerline.ts` exports `Transaction` (and other marketing sample shapes) through `lib/types/index.ts`. The domain `Transaction` proposed in Phase 5 would collide. Before any domain type lands, the sample types need a distinct name (for example `SampleTransaction`) — a rename the maintainer must approve, recorded as risk R-10 in Phase 8.

## 4. Route structure

Route groups do not change URLs. `(workspace)` is a nested group inside `(app)` (§5.3).

```text
app/
├── layout.tsx                                       root (B)
├── not-found.tsx · error.tsx · global-error.tsx     P34, P35
├── (marketing)/
│   ├── layout.tsx                                   public navigation + legal & support links
│   ├── page.tsx                                     P01 Home  /   (B: currently app/page.tsx)
│   └── help/page.tsx · help/[slug]/page.tsx · help/[slug]/not-found.tsx    P28
├── (auth)/
│   ├── layout.tsx
│   └── auth/login · register · forgot-password · reset-password · verify   P02–P06   (B: P02 at app/auth/login/page.tsx)
├── (app)/
│   ├── layout.tsx · error.tsx                       session guard
│   ├── onboarding/page.tsx · loading.tsx            P07
│   └── (workspace)/
│       ├── layout.tsx · loading.tsx · error.tsx     workspace load + shell + @drawer slot
│       ├── @drawer/default.tsx · [...catchAll]/page.tsx · (.)transactions/[transactionId]/page.tsx   P12 overlay
│       ├── dashboard/page.tsx                       P08
│       ├── accounts/page.tsx · [accountId]/{page,loading,not-found}.tsx   P09 P10
│       ├── transactions/page.tsx · views/page.tsx · flagged/page.tsx · [transactionId]/{page,not-found}.tsx   P11 P13 P14 P12
│       ├── insights/compare/page.tsx · insights/runway/page.tsx   P15 P16
│       ├── statements/page.tsx · exports/page.tsx   P17 P18
│       ├── counterparties/[counterpartyId]/{page,not-found}.tsx   P19
│       ├── notifications/page.tsx                   P20
│       ├── messages/{layout,page}.tsx · messages/[threadId]/page.tsx   P21
│       ├── settings/page.tsx · settings/team/page.tsx · settings/team/[memberId]/page.tsx · settings/profile/page.tsx   P22–P25
│       └── payments/page.tsx · payments/transfer/page.tsx   P27 P26 (Deferred; notFound() while switched off)
├── (admin)/
│   ├── layout.tsx · loading.tsx · error.tsx         platform-role guard + shell
│   └── admin/page.tsx · users/page.tsx · users/[userId]/{page,not-found}.tsx · compliance/{layout,page}.tsx · compliance/[caseId]/{page,not-found}.tsx · support/page.tsx   P29–P33
└── api/session/route.ts · api/register/route.ts     host (B)
```

Notes:

- Moving `app/page.tsx` and `app/auth/login/page.tsx` into their groups replaces them (two files for one URL is a build error). The move is FD04 and must not disturb the owner's in-progress home page.
- P12 has two entry points: soft navigation from S23 opens the intercepted overlay route; hard loads and shared links render the full page. `[...catchAll]` in the slot returns nothing so the overlay closes on navigation.
- P26 and P27 are routed so the IA is complete; while the server-side money-movement switch is off they call `notFound()`.

### 4.1 Route handlers

| Handler | Methods | Purpose |
|---|---|---|
| `app/api/session/route.ts` | POST, DELETE | Exchange credentials for the httpOnly session cookie; clear it. |
| `app/api/register/route.ts` | POST | Create the user and start the session. |

Rules for both handlers and any handler added later:

| Concern | Rule |
|---|---|
| Request | `Content-Type: application/json` only (otherwise 415). Body parsed by a Zod schema in `lib/validations/` that composes the contract schema; a body over `REQUEST_BODY_MAX_BYTES` is refused with 413 before parsing. POST and DELETE require an `Origin` equal to the deployment origin (otherwise 403) — §22.2. |
| Response | `Cache-Control: no-store`. A failure body is `{ message, reference }` with the message from constants; an upstream error body is never passed through to the browser. The access token is written only to the httpOnly cookie and never appears in a response body. |
| Status mapping | 400 malformed body · 401 credentials refused, with one message whether or not the account exists (Q-239) · 409 registration for an existing account · 429 backend throttle or lockout, `Retry-After` passed through · 503 backend unreachable, timed out (§13.7) or answering 5xx. A backend fault is never reported as wrong credentials (H-02). |
| Repeats | `DELETE /api/session` is idempotent: 204 with or without a cookie, and it asks the backend to invalidate the session before clearing the cookie (Q-229). A repeated `POST /api/register` creates no second user (409); the calling hook refuses a second submission while one is pending. |
| Session expiry mid-request | A handler never refreshes a session implicitly; an expired token yields 401 and the caller follows X4. |

No new BFF handlers are required: binary downloads use short-lived signed URLs requested by a Server Action (P7-A2); uploads stream through a Server Action with the session token. A handler is added to `app/api/` and `lib/api-routes.ts` only when a non-React client must reach it or a response must stream (§13.5). An enquiry intake for S64 (OD10) would follow the same rule.

## 5. Layouts

### 5.1 Root layout — `app/layout.tsx`

- Imports global styles and font variables (host; built).
- Wraps children in C61 Provider and C62 Message provider.
- Metadata title template and description from constants (`APP_NAME`, `APP_DESCRIPTION`). **Built state:** the working tree sets a Ledgerline title and description and a theme class and theme colour from `lib/ledgerline/constants.ts` — resolving host finding H-08 for the title.
- Renders a skip link to `MAIN_CONTENT_ID` as the first focusable element.
- If a colour-scheme preference is offered (C54), the root reads its cookie so the first byte already carries the choice (no flash). Cost: the root becomes dynamic; the marketing layout may ignore the cookie if P01 load time matters.

### 5.2 `(app)/layout.tsx` — session guard

`getSession()` from `lib/utils/session.ts`; no session → `redirect(LOGIN_ROUTE)`. No shell: onboarding uses a minimal frame because a new user has no workspace.

### 5.3 `(app)/(workspace)/layout.tsx` — shell

- Loads the current workspace and role via `getCurrentWorkspace`; no membership → `redirect(ONBOARDING_ROUTE)`; failure → `(app)/error.tsx`.
- Wraps children in C63 with that value; renders S01, S02, `<main id={MAIN_CONTENT_ID}>`, the `drawer` slot, C55.
- Why a nested group: onboarding needs a session but no workspace; every other page needs both. URLs are unchanged (P7-A1).
- Layouts do not re-render on client navigation, so this is a first-paint guard; the backend authorizes every call.

### 5.4 `(admin)/layout.tsx` — platform-role guard

`getSession()`; none → `redirect(LOGIN_ROUTE)`; `role !== "ADMIN"` → `notFound()` (a guess at `/admin` learns nothing). Renders S01 with `lib/data/admin-nav.ts` and S02; no C63. `proxy.ts` repeats the role check before rendering.

### 5.5 `(auth)/layout.tsx`

A frame with no product navigation. The proxy redirects signed-in users away from `/auth` (except `/auth/verify` for step-up).

### 5.6 `(marketing)/layout.tsx`

Public navigation (S55) and legal & support links (S07). The built P01 renders both itself today; when it moves into the group, they move into this layout so P28 shares them.

### 5.7 Guard matrix

Every boundary repeats the check; only the backend is authoritative. A boundary that cannot read what it needs (missing key, unparseable token, backend unreachable) denies.

| Boundary | File | Checks | What a denied person experiences |
|---|---|---|---|
| Edge | `proxy.ts` | token signature and expiry; protected prefix; platform role on `ADMIN_ROUTE_PREFIX` | Signed out or token invalid: sent to P02 with the requested path and query in `next`, and an invalid cookie is deleted. Signed in without the platform role on an admin path: the same not-found response as an unknown URL. |
| Session layout | `app/(app)/layout.tsx` | session present | Sent to P02. |
| Workspace layout | `app/(app)/(workspace)/layout.tsx` | membership and role for the workspace named by `WORKSPACE_COOKIE` | No membership: sent to P07. A cookie naming a workspace the member no longer belongs to is discarded and membership is resolved again from the backend; the cookie is a preference, never proof. |
| Platform layout | `app/(admin)/layout.tsx` | platform role | P34, so a guess at an internal URL learns nothing. |
| Server Action, route handler | `lib/actions/*`, `app/api/*` | session cookie present; input parsed by Zod; the workspace is read from the server-side cookie, never from an argument the browser supplies | An `ActionResult` failure of class `unauthenticated`, `forbidden` or `validation` (§13.6). |
| Backend | every operation | session, membership, role permission, and that the resource belongs to the caller's workspace | 401, 403, or 404. A resource in another workspace answers 404, identical to one that does not exist. |
| Presentation | C59 | the matrix in `lib/data/` (BR9) | An explained denial naming who can grant access (Q-064). Never enforcement. |

Role reach: R1–R4 hold a workspace role and reach `(workspace)`; R5–R7 hold the platform role and reach `(admin)` (A9 — until finer platform roles exist the backend, not the frontend, separates what R5, R6 and R7 may do inside it). A role changed or a membership removed while the person is signed in takes effect on their next call: the call fails as `forbidden`, the cached entries for that resource are removed, and the workspace value is reloaded with `router.refresh()` so C59 and navigation agree with the backend. Nothing already displayed is trusted for a further action.

## 6. Providers

| ID | Provider | File | Holds | Mounted in | Why |
|---|---|---|---|---|---|
| C61 | Provider | `components/providers/provider.tsx` (B) | `QueryClient` + `MotionConfig reducedMotion="user"` + devtools (dev) | root | Host provider. Target: `QueryCache.onError` routes 401 to C55 and step-up to X4; `staleTime` from `STALE_TIME`. |
| C62 | Message provider | `components/providers/toast-provider.tsx` | queue, polite live region | root | One live region announces every mutation result once. |
| C63 | WorkspaceProvider | `components/providers/workspace-provider.tsx` | current workspace + role | `(workspace)` layout | Read by S01, C59 and most sections; context from server data, not a store. |

A colour-scheme preference, if offered, is a cookie and a class on `<html>`, not a provider: C54 applies it immediately, calls a `setColourScheme` Server Action, then `router.refresh()` in a transition. Order in the root: Provider → Message provider → children.

C61 owns the client defaults so no hook restates them: `staleTime`, `gcTime`, `retry`, `retryDelay` and `networkMode` come from constants (§10.3, §13.7); `QueryCache.onError` and `MutationCache.onError` classify every failure once (§13.6), open C55 for `unauthenticated` and `step_up_required`, and forward the classified event to the reporting path (§23). The `QueryClient` is created once per browser tab inside the provider's state and once per request on the server (`get-query-client.ts`); it is never a module-level value, because a module-level client on the server would be shared between members.

## 7. Feature folders

Every section is a component in its feature folder, kebab-case, one per file; a section over 150 lines splits into siblings. Features import from `ui/`, `common/`, `wrappers/`, `providers/`, `@/lib/*` — never another feature folder. File names below are the 1.0.0 proposals; renaming to the 2.0.0 section names is a build choice.

| Folder | Sections (file) | Pages |
|---|---|---|
| `components/shell/` | S01 `app-sidebar.tsx` · S02 `top-bar.tsx` · S03 `page-header.tsx` | all `(app)`/`(admin)` |
| `components/ledgerline/` (B) | S04 `hero-section.tsx` (+ `product-frame.tsx`, `product-stage.tsx`, `frame-*.tsx`) · S06 `security-section.tsx` · S07 `ledger-footer.tsx` · S55 `ledger-nav.tsx` · S56 `metrics-strip.tsx` · S57 `accounts-section.tsx` (+ `tile-*.tsx`) · S58 `payments-section.tsx` (+ `approval-card.tsx`, `approval-step-row.tsx`) · S59 `cards-section.tsx` (+ `metal-card.tsx`, `card-controls.tsx`) · S60 `treasury-section.tsx` (+ `forecast-chart.tsx`) · S61 `reconcile-section.tsx` (+ `matched-row.tsx`) · S62 `pricing-section.tsx` (+ `plan-card.tsx`) · S63 `faq-section.tsx` (+ `faq-row.tsx`) · S64 `contact-section.tsx`; shared pieces `ledger-button.tsx`, `ledger-logo.tsx`, `ledger-glyph.tsx`, `section-heading.tsx`, `signature-rule.tsx` | P01 |
| `components/marketing/` | S05 `value-proposition-grid.tsx` (not built) | P01 |
| `components/auth/` | S08 `auth-card.tsx` + variant forms | P02–P06 |
| `components/onboarding/` | S09 `onboarding-stepper.tsx` · S10 `business-details-form.tsx` · S11 `beneficial-owners-form.tsx` · S12 `document-upload.tsx` · S13 `verification-status-banner.tsx` | P07, P08 |
| `components/dashboard/` | S14 `cash-position-band.tsx` · S15 `account-summary-strip.tsx` · S16 `recent-activity.tsx` · S17 `pending-items.tsx` · S18 `cash-flow-chart.tsx` · `dashboard-variant.tsx` | P08 |
| `components/ledger/` | S19 `account-list.tsx` · S20 `account-hero.tsx` · S21 `ledger-toolbar.tsx` · S22 `ledger-summary.tsx` · S23 `ledger-table.tsx` | P09 P10 P11 P14 P19 |
| `components/transactions/` | S24 `transaction-detail.tsx` · S25 `transaction-timeline.tsx` · S26 `notes-and-attachments.tsx` · S27 `saved-views-list.tsx` · `transaction-drawer.tsx` (overlay composition) | P12 P13 |
| `components/insights/` | S28 `period-comparison.tsx` · S29 `runway-calculator.tsx` | P15 P16 |
| `components/documents/` | S30 `statement-list.tsx` · S31 `export-builder.tsx` · S32 `export-jobs.tsx` | P17 P18 |
| `components/counterparties/` | S33 `counterparty-summary.tsx` | P19 |
| `components/inbox/` | S34 `notification-feed.tsx` · S36 `thread-list.tsx` · S37 `conversation.tsx` | P20 P21 |
| `components/settings/` | S35 `alert-rules.tsx` · S38 `workspace-general-form.tsx` · S39 `team-table.tsx` · S40 `invite-member-form.tsx` · S41 `role-permissions-matrix.tsx` · S42 `profile-form.tsx` · S43 `security-settings.tsx` | P22–P25 |
| `components/payments/` | S44 `transfer-form.tsx` · S45 `payee-list.tsx` | P26 P27 |
| `components/help/` | S46 `help-search.tsx` · S47 `help-article.tsx` | P28 |
| `components/admin/` | S48 `admin-kpi-band.tsx` · S49 `admin-users-table.tsx` · S50 `admin-user-record.tsx` · S51 `compliance-case-queue.tsx` · S52 `compliance-case-review.tsx` · S53 `support-lookup.tsx` | P29–P33 |
| `components/system/` | S54 `status-page-body.tsx` + `status-retry-button.tsx` | P34 P35 |

Count: 64 sections (54 specified in 1.0.0 + S55–S64).

### 7.1 Section anatomy

| File | Kind | Role |
|---|---|---|
| `<section>.tsx` | Server Component | Prefetches the LCP-critical query and wraps the view in `HydrationBoundary`. Only for LCP-critical sections: S14, S19, S20, S23. |
| `<section>-view.tsx` | Client Component | Calls the hook, renders through C57. |
| `<section>-skeleton.tsx` | Server Component | Loading placeholder passed to `<Suspense>`; reserves space so nothing shifts. |

## 8. Hooks

All hooks live in `lib/hooks/use-<resource>.ts`, one per file, TanStack Query v5. Authenticated hooks wrap a Server Action and unwrap its `ActionResult` with `unwrap`. Components import hooks, never the API client or an action.

### 8.1 Query-key factory — `lib/hooks/query-keys.ts`

- Keys are built only by the factory (template 24.3).
- Hierarchy `[resource, workspaceId, scope, params]`; `me`, `workspaces`, `admin` are not workspace-scoped.
- Every workspace-scoped key carries the workspace ID **and** switching workspace (C36) or signing out (X3) calls `queryClient.clear()` before `router.refresh()`. Why both: `clear()` alone races with late responses; with the ID in the key, a late response lands in a key nothing reads.
- **Equal inputs, equal keys.** Filters enter a key only after `parseLedgerFilters` has normalised them (defaults applied, empty values dropped, lists sorted), so two URLs that mean the same view share one cache entry and one request.
- **Nothing sensitive in a key.** Keys hold opaque IDs, enum values, calendar dates and the free-text search term only. A full account number, a one-time code or a signed URL is never a key part and never cached: the reveal is a mutation with `gcTime: 0` whose result lives in component state for `REVEAL_TIMEOUT`.
- **Platform keys carry the acting user.** `admin` keys are not workspace-scoped, so they are cleared on sign-out and never survive a change of signed-in user in the same tab.
- **The cache is memory only.** No `persistQueryClient`, and no query result in `localStorage`, `sessionStorage` or IndexedDB: balances and transactions must not remain on a shared machine after the tab closes. `use-local-storage` holds only non-financial interface preferences (navigation collapsed, display preferences), namespaced by user ID and workspace ID and removed on sign-out. The palette's Recent entries (C38) are not among them: they hold entity IDs and labels, which can name accounts and counterparties, so they are kept in the open tab's memory only and cleared on sign-out. A message, note or form draft is never one of them: a draft lives in the open tab's memory only, is never written to `localStorage`, `sessionStorage`, IndexedDB or a service-worker cache, and is gone when the tab closes or a different user signs in.
- **Every tab agrees.** Sign-out, session expiry and workspace switch are announced on a `BroadcastChannel`; each tab that hears it clears its cache and re-renders from the server, so a second tab never keeps showing the previous workspace or a signed-out member's balances (X4).
- **Factory coverage.** Template 24.3 shows the shape; every resource in §8.2 has a factory entry before its hook is written, and an array literal passed as `queryKey` outside `query-keys.ts` is a lint error (§14.1).

### 8.2 Hook inventory

Kind: Q `useQuery`, IQ `useInfiniteQuery`, M `useMutation`, L local.

| Hook | Kind | Server Action | Sections | State |
|---|---|---|---|---|
| `use-login` | M | same-origin `apiRoutes.session()` | S08 | B |
| `use-logout` | M | same-origin `apiRoutes.session()` | S02 C37 | B |
| `use-register` | M | same-origin `apiRoutes.register()` | S08 | B |
| `use-create-user` | M | `create-user.ts` | S49 | B |
| `use-debounced-search` | L | — | S11 S21 S36 S46 S49 S53 | B |
| `use-damped-pointer` | L | — | S04 (public preview) | B (public page; no spec beyond reduced-motion obligations) |
| `use-online` | L | — | S54 offline variant, C33, mutation guards (§13.11) | B |
| `use-settled` | L | — | delayed loading and settle timing (`LOADING_DELAY_MS`) | B |
| `use-runway-params` | L | — | S29 (inputs mirrored to the URL) | B |
| `use-me` | Q | `get-me.ts` | S01 S02 S42 | — |
| `use-workspace` | Q | `get-current-workspace.ts` | S01 S38 | — |
| `use-update-workspace` | M | `update-workspace.ts` | S38 | — |
| `use-notifications` | Q | `list-notifications.ts` | S02 S34 | — |
| `use-mark-notifications-read` | M | `mark-notifications-read.ts` | S34 | — |
| `use-request-password-reset` | M | `request-password-reset.ts` | S08 | — |
| `use-reset-password` | M | `reset-password.ts` | S08 | — |
| `use-verify-challenge` | M | `verify-challenge.ts` | S08 | — |
| `use-step-up` | M | `step-up.ts` | C55 C42 | — |
| `use-verification-case` | Q | `get-verification-case.ts` | S09 S13 S17 | — |
| `use-update-verification-case` | M | `update-verification-case.ts` | S09 S10 S11 | — |
| `use-upload-document` | M | `upload-document.ts` | S12 | — |
| `use-accounts` | Q | `get-accounts.ts` (1.0.0 proposal `list-accounts.ts`) over `routes.accountsFindAll` | S14 S15 S19 S29 | B (its key must come from the factory with the workspace ID, §8.1) |
| `use-account` | Q | `get-account.ts` | S20 | — |
| `use-reveal-account-number` | M | `reveal-account-number.ts` | C42 | — |
| `use-transactions` | IQ (limit variant Q) | `list-transactions.ts` | S16 S17 S23 | — |
| `use-transaction` | Q | `get-transaction.ts` | S24 S25 | — |
| `use-update-transaction` | M | `update-transaction.ts` | S26 | — |
| `use-upload-attachment` | M | `upload-attachment.ts` | S26 | — |
| `use-ledger-summary` | Q | `get-ledger-summary.ts` | S22 | — |
| `use-cash-flow` | Q | `get-cash-flow.ts` over `routes.cashFlowSeries` | S18 S29 | B (its key must come from the factory with the workspace ID, §8.1) |
| `use-saved-views` | Q + M | `list-saved-views.ts`, `save-view.ts` | S21 S27 | — |
| `use-compare-periods` | Q | `compare-periods.ts` | S28 | — |
| `use-statements` | Q | `list-statements.ts` | S30 | — |
| `use-create-export` | M | `create-export.ts` | S31 | — |
| `use-exports` | Q (polling) | `list-exports.ts` | S17 S32 | — |
| `use-counterparty` | Q | `get-counterparty.ts` | S33 | — |
| `use-alert-rules` / `use-update-alert-rules` | Q / M | `list-alert-rules.ts` / `update-alert-rules.ts` | S35 | — |
| `use-threads` / `use-thread` / `use-send-message` | Q / Q / M | `list-threads.ts` / `get-thread.ts` / `send-message.ts` | S36 S37 | — |
| `use-team` / `use-invite-member` / `use-team-member` | Q / M / Q | `list-team.ts` / `invite-member.ts` / `get-team-member.ts` | S39 S40 S42 | — |
| `use-update-profile` / `use-change-password` | M / M | `update-profile.ts` / `change-password.ts` | S42 S43 | — |
| `use-sessions` / `use-two-step` | Q + M / Q + M | `list-sessions.ts`, `revoke-session.ts` / `get-two-step.ts`, `enrol-two-step.ts` | S43 | — |
| `use-admin-user-total` / `use-admin-user-series` | Q / Q | `get-admin-user-total.ts` / `get-admin-user-series.ts` | S48 | — |
| `use-admin-users` / `use-admin-user` | Q / Q + M | `list-admin-users.ts` / `get-`, `update-`, `remove-admin-user.ts` | S49 S50 | — |
| `use-compliance-cases` / `use-compliance-case` / `use-decide-case` | Q / Q / M | `list-compliance-cases.ts` / `get-compliance-case.ts` / `decide-case.ts` | S51 S52 | — |
| `use-support-lookup` | Q | `support-lookup.ts` | S53 | — |
| `use-local-storage` | L | — | Non-financial interface preferences only (never C38 Recent entries, and never a draft: Recent entries and S37 and S26 drafts stay in the open tab's memory, §8.1) | — |
| `use-create-transfer` / `use-payees` | M / Q | `create-transfer.ts` / `list-payees.ts` — Deferred (OD3) | S44 S45 | — |
| `use-enquiry` | M | intake per OD10 — not decided | S64 | — |

### 8.3 Patterns

- **Server Action pairing.** `mutationFn`/`queryFn` call the action and `unwrap`; mutations `setQueryData` the detail and invalidate the list prefix (template 24.5).
- **Infinite queries** for S23 with nullable cursor, `getNextPageParam`/`getPreviousPageParam`, and `maxPages: LEDGER_MAX_PAGES`.
- **Polling** in `use-exports`: `refetchInterval` returns `EXPORT_POLL_INTERVAL` while any job is in `ACTIVE_EXPORT_STATES`, else `false`; `refetchIntervalInBackground: false`; a job still active after `EXPORT_POLL_MAX_MS` (30 minutes) is shown as delayed and the client stops polling it.
- **Server prefetch** for LCP-critical sections through the same `queryOptions` factory.
- **Optimistic updates** only for S26 flag and category (and S34 mark-read); never for anything that looks like money. `onMutate` cancels in-flight queries for the affected keys and snapshots them; `onError` restores the snapshot and reports the failure once through C62; `onSettled` invalidates. A balance, total, amount, status or export state is only ever shown as the server last returned it.
- **Double submission.** A mutation hook exposes `isPending`, and its consumer refuses a second submission while one is pending. Creation actions (`create-export`, `send-message`, `invite-member`, `upload-*`, `decide-case`, and the Deferred `create-transfer`) send an idempotency key generated with `nanoid` once per attempt and reused on retry of that attempt, so a repeated request returns the original result instead of a second export, message, invitation or decision (§13.10).
- **Stale writes.** Update actions send the version of the record the member was looking at; the backend refuses a write against an older version with 409 and the hook surfaces class `conflict` with the member's input preserved (§13.10). Last-write-wins is not used for anything a second person may edit.
- **Supersession and cancellation.** A new key supersedes the old one: the previous result stays displayed (`placeholderData: keepPreviousData`) until the new one arrives, and a late response for a superseded key is written to a key nothing reads. Free-text input is debounced with `use-debounced-search` (`SEARCH_DEBOUNCE_MS`) so superseded requests are mostly never sent. A Server Action cannot be aborted from the browser; the `AbortSignal` TanStack Query passes is honoured only on the transports that support it (`lib/api-client.ts`, and the GET handlers of §13.5 if adopted). Server-side, every upstream call carries its own timeout (§13.7).
- **Session expiry during a call.** A query that fails `unauthenticated` is refetched once after C55 completes re-authentication. A mutation interrupted by expiry or by a step-up demand is never replayed automatically: the member's input stays in the form or draft, held in the open tab's memory only (§8.1), and they submit again, with the idempotency key of the interrupted attempt, so nothing is written under an identity check the member did not see. When a different user re-authenticates, or the tab closes, the drafts are gone with the cache.
- **Disabled, not failing.** A hook whose inputs are incomplete (no workspace yet, no account chosen, search shorter than its minimum) sets `enabled: false` rather than sending a request the backend will refuse.

## 9. Utilities

| File | Signature | Rule |
|---|---|---|
| `money.ts` | `formatMoney(amountMinor: string, currency: string, options?: { locale, signDisplay, maximumFractionDigits }): string \| null` | `BigInt` parse; digits from `Intl…resolvedOptions().maximumFractionDigits`; `signDisplay: "exceptZero"` for movements, `"auto"` for balances. Returns `null` for anything that is not an optional minus sign followed by digits (empty, decimal point, exponent, grouping, whitespace) — the caller shows the amount as unavailable; a malformed amount is never coerced to zero. Only C40/C41 consume it. |
| `money.ts` | `sumMinor(amounts: string[]): string` | `BigInt` addition of amounts in **one** currency; callers group by currency before calling and never add across currencies (Phase 3 §8.3). Server totals preferred: a client sum covers only the rows it holds and is never presented as an account or period total. |
| `runway.ts` | `runwayMonths(balanceMinor, monthlyNetBurnMinor): number \| null` | `null` when not burning; whole months rounded down; property-tested. One currency per calculation. |
| `date-range.ts` | `resolveRange(preset, today): DateRange` | `date-fns`; presets enum in `lib/enums/`; `DATE_VALUE_FORMAT`. `today` is passed in as a calendar date in the workspace time zone (§9.1), which keeps the function pure and testable across month-end, leap-day and daylight-saving boundaries. |
| `ledger-params.ts` | `parseLedgerFilters(params)` / `serializeLedgerFilters(filters)` | `.catch()` defaults; serialises via host `queryString`. Free text is trimmed and cut at `LEDGER_QUERY_MAX_LENGTH` (100), and a `q` shorter than `LEDGER_QUERY_MIN_LENGTH` (2) is not sent to the backend; a `from` after `to`, an unknown enum value or an amount that is not minor-unit digits falls back to the default rather than reaching the backend. With no `from` and no `to` the ledger is unbounded: newest first, paged back by cursor without limit. `LEDGER_MAX_RANGE_DAYS` applies only when both bounds are given; when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared (§13.9). The parameter set is Phase 3 §11.1's, in full: `from`, `to`, `type`, `direction` (`in` or `out`), comma-list `status`, comma-list `category` (at most 20 values, unknown values dropped), `min`, `max`, `q`, `account` (at most `LEDGER_ACCOUNT_FILTER_MAX` IDs), `flagged`, `attachment` (`yes`), `view`; the `LedgerFilters` type in `lib/types/` carries exactly these fields. A serialised URL longer than 2,000 characters is refused rather than written. Round-trip (`parse(serialize(x))` equals `x`) is property-tested. |
| `unwrap.ts`, `action-error.ts` | `unwrap(result)`, `class ActionError { status, kind, reference }`, `errorKind(status, code)` | The single place a failure is classified (§13.6). Lets C61 route `unauthenticated` and `step_up_required`. |
| `read-envelope.ts` | `readEnvelope(upstream, schema)` | `server-only`; one place for response parsing. A response that does not match its contract schema becomes `upstream_invalid` (502) and is never rendered partially. |
| `request-id.ts` | `requestId()` | Safe to import on the server and in the browser (it depends only on `nanoid`); an alphabet free of look-alike characters, `REQUEST_ID_LENGTH` long. On the server it is attached by `backendFetch` as `REQUEST_ID_HEADER` and returned as the `reference` of a failure (§23); in the browser it issues the reference for a refusal that never leaves the device (validation, offline). A server-issued reference is one support can look up; a device-issued one identifies the report the member sends. |
| `report.ts` | `report(event)` | The one path a failure or metric leaves the application by; applies the allow-list redaction of §23 and is a no-op when no service is configured. |
| `public-env.ts`, `server-env.ts` | `publicEnv`, `serverEnv` | The parsed, validated configuration (§10.4). `server-env.ts` is `server-only`; `public-env.ts` names each `NEXT_PUBLIC_*` variable literally so the bundler can inline it. The only two modules that read `process.env`. |
| `refusal-message.ts` | `refusalMessage(body)` | Promoted from `lib/actions/create-user.ts` on second use. |
| `get-query-client.ts` | `getQueryClient()` | Server-side, React `cache()`. |
| `mask.ts` | `maskAccountNumber(last4)` | Presentation only. |
| `onboarding-progress.ts`, `pending-items.ts`, `describe-filters.ts` | pure | Phase 5 S09, S17, S27. |
| host (B) | `date-formatter.ts`, `date-parser.ts`, `internal-path.ts`, `query-string.ts`, `local-storage.ts`, `session.ts`, `verify-session-token.ts` | Reused. `internalPath` guards every `next` and must satisfy every line of the open-redirect rule in §22.2. |

**Public page helper (B).** `lib/ledgerline/money.ts` formats integer minor units as an exact decimal (no float division) with a fixed exponent of 2 (`FRACTION_DIGITS`) in `en-GB`. It must not be used for product money: the fixed exponent breaks BR1 for 0- and 3-decimal currencies. Phase 9 H-24.

### 9.1 Money, time and locale: one owner each

| Concern | Owning module | Rules | Enforced by |
|---|---|---|---|
| Money formatting and arithmetic | `lib/utils/money.ts` (consumed only through C40, C41) | Wire format is a minor-unit integer string plus an ISO 4217 code (BR1). Exponent comes from `Intl` per currency, so 0-decimal and 3-decimal currencies are exact. No `Number`, `parseFloat`, `toFixed`, `Math.*` or `/` on an amount anywhere outside this module. Sign: credit positive, debit negative (BR3). No client rounding: an amount is displayed to its full exponent; where a derived ratio is unavoidable (C41) it is computed in `BigInt` basis points and truncated toward zero, and a server-provided figure is preferred. Pending and posted amounts are never added into one figure; returned and reversed entries keep their own sign and are not netted on the client. | Property tests in `money.test.ts` (round-trip, sign, exponents 0/2/3, 15-digit values); the money-safety lint proposal in §14.1; Q-261 for the public helper. |
| Calendar dates (posting date, statement period, range filters) | `lib/utils/date-parser.ts`, `date-formatter.ts`, `date-range.ts` | A calendar date travels and is stored as `yyyy-MM-dd` (`DATE_VALUE_FORMAT`) and is never passed through `new Date(string)` or shifted by a time zone (Phase 3 §8.4). Ranges are inclusive calendar ranges; a period length is counted in calendar days or months, never as multiples of 24 hours, so a daylight-saving change cannot move a boundary. Month presets end on the month's real last day. | Unit and property tests in `date-range.test.ts` over month-end, leap day and both daylight-saving transitions; lint restriction on `new Date(` with a string argument in `components/` (proposal, §14.1). |
| "Today" and period presets | `date-range.ts`, with the workspace time zone from C63 | "Today", "this month" and every preset are resolved in the **workspace** time zone (S38), not the viewer's, so two members in different countries opening the same preset see the same period (P7-A21); UTC when the workspace has none set; internal `(admin)` sections use UTC. The resolved `from` and `to` are written to the URL, so a shared link names dates, not a preset that would drift. | Property test: the same instant and workspace zone yield the same range for any viewer zone. |
| Instants (notifications, timeline events, "as of", audit entries) | `date-formatter.ts` | ISO 8601 UTC on the wire; member-facing instants are shown in the workspace time zone (UTC when unset) and internal `(admin)` sections in UTC, with the zone stated (Phase 3 §8.4). "As of" is the time the backend reports for the data, never the time the browser received it. | Unit tests with a fixed zone. |
| Locale | `DEFAULT_LOCALE`, `DEFAULT_CURRENCY` in `lib/constants.ts` | One locale in v1 (A6). Locale-dependent formats, all produced by `Intl` and none hand-built: decimal and grouping separators, currency symbol and its position, negative-sign form, date order and month names, week start, plural forms in counts, collation for sorted names. No string concatenation that assumes word order; copy with a count or amount is a function in `lib/data/`, so a second locale changes data, not components. Default currency and locale are an input to OD1, not an answer. | grep gate for `toLocaleString(` and `Intl.` outside `lib/utils/` (proposal, §14.1). |

## 10. Constants

### 10.1 Placement rule

| `lib/constants.ts` | `lib/<feature>/constants.ts` | `lib/data/` | `lib/enums/` |
|---|---|---|---|
| Shared across features: routes, cookie names, durations, query timing, app name, generic error copy | One feature's values: `LEDGER_PAGE_SIZE`, `LEDGER_MAX_PAGES`, `EXPORT_POLL_INTERVAL`, runway bounds; public page constants in `lib/ledgerline/constants.ts` (B) | Static copy and config: nav, admin nav, help articles, empty states, permission matrix, marketing copy | State tuples; range presets |

### 10.2 Additions to `lib/constants.ts`

| Constant | Shape | Why |
|---|---|---|
| `PROTECTED_ROUTE_PREFIXES` | `/onboarding`, `/dashboard`, `/accounts`, `/transactions`, `/counterparties`, `/insights`, `/statements`, `/exports`, `/notifications`, `/messages`, `/settings`, `/payments`, `/admin` | Today only `/dashboard` (H-14). |
| `ADMIN_ROUTE_PREFIX` | `"/admin"` | Proxy role check. |
| Route constants per page (`ONBOARDING_ROUTE`, `DASHBOARD_ROUTE`, …) | strings | No route literals. |
| `PAGE_TITLES` | record keyed by page | S03 and metadata share one source. |
| `APP_ROBOTS` | `{ index: false, follow: false }` | `noindex` once. |
| `WORKSPACE_COOKIE` | string | P7-A4. |
| `COLOUR_SCHEME_COOKIE` | string | Only if C54 is offered. |
| `APP_NAME`, `APP_DESCRIPTION` | strings | Metadata. |
| `MAIN_CONTENT_ID` | string | Skip link. |
| `STALE_TIME` | `{ live, standard, slow, static }` ms | Replaces the literal in C61 (H-23). |
| `ACTIVE_EXPORT_STATES` | tuple | Polling condition. |
| `SESSION_MAX_AGE`, idle timeout | per OD2 | Today 7 days. |
| Section limits | `DASHBOARD_ACCOUNT_LIMIT`, `DASHBOARD_ACTIVITY_LIMIT`, `DASHBOARD_PENDING_LIMIT`, `REVEAL_TIMEOUT`, `SAVED_VIEW_LIMIT`, `SAVED_VIEW_NAME_MAX`, `NOTE_MAX_LENGTH`, `DECISION_NOTE_MIN`, `MESSAGE_MAX_LENGTH`, `SUPPORT_QUERY_MIN`, `SUPPORT_RESULT_LIMIT`, `HELP_ARTICLE_LIMIT`, `EXPORT_MAX_RANGE_DAYS`, `EXPORT_MAX_ROWS`, `EXPORT_ACTIVE_JOB_LIMIT`, `EXPORT_RETENTION_DAYS`, `EXPORT_POLL_MAX_MS`, `DOWNLOAD_LINK_TTL`, `STATEMENT_HISTORY_MONTHS`, `LEDGER_MAX_RANGE_DAYS`, `LEDGER_QUERY_MIN_LENGTH`, `LEDGER_QUERY_MAX_LENGTH`, `LEDGER_ACCOUNT_FILTER_MAX`, `LEDGER_CATEGORY_FILTER_MAX`, `ACCOUNT_LIST_MAX`, `COUNT_EXACT_LIMIT`, `SEARCH_DEBOUNCE_MS`, `BALANCE_STALE_AFTER`, `NOTIFICATION_POLL_INTERVAL`, `NOTIFICATION_RETENTION_DAYS`, `ALERT_RULE_LIMIT`, `TEAM_MEMBER_LIMIT`, `INVITE_PENDING_MAX`, `OWNER_LIMIT`, `DISPLAY_NAME_MAX`, `CASE_CLAIM_MINUTES`, `ADMIN_USERS_CLIENT_LIMIT`, `PAYEE_CHANGE_HOLD_DAYS`, `UPLOAD_MAX_BYTES`, `UPLOAD_MAX_FILES`, `AVATAR_MAX_BYTES`, `UPLOAD_TARGET_TTL`, `HOVER_INTENT_MS`, `LOADING_DELAY_MS`, `TOAST_DURATION_MS` | Phase 5 A12; values in §10.3. |
| Transport and reliability | `BACKEND_TIMEOUT_MS`, `UPLOAD_TIMEOUT_MS`, `REQUEST_TIMEOUT_MS`, `MUTATION_TIMEOUT_MS`, `SEARCH_TIMEOUT_MS`, `SLOW_REQUEST_MS`, `QUERY_RETRY_LIMIT`, `QUERY_RETRY_BASE_MS`, `QUERY_RETRY_MAX_MS`, `GC_TIME_MS`, `REQUEST_ID_HEADER`, `REQUEST_ID_LENGTH`, `IDEMPOTENCY_KEY_HEADER`, `REQUEST_BODY_MAX_BYTES` | §13.6–§13.10; values in §10.3. |
| Session and credentials | `SESSION_IDLE_TIMEOUT`, `SESSION_WARNING_LEAD`, `STEP_UP_GRANT_SECONDS`, `SESSION_CHANNEL`, `RESET_LINK_TTL`, `CHALLENGE_TTL`, `INVITE_TTL_DAYS`, `AUTH_MAX_ATTEMPTS`, `PASSWORD_MIN_LENGTH`, `PASSWORD_MAX_LENGTH` | §22.1, §22.3; OD2 owns the first; values in §10.3. |
| Locale | `DEFAULT_LOCALE`, `DEFAULT_CURRENCY` | §9.1. The locale constant is `DEFAULT_LOCALE` in every phase; no constant is named `LOCALE`. |
| Ledger enumerations | `TRANSACTION_CATEGORIES`, `TRANSACTION_DIRECTIONS` tuples, owned by `lib/enums/` | The ledger filter schema validates `category` and `direction` against them (Phase 3 §11.1). |
| Error classes | `ERROR_KIND` tuple in `lib/enums/`, `ERROR_MESSAGE` record keyed by kind | One message per class (§13.6); no error copy in a component. |

1.0.0's `THEME_CLASS`, `THEME_COLOR` and `THEME_COOKIE` (dark/Daylight) are withdrawn as visual; the working tree has its own `LEDGERLINE_THEME_CLASS` / `LEDGERLINE_THEME_COLOR` for the public page.

### 10.3 Specified values

Phase 5 A12 defers these values to this phase. [Phase 1](phase-1-product-vision.md) BR19 (the limits, expiry and retention table) is the authority for every value below; this phase owns the constant names, and §10.2 with this table is the complete list of them. A value here that differs from BR19 is a defect in this file. Each is the specified value; where the number is a judgement call it is recorded as an assumption so the owner can change it in one place.

| Constant | Value | At the limit | Assumption |
|---|---|---|---|
| `STALE_TIME.live` · `.standard` · `.slow` · `.static` | 15 s · 60 s · 5 min · never stale | — (§21.6) | P7-A9 |
| `GC_TIME_MS` | 5 min after last use; `0` for the account-number reveal | An unobserved entry is dropped; nothing sensitive lingers | P7-A9 |
| `EXPORT_POLL_INTERVAL` · `EXPORT_POLL_MAX_MS` | 5 s · 30 min | After the maximum the job is shown as delayed and the client stops polling; the job continues on the server and the list refreshes on demand or on focus | P7-A9 |
| `NOTIFICATION_POLL_INTERVAL` · `NOTIFICATION_RETENTION_DAYS` | 60 s, paused while the tab is hidden (Q-046) · 90 days | An unread count beyond 99 is shown as "99+"; a notification older than the retention is no longer listed | P7-A9 |
| `BALANCE_STALE_AFTER` | 15 min | A balance older than this, or served from cache after a failed request or while offline, is labelled possibly out of date (§21.6) | P7-A9 |
| `LEDGER_PAGE_SIZE` · `LEDGER_MAX_PAGES` | 50 rows · 10 pages (500 rows held) | Beyond the held window the furthest page is released and fetched again on return; "jump to date" replaces scrolling (§21.4) | P7-A10 |
| `LEDGER_MAX_RANGE_DAYS` | 731 (two years), applied only when both `from` and `to` are given | When both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared (`parseLedgerFilters`), and the member is pointed to an export. With no `from` and no `to` the ledger reads newest first and pages back by cursor without limit (§13.9) | P7-A10 |
| `COUNT_EXACT_LIMIT` | 10,000 | A count is exact up to the limit and reads "10,000+" beyond it (§13.9) | P7-A10 |
| `LEDGER_QUERY_MIN_LENGTH` · `LEDGER_QUERY_MAX_LENGTH` · `SEARCH_DEBOUNCE_MS` | 2 characters · 100 characters · 300 ms | Longer text is cut; a query under 2 characters sends no request to the backend (on-device matches of pages and help may start at 1 character) | P7-A10 |
| `SEARCH_TIMEOUT_MS` | 5 s backend search time limit | A search the backend has not answered in that time fails as `unavailable` with a reference and the member is asked to narrow it; the previous results stay displayed | P7-A11 |
| `LEDGER_CATEGORY_FILTER_MAX` | 20 categories in one `category` filter | A longer list is refused with the limit stated | P7-A10 |
| `LEDGER_ACCOUNT_FILTER_MAX` · `ACCOUNT_LIST_MAX` | 50 account IDs in the `account` filter · 200 accounts in one response | A longer `account` list is refused with the limit stated (Phase 1 BR19); beyond 200 the account list is cursor-paged | P7-A10 |
| `SUPPORT_QUERY_MIN` · `SUPPORT_RESULT_LIMIT` | 3 characters · 50 results | Shorter support queries send no request; beyond 50 the lookup asks for a narrower query | P7-A10 |
| `HELP_ARTICLE_LIMIT` | 200 articles searched on the device | Beyond it help search moves to the server; a build with more articles fails its data test | P7-A10 |
| Command palette (no constant name in BR19) | 5 results per scope · 8 recent entries, cleared on sign-out | A continuation to the full search is offered; the oldest recent entry is dropped | P7-A10 |
| `EXPORT_MAX_RANGE_DAYS` · `EXPORT_MAX_ROWS` · `EXPORT_ACTIVE_JOB_LIMIT` · `EXPORT_RETENTION_DAYS` | 366 days · 5,000,000 rows · 3 active jobs per member · file kept 7 days | Zod field error for the range; a job over the row limit is refused with the limit named; a fourth active job is refused by the backend as `rate_limited`; an expired file offers regeneration | P7-A10 |
| `DOWNLOAD_LINK_TTL` | 5 min, single use, the role re-checked when the link is issued | An expired or used link is requested again (§17) | P7-A18 |
| `STATEMENT_HISTORY_MONTHS` | 84 months | Older periods are not listed; the member is told how far back statements go | P7-A10 |
| `SAVED_VIEW_LIMIT` · `SAVED_VIEW_NAME_MAX` | 50 per member · 60 characters | Creation refused with a message naming the limit; Zod field error for the name | P7-A10 |
| `NOTE_MAX_LENGTH` · `DECISION_NOTE_MIN` · `MESSAGE_MAX_LENGTH` | 2,000 characters · 10 characters · 5,000 characters | Zod field error before sending; a decision reason is 10–2,000 characters | P7-A10 |
| `DASHBOARD_ACCOUNT_LIMIT` · `DASHBOARD_ACTIVITY_LIMIT` · `DASHBOARD_PENDING_LIMIT` | 6 accounts · 8 activity items · 10 pending items | The remainder is reached through P09 and P11 | P7-A10 |
| `TEAM_MEMBER_LIMIT` · `INVITE_PENDING_MAX` | 200 members per workspace · 50 pending invitations | The invitation is refused with the limit named | P7-A10 |
| `OWNER_LIMIT` | 20 beneficial owners in a verification case (not workspace members holding the owner role) | A further beneficial owner is refused with the limit named | P7-A10 |
| `ALERT_RULE_LIMIT` | 20 alert rules per member; rules are per member and only R1 and R2 may have them | A further rule is refused with the limit named | P7-A10 |
| `DISPLAY_NAME_MAX` | 80 characters | Zod field error naming the limit | P7-A10 |
| `CASE_CLAIM_MINUTES` | 30 minutes | A claim on a compliance case lapses and the case returns to the queue | P7-A10 |
| `ADMIN_USERS_CLIENT_LIMIT` | 1,000 platform users handled on the device | Beyond it S49 requires cursor paging and server search (BE-cursor) | P7-A10 |
| `PAYEE_CHANGE_HOLD_DAYS` | 7 days (Deferred with money movement, OD3) | A changed payee detail needs confirmation for 7 days after the change | P7-A10 |
| `REVEAL_TIMEOUT` | 30 s, with a warning 10 s before and an extend action | The number is masked again and removed from memory; also on route change, tab hidden or sign-out | P7-A10 |
| `REQUEST_TIMEOUT_MS` · `MUTATION_TIMEOUT_MS` · `SLOW_REQUEST_MS` | 15 s (browser read) · 30 s (browser write) · 10 s | A read fails as retriable; a write is reported not confirmed and is never re-sent automatically; the slow-request notice appears at 10 s (§13.7) | P7-A11 |
| `HOVER_INTENT_MS` · `LOADING_DELAY_MS` · `TOAST_DURATION_MS` | 150 ms · 200 ms · 6 s (errors stay until dismissed) | — | P7-A10 |
| `BACKEND_TIMEOUT_MS` · `UPLOAD_TIMEOUT_MS` | 10 s · 60 s | The call fails as `unavailable` with a reference (§13.7) | P7-A11 |
| `QUERY_RETRY_LIMIT` · `QUERY_RETRY_BASE_MS` · `QUERY_RETRY_MAX_MS` | 2 · 1 s · 8 s | After the last attempt the section shows C33; writes are never retried | P7-A11 |
| `REQUEST_BODY_MAX_BYTES` · `UPLOAD_MAX_BYTES` · `AVATAR_MAX_BYTES` · `UPLOAD_MAX_FILES` | 16 KB · 10 MB per file (PDF, JPEG or PNG) · 2 MB for an avatar · a record by context: 10 per transaction, 5 per message, 10 per verification document kind and 20 per case | 413; the file is refused before upload starts with the limit named (§17) | P7-A18 |
| `UPLOAD_TARGET_TTL` | 10 min, single use | An expired upload target is requested again before the file is sent (§17) | P7-A18 |
| `REQUEST_ID_LENGTH` | 12 characters | — | P7-A13 |
| `IDEMPOTENCY_KEY_HEADER` | the header name; the backend honours a key for 24 hours | A key older than that is treated as a new request (§13.10) | P7-A12 |
| `SESSION_IDLE_TIMEOUT` · `SESSION_MAX_AGE` · `SESSION_WARNING_LEAD` · `STEP_UP_GRANT_SECONDS` | 15 min · 12 h · 2 min · 5 min (single purpose; a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own grant) | §22.1 | OD2 for the first two; P7-A15 for the rest |
| `AUTH_MAX_ATTEMPTS` | 5 failed sign-in or step-up attempts in 15 min | A 15-minute lock, enforced by the backend (§22.3); the remaining attempts and the wait are stated | P7-A16 |
| `RESET_LINK_TTL` · `CHALLENGE_TTL` · `INVITE_TTL_DAYS` | 30 min, single use · 5 min · 7 days, single use, and a resend invalidates the old link | An expired or used link offers a new one; an expired challenge starts again | P7-A15 |
| `PASSWORD_MIN_LENGTH` · `PASSWORD_MAX_LENGTH` · email length | 8 · 128 · 254 characters | Zod field error naming the limit | P7-A15 |
| `DEFAULT_LOCALE` | one locale in v1 (A6); the value is an input to OD1 | — | A6 |
| `next` parameter · URL length (no constant name in BR19) | 2,048 characters, same-origin path only · a URL over 2,000 characters is refused | §22.2; §9 | P7-A10 |

### 10.4 Environment and configuration

Configuration is read in one place, validated at startup, and a bad value stops the process rather than degrading it.

- **Schema.** `lib/validations/env.ts` declares one Zod schema for server variables and one for `NEXT_PUBLIC_*` variables. `lib/utils/server-env.ts` (`server-only`) and `lib/utils/public-env.ts` each parse once and export the typed result; `lib/constants.ts` takes `API_BASE_URL` from the validated public value. No other file reads `process.env` (§14.1).
- **Startup.** `instrumentation.ts` `register()` imports the validated configuration, so a missing or malformed value throws before the server accepts a request, and the build fails the same way for public values. The message names the variable and the rule it broke and never prints the value.
- **No silent defaults in production.** A development fallback (for example the local backend address) applies only when `NODE_ENV` is not `production`. In production an absent `NEXT_PUBLIC_API_URL`, a non-HTTPS API origin, or a `JWT_PUBLIC_KEY` that does not import as an RS256 public key is a startup failure.

| Variable | Scope | Rule |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | public | Absolute URL; HTTPS in production; also the only extra origin in `connect-src` (§22.2). |
| `JWT_PUBLIC_KEY` | server | PEM or base64 PEM that imports as an RS256 **public** key. No private key or signing secret ever exists in this application. |
| Money-movement switch | server | Boolean, default off; read only on the server (§13.11). Any value other than an explicit "on" is off. |
| Reporting endpoint and key | server, once a service is chosen (§23) | Optional; when absent, reporting is a no-op and the application still starts. |
| `CONTRACT_SOURCE` | tooling | Path to the backend OpenAPI document; the check fails when the file is absent (R-8). |

- **Per environment.** Local, preview and production differ only in values, never in code paths; a preview deployment never points at production data, and `robots` is `noindex` everywhere except production public pages.
- **Documentation.** `.env.example` lists every variable name with no values; a variable added to the schema without an entry there fails the schema's own test.

## 11. Contexts

| Context | Provider | Consumers | Content |
|---|---|---|---|
| WorkspaceContext | C63 | S01, C36, C59, role-branching sections | `{ workspace, role, can, switchWorkspace }` |
| Message context | C62 | any mutation consumer | `show(message)` |

No SessionContext (use `use-me`); no theme context (cookie + class).

## 12. Stores

**None.** Host requires a stated reason for a global store; nothing needs one.

| State | Home |
|---|---|
| Balances, transactions, statements, exports, people | TanStack Query cache |
| Filters, ranges, sort, search, selected tab | URL |
| Overlay open | the intercepted route |
| Form, message and note drafts | component state in the open tab's memory only (LD3 once approved); never `localStorage`, `sessionStorage`, IndexedDB or a service-worker cache; gone when the tab closes or a different user signs in |
| Palette open, dialog open, public-page samples (S58, S59, S63) | owning component state |
| Navigation collapsed, non-financial interface preferences | `use-local-storage` |
| Current workspace + role | C63 |

## 13. API organization

### 13.1 Contract flow

```text
backend DTO (class-validator, @ApiEnvelope(Dto))
  → pnpm openapi (backend)        backend/openapi.json
  → pnpm contract (frontend)      lib/contract/schemas.ts + routes.ts
  → @/lib/contract                Zod schemas, z.infer types, Endpoint<T> builders
  → lib/validations/              .extend / .pick
  → lib/actions/<verb>.ts         backendFetch(routes.x(...)) + readEnvelope
  → lib/hooks/use-<x>.ts          useQuery / useMutation + unwrap
  → components/<feature>/         consume the hook
```

`pnpm contract:check` fails when `lib/contract/` disagrees with the backend document. It must fail, not pass vacuously, when the source document is missing (`CONTRACT_SOURCE`, defaulting to `../backend/openapi.json`) — risk R-8; the CI gate sets the variable explicitly (§14.2).

### 13.2 `Endpoint<T>` typing

`Endpoint<TResponse>` (in `lib/types/api.ts`) is a branded string; `query.get(routes.usersFindOne(id))` resolves to `ApiResponse<UserResponseDto>` without a type argument. Server Actions still parse at runtime.

### 13.3 Transport boundaries

| Module | Runs | Used by | Carries the session |
|---|---|---|---|
| `lib/api-server.ts` `backendFetch` | server | Server Actions, route handlers | yes (`Authorization: Bearer` from the httpOnly cookie) |
| `lib/api-client.ts` `local` | browser | `use-login`, `use-logout`, `use-register` | sets/clears the cookie via same-origin handlers |
| `lib/api-client.ts` `query` | browser | public endpoints only (health) | no |
| `lib/api-routes.ts` | — | same-origin routes: `session`, `register` | — |

### 13.4 Endpoints

Present in `backend/openapi.json` today:

| Endpoint | Contract route | Hook |
|---|---|---|
| POST `/api/auth/register` | `routes.authRegister` | `use-register` via `app/api/register` |
| POST `/api/auth/login` | `routes.authLogin` | `use-login` via `app/api/session` |
| GET `/api/users` | `routes.usersFindAll` | `use-admin-users` |
| POST `/api/users` | `routes.usersCreate` | `use-create-user` |
| GET `/api/users/me` | `routes.usersGetMe` | `use-me` |
| GET/PATCH/DELETE `/api/users/{id}` | `routes.usersFindOne` / `usersUpdate` / `usersRemove` | `use-admin-user` |
| GET `/api/accounts` | `routes.accountsFindAll` | `use-accounts` via `get-accounts.ts` |
| GET `/api/cash-flow` | `routes.cashFlowSeries` | `use-cash-flow` via `get-cash-flow.ts` |
| GET `/api/health` | `routes.healthCheck` | S54 outage variant |
| GET `/api/stats/users/total` · `/series` | `routes.statsUsersTotal` · `statsUsersSeries` | `use-admin-user-total` · `use-admin-user-series` |

The published account states are `OPEN / FROZEN / CLOSED`; how they map to the specification's `active / frozen / closed / pending_verification` is Phase 1 OD11 (default: `active` is `OPEN`, and `pending_verification` is a workspace state, not an account state).

Required from the backend (proposed resources; the account list and the cash-flow series are published above, so those rows name only what is still missing):

| Resource | Operations | Hooks |
|---|---|---|
| Workspaces, memberships, invitations | current, update, list members, member detail, invite, change role, remove | `use-workspace`, `use-update-workspace`, `use-team`, `use-team-member`, `use-invite-member` |
| Accounts | detail, reveal number (step-up); the list with balances is published | `use-accounts`, `use-account`, `use-reveal-account-number` |
| Transactions | cursor list with filters, detail, PATCH annotations, attachments | `use-transactions`, `use-transaction`, `use-update-transaction`, `use-upload-attachment` |
| Ledger summary, cash flow, compare periods | read; the cash-flow series is published | `use-ledger-summary`, `use-cash-flow`, `use-compare-periods` |
| Saved views | list, create, rename, delete | `use-saved-views` |
| Counterparties | detail | `use-counterparty` |
| Statements | list, signed PDF URL | `use-statements` |
| Exports | create job, list, signed download URL | `use-create-export`, `use-exports` |
| Notifications | list, count, mark read | `use-notifications`, `use-mark-notifications-read` |
| Alert rules | list, update | `use-alert-rules`, `use-update-alert-rules` |
| Message threads | list, detail, send | `use-threads`, `use-thread`, `use-send-message` |
| Verification cases | workspace read/update, upload; compliance list, detail, decide | `use-verification-case`, `use-update-verification-case`, `use-upload-document`, `use-compliance-cases`, `use-compliance-case`, `use-decide-case` |
| Auth extensions | sessions, password reset, change password, two-step, step-up | `use-sessions`, `use-request-password-reset`, `use-reset-password`, `use-change-password`, `use-two-step`, `use-verify-challenge`, `use-step-up` |
| Profile | update | `use-update-profile` |
| Support lookup, audit log | read | `use-support-lookup` |
| Transfers, payees | Deferred (OD3) | `use-create-transfer`, `use-payees` |
| Enquiry intake | OD10 | `use-enquiry` |

### 13.5 Known constraint: Server Actions run one at a time

Next.js dispatches Server Actions from one client sequentially. Mitigations: server prefetch for LCP-critical sections; aggregate endpoints for the dashboard; long `staleTime` for slow data. **Revisit trigger:** if Phase 9 measurements show P08 or P10 over the INP or LCP budget, the maintainer decides whether read queries move to same-origin GET handlers in `lib/api-routes.ts` (a host-rule change).

### 13.6 Error taxonomy

Every failure is classified once, by `errorKind` in `lib/utils/action-error.ts`, from the HTTP status and the backend's documented error code. The `ActionResult` failure shape is `{ ok: false, status, message, reference }`; `message` comes from `ERROR_MESSAGE` or the backend's refusal text for field errors, and `reference` is the request reference of §23. `reference` is required on every failure, never optional: a refusal produced before the backend is reached (a Zod refusal in the action, `offline`) carries a reference generated where the refusal happens. Components never branch on a raw status.

| Kind | Raised by | Retried automatically | How it is surfaced | What is kept |
|---|---|---|---|---|
| `validation` | 400, 422; a Zod refusal in the action | No | Field-level messages on the inputs that failed; one summary announced through C62 | All input |
| `unauthenticated` | 401; missing or expired session | Queries: once, after re-authentication | C55 in place (X4); no navigation | URL, cache, drafts |
| `step_up_required` | The backend's step-up marker on a sensitive operation | Reads: once, after a successful step-up. Writes: never — the member re-submits with the same idempotency key | C55 in step-up mode or P06 | The member's input, as a draft in the open tab's memory |
| `forbidden` | 403 | No | For a page or section, the not-permitted empty state (C32) saying which role can do this — never the error state C33; for an action, an explained denial naming who can grant access (C59 explain mode, Q-064); cached entries for the resource removed | Nothing the member may no longer see |
| `not_found` | 404, including a resource in another workspace or outside the member's scope, which answers exactly like a missing one (P34) | No | `notFound()` for the page's own resource; an empty result for a list entry that has gone | — |
| `conflict` | 409: stale version, duplicate name, state already changed by someone else | No | Message naming that the record changed, with the fresh server value loaded and the member's input preserved for a deliberate resubmit | Input |
| `too_large` | 413 | No | The limit is named together with the file or text that exceeded it | Other input |
| `rate_limited` | 429 | Queries: once, after `Retry-After`; mutations never | The wait stated in words from `Retry-After`; the action stays unavailable until it elapses | Input |
| `upstream_invalid` | A response that fails its contract schema (502) | No | C33 with a reference; reported as contract drift with the route name and the schema path that failed, never the payload | Previous data stays displayed with its "as of" time |
| `unavailable` | 502–504, a network failure between the frontend server and the backend, or a timeout | Queries: `QUERY_RETRY_LIMIT` times with backoff (§13.7); mutations never | C33 for the section; S54 when the route itself cannot load; the health check result when the backend reports unavailable (X10). Copy says viewing failed, not that funds changed | Previous data with its "as of" time (Q-069) |
| `offline` | `use-online` reports no connection | Queries pause and resume on reconnect | A persistent offline notice; writes are refused before sending (§13.11) | Cache, drafts |
| `render` | An exception while rendering a section or route | No | C58 → C33 for a section; P35 for a route; `global-error.tsx` as the last resort; the Next.js `digest` is the reference | The rest of the page |

Rules: a mutation whose outcome is unknown (timeout or connection lost after sending) is reported as "not confirmed", the affected lists are invalidated so the member sees the server's truth, and the idempotency key (§13.10) makes a deliberate retry safe. One failure produces one message: C61 de-duplicates by reference so a failed section and its background refetch do not announce twice.

### 13.7 Timeouts, retry and backoff

| Concern | Policy |
|---|---|
| Upstream timeout | `backendFetch` passes `AbortSignal.timeout(BACKEND_TIMEOUT_MS)`; uploads use `UPLOAD_TIMEOUT_MS`. A timeout is `unavailable`, never a hang; no call is left without a deadline. |
| Browser timeout | A read with no answer within `REQUEST_TIMEOUT_MS` (15 s) fails as retriable; a write with no answer within `MUTATION_TIMEOUT_MS` (30 s) is reported not confirmed and is never re-sent automatically. A request still pending at `SLOW_REQUEST_MS` (10 s) says it is taking longer than usual. |
| Query retry | Only `unavailable` is retried, `QUERY_RETRY_LIMIT` times, delay `min(QUERY_RETRY_BASE_MS × 2^attempt, QUERY_RETRY_MAX_MS)` with random jitter so tabs do not retry in step. Every 4xx kind, `upstream_invalid` and `render` fail at once. |
| Mutation retry | `retry: 0`, always (X10). A write is repeated only by the member, with the same idempotency key. |
| Server prefetch | No retry: a failed prefetch renders the section's own error state through the hydrated query instead of failing the route. |
| `rate_limited` | The `Retry-After` value is honoured exactly; the frontend never retries sooner and never loops. |
| Polling | A failed poll counts toward nothing and does not show an error while previous data is displayed; three consecutive failures stop polling and surface `unavailable`. |
| Refetch triggers | Window focus for balances and the notification count only; reconnect for every active query; never on an interval except exports and the notification count. The infinite ledger does not refetch on focus — a refresh restarts from the newest page, because re-reading every held page through sequential Server Actions (§13.5) would block the member. |

### 13.8 Invalidation rules

A mutation writes the returned record into its detail key and invalidates the narrowest list prefix that could contain it. Annotation writes never invalidate balances or totals, because they cannot change money.

| Mutation | Writes | Invalidates |
|---|---|---|
| `update-transaction`, `upload-attachment` | transaction detail | `transactions.lists(workspaceId)` (covers the flagged list) |
| `save-view` (create, rename, delete) | — | saved views |
| `mark-notifications-read` | — | `notifications.all(workspaceId)` (list and count) |
| `create-export` | — | `exports.all(workspaceId)`; polling resumes |
| `update-alert-rules` | alert rules | — |
| `send-message` | thread detail (appended) | thread list |
| `invite-member`, role change, removal | — | team, member detail; when the actor's own role changed, `queryClient.clear()` and `router.refresh()` |
| `update-workspace` | workspace | when the time zone or currency view changed, every workspace-scoped key (presets and totals depend on it) |
| `update-profile` | `me` | — |
| `change-password`, `revoke-session`, `enrol-two-step` | — | sessions, two-step state; revoke-all ends the other sessions, whose tabs meet `unauthenticated` on their next call |
| `update-verification-case`, `upload-document` | verification case | pending items |
| `decide-case` | case detail | case list |
| admin user update or removal | admin user | admin users, admin stats |
| Workspace switch, sign-out, session expiry | — | `queryClient.clear()` in every tab (§8.1) |

Data changed by someone else (a teammate's note, a new transaction from the bank) arrives through `staleTime` expiry, focus refetch for `live` resources, and the "as of" time that discloses how old the displayed value is; v1 has no push channel.

### 13.9 Pagination contract

| Aspect | Contract |
|---|---|
| Request | `cursor` (opaque string or `null` for the newest page) and `limit` (1 to `LEDGER_PAGE_SIZE`; a larger value is refused, not clamped silently). |
| Unbounded query | With no `from` and no `to`, the ledger reads newest first and pages back by cursor without limit; no date range is imposed on it. `LEDGER_MAX_RANGE_DAYS` (731) applies only when both bounds are given: when both bounds are given and span more than 731 days, the request is refused with the limit stated; the bound nearer to today is kept and the other is cleared. |
| Response | `items`, `nextCursor`, `previousCursor` (each `null` at an end), and `asOf`. No unbounded count: at five million rows a full count is a second expensive query, so a count is exact only up to `COUNT_EXACT_LIMIT` (10,000) and is reported as "10,000+" beyond it; money totals come from the summary endpoint (S22). |
| Order | Stable and total: posting date descending, then a unique tiebreak, so no row is skipped or repeated between pages while the ledger receives new entries. |
| Cursor scope | A cursor is valid only for the workspace, account and filter set it was issued for. The frontend never constructs, parses or stores one beyond the query cache, and a cursor never appears in a URL. |
| Invalid or expired cursor | The backend answers with its documented cursor error; the hook resets to the newest page once and tells the member the list was refreshed. |
| Scale edges | Zero rows: empty state distinguishing "nothing yet" from "no match" (Q-062). One page: both cursors `null`. Very large: memory bounded by `LEDGER_PAGE_SIZE × LEDGER_MAX_PAGES`; reaching a distant date uses a `from` filter, never repeated paging. Partial data (the bank feed is behind): the response's `asOf` discloses it. |
| Bounded lists | Team (S39) and platform users (S49) page on the server with the same cursor shape and may return a count (Q-045). |

### 13.10 Idempotency and concurrent edits

- **Idempotency key.** Creation and decision actions send `IDEMPOTENCY_KEY_HEADER` with a `nanoid` generated when the member starts the attempt. The backend honours a key for 24 hours, returns the original outcome for a repeated key and a `conflict` when the same key arrives with a different body. A write interrupted by session expiry or step-up is re-submitted by the member under the key of the interrupted attempt; it is never replayed for them.
- **Version precondition.** A record that more than one person can edit (transaction annotations, saved views, workspace settings, team roles, verification cases, compliance decisions) carries a version in its response; the update action sends it back and the backend refuses a stale write with 409. The member sees what changed and decides again; no edit is silently overwritten. Alert rules are per member (at most `ALERT_RULE_LIMIT`, R1 and R2 only): there is no shared workspace rule and no conflict with a rule someone else saved, so their version guards only the member's own stale tab.
- **Two tabs, one member.** Tabs share nothing but the `BroadcastChannel` signals of §8.1; a write in one tab reaches the other through invalidation on focus, and the version precondition protects against a stale form left open.
- **State already moved.** A decision on a case another analyst has decided, or a mark-read on an entry already read, is answered as `conflict` or as success with the current state — never as a generic failure.

Both mechanisms are backend behaviours the contract must publish (P7-A12).

### 13.11 Degraded service, switches and release safety

| Situation | Behaviour |
|---|---|
| Browser offline | Queries pause (`networkMode: "online"`) and resume on reconnect; cached data stays readable with its "as of" time. Writes are refused before sending with the reason stated — they are not queued, because an annotation or decision replayed minutes later may no longer match what the member was looking at. Drafts stay in component state, in the open tab's memory only; they are never written to browser storage and are gone when the tab closes (§8.1). |
| Backend unreachable or slow | Reads fail as `unavailable` after retries; the health endpoint decides whether the outage variant of S54 is shown. P34, P35, the outage state and public pages render without any backend call. |
| One resource failing | Only that section shows C33 (Q-063); a failed summary never hides the ledger and a failed chart never hides a balance. A page is never blanked by a partial failure, and a figure that depends on the failed resource is shown as unavailable rather than as zero. |
| Unpublished backend module | The hook's action fails closed as `unavailable`; the section shows its error or empty state against the real contract. No frontend sample data stands in (BR11). |
| Feature switch | A switch is a validated server-side value (§10.4), read in the layout, page or action that needs it and passed down as data. It is never a `NEXT_PUBLIC_*` value, never decided in the browser, and off means the route answers `notFound()` and the action refuses — so a switched-off capability such as money movement (OD3) cannot be reached by URL or by calling the action directly. An unreadable switch is off. |
| Contract change | Additive backend changes ship before the frontend that uses them; a field is removed from the backend only after no deployed frontend reads it. `pnpm contract:check` and `pnpm type-check` make an incompatible change fail the gate rather than a member's screen. |
| Release and rollback | Every deployment is an immutable build identified by a release ID that is attached to every report (§23). A release is promoted only after the gate of §14.2 passes on that build; rolling back is re-promoting the previous build and needs no code change. A browser tab still running an older build whose Server Action IDs no longer exist treats the resulting failure as a version mismatch and reloads once, preserving the URL. |

## 14. Component organization

| Layer | Folder | May import | May not import | Contracts |
|---|---|---|---|---|
| Primitives | `components/ui/` | React, `clsx`, Carbon icons, LD1 (installed), LD5 once approved | `@/lib/hooks`, `@/lib/actions`, other component folders | C01–C33 |
| Compositions | `components/common/` | `ui/`, `wrappers/`, hooks, utils, types | feature folders | C34–C55 |
| Wrappers | `components/wrappers/` | `ui/`, motion, Query | feature folders | C56–C60, C68 |
| Providers | `components/providers/` | `ui/`, `wrappers/`, libraries | feature folders | C61–C63 |
| Features | `components/<feature>/` | all of the above, `@/lib/*` | other feature folders, `@/lib/api-client` | S01–S64, C64–C67 (in `ledgerline/`) |

Primitive code standard (host skill): `forwardRef`, explicit `HTMLAttributes` props, `displayName`, variant maps as `Record<Variant, string>`, Carbon icons, no `asChild`.

### 14.1 Lint enforcement (working tree)

| Constraint | Enforced by | Where |
|---|---|---|
| Density register | `starter/application-register-density` | views; off for `(marketing)` and the built public page files |
| One component per file | `starter/one-component-per-file` | `components/**/*.tsx` |
| Pages compose only | `starter/page-composes-only` | `app/**/page.tsx` |
| Shared types in `lib/types/` | `starter/domain-types-in-lib` | views |
| Transport only from hooks | `starter/api-access-boundary` + `no-restricted-imports` | source / views |
| No comments | `starter/no-comments` | everywhere |
| ≤ 150 lines · no `console` · no `any` · no `uuid`/`Date.now()` · `@/` imports | core and flat-config rules | source |

`starter/token-first-classnames` (listed in 1.0.0) was removed by the owner in the working tree. Proposed additions (flat config, no custom rule): restrict `components/ui/**` from hooks/actions/components imports; restrict sibling feature imports per feature folder; and a money-safety rule rejecting `parseFloat`/`Number(` on minor-unit strings in `components/`.

Every other organisation rule in this phase, with the check that holds it. "Proposed" means the check does not exist in `eslint.config.ts` and needs the maintainer's approval; all use flat config or plugins already bundled with `eslint-config-next`, so none adds a dependency.

| Rule | Check | Kind |
|---|---|---|
| `lib/contract/` is generated and never edited | `pnpm contract:check` (regenerate and diff); the folder is ignored by lint so a hand edit cannot be "fixed" into place | exists |
| Type safety across the contract | `pnpm type-check` | exists |
| Layer imports of §14 (primitives import no hooks or actions; features import no sibling feature) | `no-restricted-imports` patterns per folder glob | proposed |
| `lib/` holds no JSX | `no-restricted-syntax` on `JSXElement` for `lib/**` | proposed |
| Query keys only from the factory | `no-restricted-syntax` on an array literal as `queryKey` outside `lib/hooks/query-keys.ts` | proposed |
| Cache timing only from constants (Q-057) | `no-restricted-syntax` on a numeric literal for `staleTime`, `gcTime`, `refetchInterval` | proposed |
| Money only through `lib/utils/money.ts` | `no-restricted-globals` / `no-restricted-syntax` for `parseFloat`, `Number(`, `toFixed`, `toLocaleString` in `components/**` and `app/**`; `no-restricted-imports` of `@/lib/ledgerline/money` outside public-page files (Q-261) | proposed |
| Configuration only through the env modules | `no-restricted-properties` on `process.env` outside `lib/utils/public-env.ts` and `server-env.ts` | proposed |
| Browser storage only through `lib/utils/local-storage.ts` | `no-restricted-globals` for `localStorage`, `sessionStorage`, `indexedDB` elsewhere | proposed |
| Server-only modules stay on the server | `import "server-only"` in `lib/api-server.ts`, `server-env.ts`, `read-envelope.ts`, `session.ts` (`request-id.ts` is not one of them: it is imported on both sides, §9); the build fails when a client file imports one | exists for the built files |
| No raw HTML injection | `react/no-danger` (plugin bundled with `eslint-config-next`) | proposed |
| No route literals, no error copy in components | grep gate on `"/` path literals and on `ERROR_MESSAGE` bypass in `components/**` at the Phase 9 review | review |
| Accessibility in markup | `jsx-a11y` recommended set (plugin bundled with `eslint-config-next`) as errors; `@next/next/no-img-element` | partly exists |
| Design OS IDs never in UI copy | grep gate for `\b[SPCX]\d{2}\b` in `lib/data/**` copy | review |

### 14.2 Verification layers

Each layer has one job; a behaviour is proven at the lowest layer that can prove it. The author of a change owns the tests of the layers the change touches; the maintainer owns the gate and the budgets. Tests are colocated `.test.ts` files (§18) except end-to-end suites.

| Layer | Tool | Covers | Must prove |
|---|---|---|---|
| Static | `tsc`, ESLint, `contract:check` | all source | No contract drift, no rule of §14.1 broken, no `any`. |
| Unit and property | `vitest`, `fast-check` | `lib/utils/*`, `lib/validations/*`, `query-keys.ts` | Money: round-trip, sign, exponents 0/2/3, malformed input returns `null`. Dates: month-end, leap day, daylight-saving, workspace zone. `internalPath`: every off-site form refused (§22.2). Filters: round-trip and limits. Keys: equal inputs give equal keys; workspace ID present in every workspace-scoped key. `errorKind`: every status maps to exactly one kind. |
| Server boundary | `vitest` with a stubbed upstream | `lib/actions/*`, `app/api/*`, `proxy.ts`, `lib/api-server.ts` | Input refused before any upstream call; each upstream status maps to the documented kind; an upstream body is never passed through; a timeout becomes `unavailable`; the token never appears in a response body; cookie attributes (Q-222); guard matrix of §5.7 for signed-out, wrong-role and stale-workspace cases. |
| Tooling | `@typescript-eslint/rule-tester`, in-memory `ts-morph` | `tools/eslint/rules/*`, `tools/codemods/*`, `tools/contract/*` | Each rule and codemod on valid and invalid fixtures (host convention). |
| Component | Testing Library (LD4) | `components/ui`, `common`, `wrappers` | Each Phase 6 contract: its states, keyboard path, focus destination after each action, and what is announced. C57 renders exactly one of loading, error, empty, populated. |
| End-to-end | Playwright (LD4) against a production build and the backend seed | flows F1–F7 and X1–X11 | The flow completes for a permitted role and is refused for a denied one (R1–R7 matrix); a second workspace's data never appears after a switch (Q-044); signed-out sweep of every protected prefix (Q-230); session expiry mid-task keeps the draft (X4); double submission creates one record. |
| Accessibility | `@axe-core/playwright` (LD4) inside the end-to-end run | every page P01–P35 in each data state it can reach | Zero violations at the WCAG 2.2 AA rule tags. Automated checks cover only part of WCAG; keyboard and screen-reader passes stay manual in Phase 9. |
| Performance | Playwright (LD4), §21.9 | the routes of §21.1 | Every lab budget met on the seeded five-million-row account. |
| Security | `curl`/Playwright header assertions, `pnpm audit` | all responses; the lockfile | Headers and CSP of §22.2 present on a public and an authenticated page (Q-235); foreign `Origin` refused (Q-236); no high or critical advisory (Q-241). |

**Gate.** Git hooks are disabled by the host, so CI is the gate (FD12). In order: `pnpm install --frozen-lockfile` → `pnpm type-check` → `pnpm lint` → `pnpm test` → `pnpm contract:check` with `CONTRACT_SOURCE` set and failing when the document is absent (R-8) → `pnpm audit --prod` → `pnpm build` → end-to-end, accessibility and performance suites. Any failing step blocks the merge; a skipped or flaky test is fixed or removed with a recorded reason, never retried until green.

## 15. Shared libraries

Reused, already in `package.json`: `next` 16.2, `react` 19.2, `tailwindcss` v4, `@tanstack/react-query` 5, `zod` 4, `motion` 12, `@carbon/icons-react`, `clsx`, `date-fns` 4, `nanoid`, `jose`, `axios`, `server-only`, `vitest`, `fast-check`, `ts-morph`.

Library decisions (OD8; per the seed's Library Selection Policy — reuse first, recommend, confirm before installing). LD1 is approved and installed, pending the owner confirming where the approval is recorded; LD2–LD5 are pending maintainer approval:

| ID | Need | Recommendation | Why | Contracts |
|---|---|---|---|---|
| LD1 | Charts | `recharts` (alternative `@visx/*`) — installed | Most common React charting library; accessible data tables still hand-built | C30 → S18 S28 S29 S48 (S60 is hand-built SVG today) |
| LD2 | Table + virtualization | `@tanstack/react-table` + `@tanstack/react-virtual` | Same family as Query; headless | C53 → S23 S49 |
| LD3 | Forms | `react-hook-form` + `@hookform/resolvers` | Standard Zod resolver | S10 S11 S31 S35 S38 S40 S42 S43 S44 |
| LD4 | Testing | `@testing-library/react`, `@testing-library/user-event`, `jsdom`, `@playwright/test`, `@axe-core/playwright` | Component, E2E and a11y checks in Phase 9 need a browser | Phase 9 |
| LD5 | Positioning | native `popover` + CSS anchor positioning first; `@floating-ui/react` only if needed | Native first | C19 C20 |

Money formatting uses `Intl.NumberFormat`; no money library.

### 15.1 Dependency and supply-chain policy

| Aspect | Rule |
|---|---|
| Approval | No dependency is added, removed or replaced without the maintainer's approval (seed Library Selection Policy). The request states the need, the existing library that does not cover it, the licence, the maintenance state and the size added to the affected route's budget (§21.1). `package.json` is changed only by `pnpm add`/`pnpm remove`, never by hand. |
| One library per need | A second library for a need already covered (dates, IDs, HTTP, state, validation, icons, motion, charts) is refused; `uuid` is blocked by lint. |
| Pinning | The lockfile is committed and CI installs with `--frozen-lockfile`. `next`, `react`, `react-dom` and `eslint-config-next` are exact versions and move together; other ranges are resolved only by the lockfile, and a lockfile change is reviewed as code. |
| Updates | Security advisories: critical within 2 working days, high within 7 days, the rest in the monthly update. Routine updates are one change per library family with the gate of §14.2 green; a major version is its own change with its migration notes read. A new release is not adopted until it has been public for 7 days, unless it fixes an advisory (P7-A19). |
| Audit | `pnpm audit --prod` in the gate fails on high or critical (Q-241). An advisory that cannot be fixed yet is recorded with its reason, its exposure and a review date. |
| Install scripts | Dependency lifecycle scripts stay blocked by pnpm; an allow-list entry needs the same approval as a dependency. |
| Third-party code at runtime | No script, style, font or frame is loaded from another origin; the CSP of §22.2 enforces it. No analytics, tag manager, chat or session-replay script runs in `(app)` or `(admin)`. A reporting service (§23) is called from the server or through a same-origin path, with the redaction of §23 applied before data leaves. |
| Provenance | Packages come from the public npm registry over the lockfile's integrity hashes only; no Git, tarball or URL dependencies. |

`recharts` is already present in `package.json`: LD1 is recorded as approved and installed, and the owner has still to confirm where that approval is recorded (OD8).

## 16. Design system location

The design system is **not** an npm package. It stays in the repository: host styling files (owned by the host conventions and decided per page at build), primitives in `components/ui/`, and rules in `.claude/skills/` plus `tools/eslint/rules/`. Why: one application; a package adds a build step and a publish loop for one consumer. Revisit when a second application consumes the primitives.

## 17. Asset organization

| Asset | Location | Rule |
|---|---|---|
| Fonts | `public/fonts/font.ts` (`next/font`) | Which families is a build decision (the working tree has chosen its own for the public page). Self-hosted, no layout shift. |
| Icons | `@carbon/icons-react` | Per-icon imports; decorative `aria-hidden`, meaningful icons labelled; no second set. |
| Favicon, app icon, OG image | `app/icon.*`, `app/opengraph-image.tsx` | Next conventions; OG image makes only true claims (Q-142). |
| Wordmark | built as `components/ledgerline/ledger-logo.tsx` (inline SVG path in constants) | — |
| Images | `next/image` always | Explicit size or `fill` in a sized parent; no stock photos of people or invented logos. |
| User uploads | backend storage, signed URLs | never in `public/`. Accepted MIME types, `UPLOAD_MAX_BYTES` and `UPLOAD_MAX_FILES` come from constants; the browser checks them to tell the member early and the backend checks them again as the authority (type by content, not by extension). A refused file names the limit it broke; the other files in the submission are unaffected. An interrupted upload is retried by the member with the same idempotency key. |
| Downloads (statements, exports, attachments) | signed URL requested by a Server Action at the moment of download | The URL expires after `DOWNLOAD_LINK_TTL` (5 minutes), is single use, is issued only after the member's role is re-checked, is never cached, logged, stored or placed in a query key, and answers with `Content-Disposition: attachment` from an origin separate from the application (Q-238). An expired URL is requested again; an export file is kept for `EXPORT_RETENTION_DAYS` (7 days) and an expired export job offers regeneration (Q-068); statements go back `STATEMENT_HISTORY_MONTHS` (84 months). Spreadsheet-formula neutralisation in CSV cells is a backend duty (bank-supplied counterparty text is untrusted). |

## 18. Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Component file | kebab-case matching the export | `transaction-row.tsx` → `TransactionRow` |
| Component export | PascalCase default export | `export default function LedgerTable` |
| Section file | kebab-case of the section name | S23 → `ledger-table.tsx` (1.0.0) or `ledger-entries.tsx` (2.0.0 name) |
| Hook | `use-<resource>.ts` → `use<Resource>` | `use-transactions.ts` |
| Server Action | `<verb>-<resource>.ts` | `update-transaction.ts` |
| Types / validations | `lib/types/<domain>.ts` / `lib/validations/<domain>.ts` (`<name>Schema`) | `ledgerFiltersSchema` |
| Contract | generated names, never renamed | `routes.usersFindOne` |
| Constant | `SCREAMING_SNAKE_CASE` | `LEDGER_PAGE_SIZE` |
| Route segment | kebab-case; dynamic `[camelCaseId]` | `[transactionId]` |
| Query key | factory, resource first, workspace second | `queryKeys.transactions.list(workspaceId, filters)` |
| Test | colocated `.test.ts` | `money.test.ts` |
| Design OS IDs | only in docs, never in UI copy | — |

## 19. Code splitting strategy

| Unit | Mechanism | Why |
|---|---|---|
| Every route | automatic per-route chunks | a viewer on P09 never downloads admin code |
| Route groups | separate layouts | `(marketing)`/`(auth)` ship no shell or C63 |
| C30 Chart (LD1) | `next/dynamic` in a client wrapper, `ssr: false`, C16 fallback | heaviest dependency; S18 is not the LCP element on P08 |
| C38 CommandPalette | `next/dynamic` on first ⌘K and on idle | every shell page carries the trigger |
| P12 overlay | its own route chunk; prefetched on row hover | loaded when a row is opened |
| C49 File upload | `next/dynamic` | only S12, S26, S37 |
| Admin | route-level | internal code never in customer bundles |
| Devtools | development only | — |

## 20. Lazy loading

- Sections on P08 other than S14/S15 stream behind `<Suspense>`.
- Images lazy by default; only a P01 LCP image, if any, is `priority`.
- Infinite lists (S23, S34) load the next page when a sentinel enters the viewport, with C25 as the keyboard equivalent.
- Dialogs and overlays mount content only when open.
- Help articles render on the server from static data.
- Prefetch replaces lazy loading where the next step is predictable (§21.7).

## 21. Performance strategy

### 21.1 Budgets (targets, p75 on a mid-range phone, fast 4G)

| Metric | Budget | Binds |
|---|---|---|
| LCP | < 2.5 s | all; the LCP element on P08 is S14's total, on P10 S20's balance |
| INP | < 200 ms | all; S21 filter change and S23 row open are the risk paths |
| CLS | < 0.1 | all; placeholders reserve space |
| First-load JS (gzip) | `(marketing)`, `(auth)` ≤ 130 KB; `(workspace)`, `(admin)` ≤ 200 KB; lazy chunks excluded | CI once LD4 lands. The built P01 (client islands for motion and samples) is measured against this at the first gate. |
| Ledger page server response | ≤ 300 ms (backend dependency) | S23 |

Per route. LCP, INP and CLS limits above apply to every row; the table adds what differs. JS is first-load, compressed, measured as in §21.9. Backend figures are p95 dependencies the frontend budget assumes.

| Routes | First-load JS | Route-specific budget | Backend dependency (p95) |
|---|---|---|---|
| P01, P28 `(marketing)` | ≤ 130 KB | Help search answers each keystroke within the INP budget from static data | none — renders with the backend down |
| P02–P06 `(auth)` | ≤ 130 KB | Acknowledgement of a submission within the INP budget; outcome within 2 s | sign-in, register, verify ≤ 1 s |
| P07 | ≤ 200 KB | A step's saved state restored on reload without re-entry | case read ≤ 300 ms |
| P08 | ≤ 200 KB; chart chunk lazy | LCP is S14's total; no later section delays it (§21.3) | accounts with balances ≤ 300 ms; cash-flow series ≤ 500 ms |
| P09, P10, P11, P14, P19 | ≤ 200 KB including LD2 | Filter change: acknowledged within the INP budget, results within 1 s; scrolling holds the frame rate of Q-056 at any ledger size; rows held ≤ `LEDGER_PAGE_SIZE × LEDGER_MAX_PAGES` | ledger page ≤ 300 ms for any filter combination on a five-million-row account; summary ≤ 500 ms; free-text search ≤ 1 s |
| P12 | own chunk | Opened from a prefetched row: content within 300 ms; hard load: the LCP budget | detail ≤ 300 ms |
| P15, P16 | ≤ 200 KB; chart chunk lazy | Changing a runway input recalculates within the INP budget with no request | compare ≤ 500 ms |
| P17, P18 | ≤ 200 KB | Creating an export is acknowledged within 1 s regardless of export size; the job itself has no page budget | job creation ≤ 500 ms |
| P20–P25 | ≤ 200 KB | — | list reads ≤ 300 ms |
| P29–P33 `(admin)` | ≤ 200 KB; no admin code in any customer chunk | S49 stays within the INP budget at 10,000 users (Q-045) | user list page ≤ 300 ms |
| P34, P35 | ≤ 130 KB | Render with the backend unreachable | none |
| Any lazy chunk | ≤ 120 KB each | Never fetched on a route that does not use it (Q-052) | — |

Scale edges every budget is measured at: an account with zero transactions, one transaction, a typical month, and the five-million-row seeded account; a workspace with one account and with the largest seeded number of accounts. The budget values are P7-A14.

### 21.2 Server Components by default

Pages, layouts, page titles, placeholders, help articles, static public sections and S41. Client islands: forms, filters, tables, menus, overlays, charts, messages, public-page samples.

### 21.3 Streaming per section

Each data section in its own `<Suspense>`; segment `loading.tsx` covers navigation. A slow S22 never delays S23.

### 21.4 Virtualization for five-million-row ledgers

C53 virtualizes with LD2 using a fixed row size so offsets are computed; only visible rows plus overscan exist; `maxPages` bounds memory; "jump to date" sets `from` instead of scrolling; totals from S22; bulk needs via S31.

### 21.5 Cursor pagination

All unbounded lists use opaque cursors. Offsets skip or duplicate rows on a live ledger — a correctness problem for reconciliation.

### 21.6 `staleTime` policy

| Tier | Resources | Extra |
|---|---|---|
| `live` | accounts and balances, transaction lists, ledger summary, notification count, verification case | `refetchOnWindowFocus` for balances and count |
| `standard` | transaction detail, counterparty, cash flow, compare, threads, compliance cases | invalidated by mutations |
| `slow` | statements, saved views, team, alert rules, sessions, workspace, me, admin stats | invalidated by mutations |
| `static` | `lib/data` config | — |
| polling | exports while active | stops when terminal |

Tier durations are in §10.3: `live` 15 s, `standard` 60 s, `slow` 5 minutes, `static` never, with an entry kept 5 minutes after its last use (`GC_TIME_MS`; 0 for a revealed number). Every balance shows an "as of" time from the response — the time the backend reports for the figure, so a value served from cache, kept after a failed refetch (Q-069) or delayed by the bank feed is disclosed as old rather than presented as current. A `live` resource is never shown from cache for longer than its tier without a refetch being attempted; if that refetch fails, the value stays with its "as of" time and the failure is stated. A balance whose "as of" time is older than `BALANCE_STALE_AFTER` (15 minutes), or that is served from cache after a failure or while offline, is labelled possibly out of date.

### 21.7 Prefetch

Account rows prefetch `use-account` and the first ledger page; transaction rows prefetch `use-transaction` and the overlay route; both after `HOVER_INTENT_MS`, skipped when `saveData` is set.

### 21.8 Other rules

`next/font` with swap and metric fallbacks; charts from summarized series; one memoised `Intl.NumberFormat` per currency and locale; no row animation in tables.

### 21.9 Measurement and what fails

| Aspect | Method |
|---|---|
| Lab run | Playwright (LD4) against a production build (`next build`, `next start`) and the backend seed, signed in as the seeded R1, cold cache. Chrome's "Fast 4G" network preset and 4× CPU slowdown, at 360 CSS px wide (A8) and at one desktop width. Five runs per route; the median is compared with the budget. |
| First-load JS | The sum of compressed script bytes the browser transfers before the route finishes loading on a cold visit — measured in the browser, so the figure is what a member downloads rather than an estimate from build output. |
| INP paths | Scripted interactions: filter change and row open on P10 with the five-million-row account, command palette open, runway input change, export submission. |
| Field | `useReportWebVitals` (§23) reports LCP, INP and CLS with the route template, release ID and connection type; the budget is the p75 per route template over a rolling 7 days. |
| A lab budget is exceeded | The gate fails and the merge is blocked. The budget can be raised only by the maintainer, in the same change, with the reason recorded with the value; there is no per-run override. |
| A lab result worsens by more than 10% but stays within budget | Reported in the gate output as a warning; not a failure. |
| A field p75 is over budget for 7 consecutive days | A severity-2 defect is opened against the route; for P08 or P10 it is also the revisit trigger of §13.5. |
| A backend dependency is over its figure | Recorded against the backend module in Phase 8; the frontend budget is not relaxed to absorb it. |

## 22. Security

| Control | Implementation |
|---|---|
| Session cookie | httpOnly, `secure` in production, `sameSite: "lax"`, `path: "/"`, no `Domain` attribute (host-only). Lifetime per OD2 (recommended 15 min idle + 12 h absolute). Full policy in §22.1. |
| Token verification | `proxy.ts` verifies RS256 with the public key only (`jose`, `JWT_PUBLIC_KEY`); the algorithm is fixed in code and never taken from the token; the payload is parsed by Zod and a token with an unexpected shape is treated as no session. A missing or unimportable key stops the process at startup (§10.4). |
| Route protection | proxy over `PROTECTED_ROUTE_PREFIXES` and `ADMIN_ROUTE_PREFIX`; layouts repeat checks; backend authorizes every call (§5.7). A new route group is added to the prefix list in the same change, and the signed-out sweep (Q-230) fails if one is missed. |
| Admin guard | proxy + `(admin)/layout.tsx` `notFound()`; C59 is never enforcement. |
| Step-up | reveal (C42), password change, two-step changes, revoke-all, and every Deferred money-movement action; actions return a step-up status; C61 opens C55/P06; afterwards a read is refetched and a write is re-submitted by the member — nothing is replayed for them (§8.3). A grant is valid for `STEP_UP_GRANT_SECONDS` (5 minutes) and for the single purpose it was requested for; a grant issued for any other purpose never authorises money movement, and each transfer or payment confirmation asks for its own grant. The grant is held by the backend — the browser holds no proof of it. |
| Masking | last four by default; a full account number may be revealed only by owner, finance and accountant (R1–R3) after step-up — viewers (R4) and every internal role (R5–R7) never; full value fetched on demand, time-limited (`REVEAL_TIMEOUT`), `gcTime: 0`, never written to the cache, a URL, storage, the document title or a report; each reveal is recorded by the backend with actor, account and time. |
| No PII in URLs | opaque IDs only; free-text `q` stays for shareable search with `Referrer-Policy: strict-origin-when-cross-origin` — it is the single recorded exception (Phase 1 OD14) and is never logged or sent to analytics. S64 email never in a URL. Emails, names, account numbers, amounts typed into forms, cursors and signed URLs never enter a path, query string or page title (Q-226). |
| No PII in logs | no `console` (lint); boundaries show a reference only. The never-reported list is in §22.5. |
| Redirect safety | every `next` through `internalPath` (H-16); rule in §22.2. |
| CSRF | Server Actions check Origin; route handlers check `Origin` explicitly and accept JSON only, with `sameSite: "lax"` as the second layer (§22.2). |
| Security headers | `next.config.ts`: HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, CSP `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` (H-17). Exact values in §22.2. |
| CSP scripts | per-request nonce from `proxy.ts` (`nanoid`). Full directive list in §22.2. |
| Shared machines | sign-out and workspace switch clear the cache in every tab; authenticated responses `no-store` (Q-237); nothing from the cache is persisted (§8.1). |
| Untrusted text | Notes, messages, counterparty names and bank-supplied descriptions are rendered as text nodes only; no `dangerouslySetInnerHTML` (§14.1). Help articles are static data rendered as elements, not HTML strings. A link to another origin opens with `rel="noopener noreferrer"`. |

### 22.1 Session and step-up policy

OD2 owns the two lifetimes; the values below are its recommendation expressed as constants, and the rest of the policy holds whatever OD2 answers.

| Aspect | Policy |
|---|---|
| Absolute lifetime | `SESSION_MAX_AGE` (12 h) from sign-in; the cookie's `maxAge` equals it and the backend refuses the token after it regardless of activity. |
| Idle timeout | `SESSION_IDLE_TIMEOUT` (15 min) without member activity, enforced by the backend's token lifetime — the browser timer only predicts it. |
| What counts as activity | A request the member caused (navigation, a query from an interaction, a mutation). Polling, focus refetch and background refetch do **not** extend the session; otherwise an open exports page would keep a session alive on an unattended machine. |
| Warning | C55 warns `SESSION_WARNING_LEAD` (2 min) before idle expiry and offers an extension, repeatable up to the absolute limit (WCAG 2.2.1). At the absolute limit there is no extension: the member re-authenticates in place. |
| Expiry mid-task | Any call that meets 401 opens C55 instead of navigating; the URL, cache and drafts are kept; queries refetch after re-authentication and the member resubmits a pending write (§8.3). A different user signing in on the same tab clears the cache before anything renders. |
| Other tabs | Expiry, extension, sign-out and workspace switch are broadcast on `SESSION_CHANNEL`; every tab follows within one event. |
| Different user | When re-authentication in place is completed by a different user than the one who held the page, the cache, drafts and revealed values are discarded and that user's default destination loads. |
| Sign-out | Invalidates the session on the backend (Q-229), deletes the cookie, clears the cache and storage namespaces, and broadcasts. Revoke-all (S43) ends every other session; those tabs meet 401 on their next call. |
| Cookie name | `SESSION_COOKIE`; in production it carries the `__Host-` prefix, which browsers accept only with `Secure`, `Path=/` and no `Domain` (P7-A15). |
| Step-up | Required for the operations in the table above. `STEP_UP_GRANT_SECONDS` (5 min), bound to the session and a single purpose. A grant issued for any other purpose never authorises money movement; each transfer or payment confirmation asks for its own grant. Failure limits and lockout are in §22.3. |
| Workspace cookie | `WORKSPACE_COOKIE` is httpOnly, same attributes, holds an opaque workspace ID only, and is a preference the backend re-checks on every call (§5.7). |

### 22.2 CSRF, redirects, headers and Content-Security-Policy

**CSRF.** Server Actions accept POST only and Next.js compares `Origin` with the host; `serverActions.allowedOrigins` stays empty, so no other origin can invoke one. Route handlers that change state compare `Origin` with the deployment origin and accept `application/json` only — a content type a cross-site form cannot send (Q-236). No GET handler and no render path changes state. `sameSite: "lax"` is the second layer, not the control.

**Open-redirect rule.** A `next` value is followed only when all of these hold; otherwise the destination is `DASHBOARD_ROUTE` (Q-233, Q-234):

- it begins with exactly one `/` and the second character is neither `/` nor `\` — so `//host` and `/\host` are both refused;
- percent-decoded until it no longer changes (at most three passes; a value still changing after that, or one that does not decode, is refused), it still satisfies the line above, so the encoded forms `/%2Fhost`, `/%5Chost`, `%2F%2Fhost` and their double-encoded forms are refused;
- raw or decoded, it contains no control character (tab, newline, carriage return, null or any other character below U+0020, and U+007F) and no backslash anywhere;
- resolved against the deployment origin with `new URL`, the result has that same origin, so only a same-origin path is ever followed;
- it is at most 2,048 characters, measured before decoding;
- it does not point into `AUTH_ROUTE_PREFIX` or `/api`.

`proxy.ts` writes `next` from the request's path and query, so a member who was signed out while filtering a ledger returns to the same filtered view.

**Response headers** (static ones in `next.config.ts` `headers()`, the CSP in `proxy.ts` because it carries the nonce; `poweredByHeader` is off):

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` (production only; `preload` is a maintainer decision because it is hard to undo) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()` |
| `X-Frame-Options` | `DENY` (for browsers that ignore `frame-ancestors`) |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `Cache-Control` | `no-store` on every response under a protected prefix and on every route handler |

**Content-Security-Policy** (one policy for every route, P7-A17):

| Directive | Value | Why |
|---|---|---|
| `default-src` | `'self'` | Deny by default. |
| `script-src` | `'self' 'nonce-<per request>' 'strict-dynamic'`; `'unsafe-eval'` only when `NODE_ENV` is `development` | No inline or third-party script runs without the nonce. |
| `style-src` | `'self' 'nonce-<per request>'` | Framework-injected style elements carry the nonce. |
| `style-src-attr` | `'unsafe-inline'` | `motion` writes inline style attributes; attributes cannot execute script. |
| `img-src` | `'self' data: blob:` plus the attachment storage origin | Previews of the member's own uploads. |
| `font-src` | `'self'` | Fonts are self-hosted (§17). |
| `connect-src` | `'self'` plus the origin of `NEXT_PUBLIC_API_URL` | Q-235. A reporting origin is added only if the chosen service cannot be reached through the server. |
| `frame-src`, `object-src`, `frame-ancestors` | `'none'` | No embedding in either direction; statements open as downloads, not frames. |
| `base-uri`, `form-action` | `'self'` | No base-tag or form hijack. |
| `upgrade-insecure-requests` | present in production | — |
| `report-to` | the reporting path of §23 once a service is chosen | Violations are counted, with the blocked URI's query removed. |

Cost, stated so it is a decision and not a surprise: a per-request nonce makes every route render dynamically, including P01 and P28. If P01 misses its LCP budget for that reason, the maintainer may give `(marketing)` a static hash-based policy instead; `(auth)`, `(app)` and `(admin)` keep the nonce.

### 22.3 Throttling and lockout (backend expectations)

The frontend enforces none of these; it must behave correctly when the backend applies them. Every limit answers 429 with `Retry-After`, which the frontend states in words and never retries ahead of (§13.6). The values are the specified expectation, recorded as P7-A16 for the owner to change.

| Operation | Limit | When reached |
|---|---|---|
| Sign-in | 5 failed attempts (`AUTH_MAX_ATTEMPTS`) per account in 15 min; 20 attempts per address per minute | The account is locked for 15 min; the response is the same for a real and an unknown account (Q-239); the member is told the wait and offered X5. A locked account is not unlocked by a correct password during the wait. |
| Two-step or step-up code | 5 failed attempts in 15 min; a challenge lasts `CHALLENGE_TTL` (5 min) | Step-up is locked for 15 min and the sensitive value stays masked (X4); an expired challenge is void and a new one is required. Remaining attempts are stated. |
| Password reset request | 3 per account per hour | Same confirmation text every time, whether or not anything was sent. |
| Registration | 5 per address per hour | Stated wait. |
| Account-number reveal | 10 per member per hour | Refused with the wait; each success is audit-logged. |
| Export creation | 10 per workspace per hour; `EXPORT_ACTIVE_JOB_LIMIT` (3) active per member | Refused with the limit named; existing jobs unaffected. |
| Invitations | 20 per workspace per day | Refused with the limit named. |
| Messages | 30 per member per hour | Draft kept. |
| Any authenticated call | 600 per session per minute | `rate_limited`; reads resume after the wait. |
| Support lookup (S53) | 60 per platform user per minute, every lookup audit-logged | Refused with the wait. |

### 22.4 Tenant isolation

| Layer | Rule | Check |
|---|---|---|
| Authority | The backend scopes every query by the caller's workspace and answers 404 for another workspace's resource. The frontend never sends a workspace ID as proof. Inside a workspace the backend also scopes by owner where a record is personal: a member sees their own export jobs, and R1 and R2 also see every job in the workspace (R3 only their own); a support thread belongs to the member who opened it and is readable by that member and the workspace's owners (R1), not by other R2–R3 members; alert rules are per member. A record outside the caller's scope answers like a missing one. | End-to-end: a seeded member of workspace A requests workspace B's account, transaction, export and statement IDs and receives P34 (§14.2). |
| Browser cache | Workspace ID in every workspace-scoped key, `clear()` on switch and sign-out, memory only, broadcast to every tab (§8.1). | Unit test on the key factory; Q-044. |
| Server render | `getQueryClient()` is per request (React `cache()`); `backendFetch` uses `cache: "no-store"`; no `"use cache"`, `unstable_cache`, `revalidate` or static generation for anything under a protected prefix; no module-level variable holds member data. | Review gate; `no-restricted-syntax` on `"use cache"` and `unstable_cache` under `app/(app)` and `app/(admin)` (proposed). |
| Browser storage | Keys namespaced by user and workspace; removed on sign-out; holds only non-financial interface preferences and never balances, transactions, tokens or message, note or form drafts (Q-223). | Review of `use-local-storage` consumers. |
| Downloads | Signed URLs are bound to the requesting member and expire (§17). | Q-238. |
| Platform roles | R5–R7 read customer data only through the platform endpoints, each read audit-logged with actor, target and time; a platform user has no workspace context (C63 is not mounted in `(admin)`) and can never reveal a full account number. | Backend audit entry per lookup. |

### 22.5 Secrets and what is never recorded

- **Secrets.** The frontend holds no signing key, no backend credential and no third-party secret in the browser bundle. Only `NEXT_PUBLIC_*` values reach the browser and none of them is secret. Server values live in the deployment platform's secret store, never in the repository; `.env*` files are git-ignored and `.env.example` carries names only. The access token exists only in the httpOnly cookie and in server memory for the duration of a request. Key rotation: the backend publishes the new public key before signing with it, and verification accepts the current and the previous key during the overlap.
- **Never written to a log, report, analytics event, error message, URL or document title:** passwords and one-time codes; session tokens, cookies and `Authorization` values; full account numbers; signed URLs and cursors; request and response bodies; amounts and balances; free-text search terms; note, message and document contents; names, email addresses and business legal names; the text of a Zod issue that echoes input.
- **May be recorded:** the reference, the error kind and status, the route template (`/accounts/[accountId]`, not the concrete path), the Server Action or contract route name, duration, release ID, the role kind, and opaque user and workspace IDs.
- **Sensitive actions the backend records** (actor, workspace, target, time, outcome): sign-in and sign-out, failed sign-in and lockout, step-up, account-number reveal, statement and export download, export creation, role change, invitation, removal, session revocation, two-step change, password change, verification submission and decision, platform user change, support lookup. The frontend's duty is that each of these goes through a Server Action that reaches the backend — none can complete in the browser alone — so an entry always exists. Who may read the record is the backend's rule (Phase 1 OD12 default), surfaced through S53: R7 reads all; R6 reads case history; R5 reads only the entries tied to a reference a member quoted; workspace members read none in v1 but may ask support for entries about their own workspace.

## 23. Observability

- Section errors render C33 with the `digest` as a reference that S53 can look up; route failures render S54; offline shows a persistent notice.
- Logging belongs in services: no `console`. Frontend server errors may be forwarded by `instrumentation.ts` `onRequestError` to a service the maintainer chooses (a new dependency under the approval rule).
- Web Vitals via `useReportWebVitals` to the same service once chosen; until then Phase 9 measures in the lab.

**The reference a member can quote.** Every failure a member sees carries one short reference, and the same value is what support searches for.

| Failure | Reference | Created | Reaches the member through | Lets support find |
|---|---|---|---|---|
| A call to the backend failed (any kind in §13.6 except `offline`, `render`) | request reference: `REQUEST_ID_LENGTH` characters from an alphabet without look-alike characters | by `backendFetch`, once per upstream call, sent as `REQUEST_ID_HEADER` | `ActionResult.reference` → `ActionError.reference` → C33 `reference` or the C62 message | the backend's log line for that exact call, with its route, status, actor and workspace |
| A render or route error | the Next.js `digest` | by the framework | C33 (section), P35 (route), `global-error.tsx` | the server error forwarded by `onRequestError` |
| A route handler refusal | request reference | by the handler through `backendFetch` | the `{ message, reference }` body | as the first row |
| A refusal before any upstream call (a Zod refusal in an action, `offline`) | a reference from the same generator, made where the refusal happens (on the device for `offline`) | by the action, or by the hook's offline guard | C33 `reference` or the C62 message | that no upstream call exists for it, and the client report that carries the same reference |

No error state is shown without a reference: C33 requires one for its retryable, non-retryable and offline kinds alike.

The reference is safe to read aloud, paste into a message and show on screen: it identifies a request, not a person, and carries no data. It is displayed as selectable text with a copy action (C51) and included in a support message started from an error state. The backend must log `REQUEST_ID_HEADER` on every request and echo it as the same response header (P7-A13).

**What is reported, and from where.**

| Signal | Source | Fields | Never included |
|---|---|---|---|
| Server error | `instrumentation.ts` `onRequestError` | digest, route template, render source, release ID, error name and stack | request body, cookies, headers, search parameters |
| Classified call failure | `QueryCache.onError`, `MutationCache.onError` in C61 | kind, status, reference, action name, route template, release ID, attempt count | arguments, results, messages typed by members |
| Client render error | C58, `app/error.tsx`, `global-error.tsx` | digest or error name, component stack, route template, release ID | props, state, DOM text |
| Contract drift (`upstream_invalid`) | `read-envelope.ts` | contract route name, schema path that failed, reference | the payload |
| Web Vitals | `useReportWebVitals` | metric, value, rating, route template, release ID, connection type | URL, IDs |
| CSP violation | `report-to` | directive, blocked origin, route template | the blocked URL's query and fragment |
| Startup misconfiguration | `instrumentation.ts` `register()` | variable name, rule broken | the value |

Rules:

- **Redaction is applied before sending, in one module** (`lib/utils/report.ts`, `server-only` for the server path): an allow-list of fields, not a block-list, so a new field is not sent until it is added. The never-recorded list of §22.5 binds every row above.
- **Reporting is not analytics.** No page-view, click or behavioural tracking exists in `(app)` or `(admin)`; nothing in this section identifies what a member looked at beyond the route template of a failure.
- **Reporting never breaks the product.** With no service configured, every report is a no-op; a failed report is dropped, never retried in a loop, never surfaced to the member, and never delays a response.
- **Sampling.** Errors are sent unsampled, de-duplicated by reference; Web Vitals may be sampled, and the sample rate is a constant.
- **Audit of sensitive views** is the backend's record (§22.5), not a frontend log: the frontend's observable duty is that a reveal, download, export, decision or lookup cannot succeed without the backend call that writes the entry.
- **Health.** `GET /api/health` is read only when a call has already failed as `unavailable`, to choose between a section error and the outage state (X10); it is not polled.
- **What support can establish from a reference alone:** which call, which release, which role kind and workspace, when, the status and kind, and — for contract drift — which field. Never the member's data.

## 24. Code templates

All templates are comment-free, `any`-free, cast-free, `@/` imports, and carry no styling. Contract names for unpublished modules are proposals (P7-A5).

### 24.1 Page template

See [Phase 4 › Reference page](phase-4-page-blueprints.md#reference-page) (P10).

### 24.2 Layout with session guard — `app/(app)/(workspace)/layout.tsx`

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AppShell from "@/components/shell/app-shell";
import SessionExpiryDialog from "@/components/common/session-expiry-dialog";
import WorkspaceProvider from "@/components/providers/workspace-provider";
import { getCurrentWorkspace } from "@/lib/actions/get-current-workspace";
import { APP_ROBOTS, ONBOARDING_ROUTE } from "@/lib/constants";
import { unwrap } from "@/lib/utils/unwrap";

export const metadata: Metadata = { robots: APP_ROBOTS };

interface WorkspaceLayoutProps {
    children: ReactNode;
    drawer: ReactNode;
}

export default async function WorkspaceLayout({ children, drawer }: WorkspaceLayoutProps) {
    const workspace = unwrap(await getCurrentWorkspace());
    if (!workspace) redirect(ONBOARDING_ROUTE);

    return (
        <WorkspaceProvider value={workspace}>
            <AppShell>{children}</AppShell>
            {drawer}
            <SessionExpiryDialog />
        </WorkspaceProvider>
    );
}
```

`AppShell` composes S01, S02 and `<main id={MAIN_CONTENT_ID}>`; it is not a section.

### 24.3 Query-key factory — `lib/hooks/query-keys.ts`

```ts
import type { LedgerFilters, PeriodRange } from "@/lib/types";

export const queryKeys = {
    me: () => ["me"],
    workspaces: () => ["workspaces"],
    accounts: {
        all: (workspaceId: string) => ["accounts", workspaceId],
        detail: (workspaceId: string, accountId: string) => ["accounts", workspaceId, accountId],
        summary: (workspaceId: string, accountId: string, range: PeriodRange) => [
            "accounts",
            workspaceId,
            accountId,
            "summary",
            range,
        ],
    },
    transactions: {
        all: (workspaceId: string) => ["transactions", workspaceId],
        lists: (workspaceId: string) => ["transactions", workspaceId, "list"],
        list: (workspaceId: string, filters: LedgerFilters) => ["transactions", workspaceId, "list", filters],
        detail: (workspaceId: string, transactionId: string) => [
            "transactions",
            workspaceId,
            "detail",
            transactionId,
        ],
    },
    exports: { all: (workspaceId: string) => ["exports", workspaceId] },
    statements: { all: (workspaceId: string) => ["statements", workspaceId] },
    notifications: {
        all: (workspaceId: string) => ["notifications", workspaceId],
        count: (workspaceId: string) => ["notifications", workspaceId, "count"],
    },
    admin: {
        users: () => ["admin", "users"],
        user: (userId: string) => ["admin", "users", userId],
    },
};
```

### 24.4 Hook template — `lib/hooks/use-transactions.ts`

```ts
import { useInfiniteQuery, type InfiniteData, type QueryKey } from "@tanstack/react-query";
import { listTransactions } from "@/lib/actions/list-transactions";
import type { TransactionPageDto } from "@/lib/contract/schemas";
import { queryKeys } from "@/lib/hooks/query-keys";
import { STALE_TIME } from "@/lib/constants";
import { LEDGER_MAX_PAGES } from "@/lib/ledger/constants";
import type { Cursor, LedgerFilters } from "@/lib/types";
import { unwrap } from "@/lib/utils/unwrap";

export const useTransactions = (workspaceId: string, filters: LedgerFilters) =>
    useInfiniteQuery<TransactionPageDto, Error, InfiniteData<TransactionPageDto, Cursor>, QueryKey, Cursor>({
        queryKey: queryKeys.transactions.list(workspaceId, filters),
        queryFn: async ({ pageParam }) => unwrap(await listTransactions({ ...filters, cursor: pageParam })),
        initialPageParam: null,
        getNextPageParam: (page) => page.nextCursor,
        getPreviousPageParam: (page) => page.previousCursor,
        maxPages: LEDGER_MAX_PAGES,
        staleTime: STALE_TIME.live,
    });
```

### 24.5 Server Action + hook pair

```ts
import type { ActionResult } from "@/lib/types/api";
import { ActionError } from "@/lib/utils/action-error";

export const unwrap = <TData>(result: ActionResult<TData>): TData => {
    if (!result.ok) throw new ActionError(result.status, result.message, result.reference);
    return result.data;
};
```

`ActionResult`'s failure branch is `{ ok: false; status: number; message: string; reference: string }` in `lib/types/api.ts` — `reference` is required, so a failure with nothing to quote does not type-check; `ActionError` derives `kind` from the status with `errorKind` (§13.6).

```ts
import "server-only";
import { z } from "zod";
import { readJson } from "@/lib/api-server";
import { REQUEST_FAILED, REQUEST_ID_HEADER } from "@/lib/constants";
import { apiEnvelopeDtoSchema } from "@/lib/contract/schemas";
import type { ActionResult } from "@/lib/types/api";
import { refusalMessage } from "@/lib/utils/refusal-message";
import { requestId } from "@/lib/utils/request-id";

const envelopeSchema = apiEnvelopeDtoSchema.extend({ data: z.unknown() });

export const readEnvelope = async <TSchema extends z.ZodType>(
    upstream: Response,
    schema: TSchema,
): Promise<ActionResult<z.output<TSchema>>> => {
    const body = await readJson(upstream);
    const reference = upstream.headers.get(REQUEST_ID_HEADER) ?? requestId();
    if (!upstream.ok) return { ok: false, status: upstream.status, message: refusalMessage(body), reference };
    const envelope = envelopeSchema.safeParse(body);
    const payload = schema.safeParse(envelope.success ? envelope.data.data : undefined);
    return payload.success
        ? { ok: true, data: payload.data }
        : { ok: false, status: 502, message: REQUEST_FAILED, reference };
};
```

An upstream call that never produced a response (connection refused, `BACKEND_TIMEOUT_MS` elapsed) is caught by the action and returned as status 503 with the reference `backendFetch` generated for it, so even a call the backend never saw is quotable. The same holds for a refusal made before any upstream call: the validation branch of the action below and the hook's offline guard each attach a reference from the same generator (§23), and a response that arrives without `REQUEST_ID_HEADER` is given one rather than returned without.

```ts
"use server";
import { backendFetch } from "@/lib/api-server";
import { INVALID_REQUEST } from "@/lib/constants";
import { routes } from "@/lib/contract/routes";
import {
    transactionResponseDtoSchema,
    updateTransactionDtoSchema,
    type TransactionResponseDto,
    type UpdateTransactionDto,
} from "@/lib/contract/schemas";
import type { ActionResult } from "@/lib/types/api";
import { readEnvelope } from "@/lib/utils/read-envelope";
import { requestId } from "@/lib/utils/request-id";

export const updateTransaction = async (
    transactionId: string,
    input: UpdateTransactionDto,
): Promise<ActionResult<TransactionResponseDto>> => {
    const parsed = updateTransactionDtoSchema.safeParse(input);
    if (!parsed.success) return { ok: false, status: 400, message: INVALID_REQUEST, reference: requestId() };
    const upstream = await backendFetch(routes.transactionsUpdate(transactionId), {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
    });
    return readEnvelope(upstream, transactionResponseDtoSchema);
};
```

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "@/lib/actions/update-transaction";
import type { UpdateTransactionDto } from "@/lib/contract/schemas";
import { queryKeys } from "@/lib/hooks/query-keys";
import { unwrap } from "@/lib/utils/unwrap";

export const useUpdateTransaction = (workspaceId: string, transactionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (input: UpdateTransactionDto) => unwrap(await updateTransaction(transactionId, input)),
        onSuccess: (transaction) => {
            queryClient.setQueryData(queryKeys.transactions.detail(workspaceId, transactionId), transaction);
            return queryClient.invalidateQueries({ queryKey: queryKeys.transactions.lists(workspaceId) });
        },
    });
};
```

The action re-validates input because a Server Action is a public POST endpoint. For the same reason it never accepts a workspace ID, a role or a user ID as an argument: those come from the server-side session and cookie, and the backend checks them again (§5.7).

## 25. Open decisions touched by this phase

| ID | Decision | Effect here | Cost of reversal |
|---|---|---|---|
| OD2 | Session policy | `SESSION_MAX_AGE`, `SESSION_IDLE_TIMEOUT`, idle handling in C55, step-up windows; the rest of §22.1 holds for any answer | Low in code |
| OD3 | Money movement | `payments/` folder; P26/P27 `notFound()` while off | High |
| OD4 | Feature folders | every section path in §7; `components/ledgerline/` already exists | Low now, rising |
| OD8 | LD1–LD5 (LD1 approved and installed; where its approval is recorded is to be confirmed) | C30, C53, forms, tests, C19/C20 | Contained behind C30/C53 |
| OD11 | Account lifecycle mapping to the backend's `OPEN / FROZEN / CLOSED` | the status map consumed by C12 and `use-accounts` (§13.4) | Low: one map |
| OD14 | Free-text `q` in the URL | `ledger-params.ts`, the "No PII in URLs" control (§22), the never-recorded list (§22.5) | Medium: shared links change shape |
| OD9 | Public page scope | whether S57–S62 survive as production content; type-name collision in `lib/types/ledgerline.ts` | High once customers rely on either side |
| OD10 | Entry path | whether `use-enquiry` and an intake route exist; whether P01 links to P02/P03 | Medium |

## 26. Assumptions

Spine assumptions used: A2, A3, A4, A5, A6, A8, A9, A10. Added by this phase:

- **P7-A1** Nested route group `(app)/(workspace)` separates onboarding from workspace pages; URLs unchanged.
- **P7-A2** The backend returns short-lived signed URLs for statements and exports.
- **P7-A3** Hooks `use-step-up`, `use-mark-notifications-read`, `use-reveal-account-number`, `use-local-storage` exist beyond the 1.0.0 spine list; `use-enquiry` depends on OD10.
- **P7-A4** The current workspace is remembered in an httpOnly `WORKSPACE_COOKIE`.
- **P7-A5** Contract names in templates are proposals until generated.
- **P7-A6** New helpers sit in host-sanctioned locations (`lib/utils/`, `lib/<feature>/constants.ts`).
- **P7-A7** *Withdrawn in 2.0.0 (the twelve named layout classes — visual).*
- **P7-A8** Performance budgets are targets; Phase 9 turns them into checks.
- **P7-A9** Cache timing: `STALE_TIME` tiers of `live` 15 s, `standard` 60 s, `slow` 5 min and `static` never; `GC_TIME_MS` 5 min after last use (0 for a revealed number); export polling every 5 s, shown as delayed and stopped at 30 min; notification count every 60 s with 90-day retention; a balance labelled possibly out of date after 15 min (§10.3). Owner: maintainer.
- **P7-A10** Section limits in §10.3 (page size 50, 10 pages held, ledger range 731 days when both bounds are given and unbounded cursor paging otherwise, ledger search of 2–100 characters, 50 IDs in the account filter, 200 accounts per response, exact count to 10,000, export range 366 days, 5,000,000 rows, 3 active jobs per member and 7-day retention, 84 months of statements, 50 saved views with 60-character names, 2,000-character notes, 10–2,000-character decision reasons, 5,000-character messages, dashboard caps of 6 accounts, 8 activity items and 10 pending items, 200 members and 50 pending invitations per workspace, 20 beneficial owners per verification case, 20 alert rules per member, 80-character display names, a 30-minute case claim, 1,000 platform users handled on the device, a 7-day payee-change hold, 200 help articles, 50 support results, reveal 30 s, search and timing values). Owner: maintainer; the backend must enforce the same numbers, and Phase 1 BR19 is the authority for each.
- **P7-A11** Reliability values: 10 s upstream timeout, 60 s for uploads, 15 s browser read and 30 s browser write timeouts, a slow-request notice at 10 s, a 5 s backend search time limit, two query retries with 1 s–8 s backoff, no mutation retry (§13.7). Owner: maintainer.
- **P7-A12** The backend publishes cursor pagination in the shape of §13.9, an idempotency key honoured for 24 hours on creation and decision operations, a version precondition on shared records with 409 on a stale write, and a documented marker for step-up (§13.6, §13.10). Owner: backend maintainer.
- **P7-A13** The request reference is generated by the frontend server (12 characters), sent as `REQUEST_ID_HEADER`, logged by the backend on every request and echoed as the same response header (§23). Owner: backend maintainer.
- **P7-A14** Per-route budgets, the 120 KB lazy-chunk ceiling, the lab profile and the 7-day field window in §21.1 and §21.9. Owner: maintainer.
- **P7-A15** Session details beyond OD2: a 2-minute warning lead, a 5-minute single-purpose step-up grant (a grant for another purpose never authorises money movement; each transfer or payment confirmation asks for its own), a 30-minute single-use reset link, a 5-minute two-step challenge, a 7-day single-use invitation, passwords of 8–128 characters, background requests not counting as activity, and the `__Host-` cookie prefix in production (§22.1). Owner: maintainer, with OD2.
- **P7-A16** Backend throttling and lockout values in §22.3 (sign-in and step-up: 5 failures in 15 minutes, then a 15-minute lock). Owner: backend maintainer; they are product decisions, not claims about any regulation.
- **P7-A17** One nonce-based Content-Security-Policy for every route, accepting dynamic rendering of P01 and P28, with the stated fallback for `(marketing)` (§22.2). Owner: maintainer.
- **P7-A18** Upload limits of 10 MB per file (an avatar 2 MB) and 10 files per transaction, 5 per message, 10 per verification document kind and 20 per case; a single-use upload target lasting 10 minutes; a 16 KB JSON body limit; and single-use signed download URLs that expire after 5 minutes (§10.3, §17). Owner: maintainer, with the backend.
- **P7-A19** Dependency policy numbers: advisory windows of 2 working days (critical) and 7 days (high), and a 7-day release cooldown (§15.1). Owner: maintainer.
- **P7-A20** Configuration is validated by `lib/validations/env.ts` through `lib/utils/public-env.ts` and `lib/utils/server-env.ts`, and reporting passes through `lib/utils/report.ts`; the reporting service itself is not chosen and remains a dependency request under §15.1. Owner: maintainer.
- **P7-A21** "Today" and period presets resolve in the workspace time zone set in S38; a workspace with no time zone set uses UTC until one is chosen, and the zone in use is stated wherever a preset is offered; internal `(admin)` sections use UTC; posting dates are never shifted (§9.1). Owner: maintainer.

## 27. Changes in this version

- **Retained:** principles, folder structure, route structure (with `(workspace)`), route handlers, layouts, providers, feature folders, section anatomy, hooks (inventory, query keys, patterns), utilities, constants placement, contexts, stores, API organization, component layers, lint map, shared libraries LD1–LD5, design-system location, assets, naming, code splitting, lazy loading, performance, security, observability, templates, open decisions, assumptions.
- **Changed:** file renumbered from phase 8 to phase 7; §2 "Styling organization" (CSS reset strategy, `globals.css` structure, component styling standards, raw values to tokenize, named layout class registry) replaced by a statement that styling follows host conventions and is decided at build; theme constants (`THEME_CLASS`, `THEME_COLOR`, `THEME_COOKIE`), Geist fonts and dark default removed; ThemeToggle wiring reframed as an optional colour-scheme preference; lint map updated to the working tree (token-first rule removed by the owner); template code stripped of class names; P8-A* assumptions renamed P7-A*; P7-A7 withdrawn.
- **Added:** built-state markers (B) across folders, hooks and routes; `components/ledgerline/` and `lib/ledgerline/` mapped to S04, S06, S07, S55–S64; `use-damped-pointer` and `use-enquiry`; the public-page money helper finding (H-24); the type-name collision finding (R-10); OD9 and OD10 rows.
- **Audit and reconciliation (2.1.0, 2026-10-01; no ID, heading, route, folder or hook removed or renamed):** §10.2 and §10.3 are now the complete constants table, with Phase 1 BR19 as the authority for values and this phase owning the names (messages 5,000, export polling stopped at 30 minutes, dashboard caps 6/8/10, and the previously unnamed limits added); `use-accounts` and `use-cash-flow` and their endpoints recorded as existing; LD1 recorded as installed; writes interrupted by expiry or step-up are re-submitted by the member, never replayed; page-level denial uses C32; the open-redirect rule spells out `/\`, encoded forms, control characters and length; reveal roles and the step-up lock aligned; and, from the residual decisions of the same date, the remaining phase-local constants named in §10, freshness tiers of 15 s, 60 s and 5 minutes, drafts held in the open tab's memory only, the full ledger parameter set with `category`, `direction` and `attachment`, the unbounded ledger query, a required `reference` on every failure, per-purpose step-up grants, owner-scoped export jobs, threads and alert rules, and audit readership. Deepened: principles 8–12; route-handler rules (§4.1); guard matrix with denial behaviour per boundary (§5.7); provider defaults (§6); query-key isolation rules (§8.1); double submission, stale writes, cancellation and expiry mid-call (§8.3); money, time and locale ownership (§9.1); specified constant values (§10.3) and validated configuration (§10.4); error taxonomy, timeouts and retry, invalidation, pagination contract, idempotency, degraded service, switches and rollback (§13.6–§13.11); a check for every organisation rule (§14.1) and verification layers with the CI gate (§14.2); dependency and supply-chain policy (§15.1); upload and download rules (§17); per-route budgets and measurement (§21.1, §21.9); session, CSRF, redirect, header, CSP, throttling, tenant-isolation and secrets policy (§22.1–§22.5); the quotable reference, reporting fields and redaction (§23); `reference` in the templates (§24.5); assumptions P7-A9–P7-A21. Hooks present in the tree and missing from the inventory (`use-online`, `use-settled`, `use-runway-params`) were added to §8.2. Two position words were reworded (§7.1, §19).

## 28. Traceability

Upstream: [Phase 1](phase-1-product-vision.md), [Phase 2](phase-2-experience-maps.md), [Phase 3](phase-3-information-architecture.md), [Phase 4](phase-4-page-blueprints.md) (P01–P35 → files), [Phase 5](phase-5-section-blueprints.md) (S01–S64 → folders and hooks), [Phase 6](phase-6-interaction-contracts.md) (C01–C68 → layers). Downstream: [Phase 8](phase-8-implementation-roadmap.md) (foundations and sprint order), [Phase 9](phase-9-qa-checklist.md) (budgets, security, lint gates), [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md), [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md).

Host files referenced: [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) · [`eslint.config.ts`](../../eslint.config.ts) · [`proxy.ts`](../../proxy.ts) · [`lib/constants.ts`](../../lib/constants.ts) · [`lib/api-client.ts`](../../lib/api-client.ts) · [`lib/api-server.ts`](../../lib/api-server.ts) · [`lib/api-routes.ts`](../../lib/api-routes.ts) · [`components/providers/provider.tsx`](../../components/providers/provider.tsx) · [`app/layout.tsx`](../../app/layout.tsx) · [`app/(marketing)/page.tsx`](../../app/%28marketing%29/page.tsx) · [`lib/ledgerline/money.ts`](../../lib/ledgerline/money.ts) · [`lib/types/ledgerline.ts`](../../lib/types/ledgerline.ts)
