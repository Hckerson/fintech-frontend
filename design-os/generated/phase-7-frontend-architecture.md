# Ledgerline Design OS — Phase 7: Frontend Architecture

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 "Phase 8: Frontend Architecture" of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

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
│   ├── actions/                          H  Server Actions (B: create-user.ts)
│   ├── contract/                         H  generated — never edit
│   ├── data/                             H  static copy and config (B: ledgerline/ sample content for P01)
│   ├── enums/                            H  lifecycle tuples
│   ├── hooks/                            H  use-<resource>.ts + query-keys.ts (B: use-login, use-logout, use-register, use-create-user, use-debounced-search, use-damped-pointer)
│   ├── types/                            H  <domain>.ts re-exported by index.ts (B: api.ts, ledgerline.ts)
│   ├── utils/                            H  pure + server-only helpers (B: date-*, internal-path, query-string, local-storage, session, verify-session-token)
│   ├── validations/                      H  Zod composing contract schemas (B: contact.ts)
│   ├── ledgerline/                       B  feature constants and helpers for the public page (constants.ts, money.ts, chart.ts)
│   ├── <feature>/constants.ts            H  feature-scoped constants
│   ├── api-client.ts · api-routes.ts · api-server.ts · constants.ts   H
├── design-os/generated/                  H  this design OS
├── public/fonts/                         H  font.ts
├── styles/                               H  tokens.css, globals.css
├── tools/eslint/rules/ · tools/codemods/ · tools/contract/   H
├── proxy.ts                              N
├── instrumentation.ts                    N  optional (§23)
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

## 6. Providers

| ID | Provider | File | Holds | Mounted in | Why |
|---|---|---|---|---|---|
| C61 | Provider | `components/providers/provider.tsx` (B) | `QueryClient` + `MotionConfig reducedMotion="user"` + devtools (dev) | root | Host provider. Target: `QueryCache.onError` routes 401 to C55 and step-up to X4; `staleTime` from `STALE_TIME`. |
| C62 | Message provider | `components/providers/toast-provider.tsx` | queue, polite live region | root | One live region announces every mutation result once. |
| C63 | WorkspaceProvider | `components/providers/workspace-provider.tsx` | current workspace + role | `(workspace)` layout | Read by S01, C59 and most sections; context from server data, not a store. |

A colour-scheme preference, if offered, is a cookie and a class on `<html>`, not a provider: C54 applies it immediately, calls a `setColourScheme` Server Action, then `router.refresh()` in a transition. Order in the root: Provider → Message provider → children.

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
| `<section>.tsx` | Server Component | Prefetches the above-the-fold query and wraps the view in `HydrationBoundary`. Only for LCP-critical sections: S14, S19, S20, S23. |
| `<section>-view.tsx` | Client Component | Calls the hook, renders through C57. |
| `<section>-skeleton.tsx` | Server Component | Loading placeholder passed to `<Suspense>`; reserves space so nothing shifts. |

## 8. Hooks

All hooks live in `lib/hooks/use-<resource>.ts`, one per file, TanStack Query v5. Authenticated hooks wrap a Server Action and unwrap its `ActionResult` with `unwrap`. Components import hooks, never the API client or an action.

### 8.1 Query-key factory — `lib/hooks/query-keys.ts`

- Keys are built only by the factory (template 24.3).
- Hierarchy `[resource, workspaceId, scope, params]`; `me`, `workspaces`, `admin` are not workspace-scoped.
- Every workspace-scoped key carries the workspace ID **and** switching workspace (C36) or signing out (X3) calls `queryClient.clear()` before `router.refresh()`. Why both: `clear()` alone races with late responses; with the ID in the key, a late response lands in a key nothing reads.

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
| `use-accounts` | Q | `list-accounts.ts` | S14 S15 S19 S29 | — |
| `use-account` | Q | `get-account.ts` | S20 | — |
| `use-reveal-account-number` | M | `reveal-account-number.ts` | C42 | — |
| `use-transactions` | IQ (limit variant Q) | `list-transactions.ts` | S16 S17 S23 | — |
| `use-transaction` | Q | `get-transaction.ts` | S24 S25 | — |
| `use-update-transaction` | M | `update-transaction.ts` | S26 | — |
| `use-upload-attachment` | M | `upload-attachment.ts` | S26 | — |
| `use-ledger-summary` | Q | `get-ledger-summary.ts` | S22 | — |
| `use-cash-flow` | Q | `get-cash-flow.ts` | S18 S29 | — |
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
| `use-local-storage` | L | — | C38 Recent, drafts (S37), preferences | — |
| `use-create-transfer` / `use-payees` | M / Q | `create-transfer.ts` / `list-payees.ts` — Deferred (OD3) | S44 S45 | — |
| `use-enquiry` | M | intake per OD10 — not decided | S64 | — |

### 8.3 Patterns

- **Server Action pairing.** `mutationFn`/`queryFn` call the action and `unwrap`; mutations `setQueryData` the detail and invalidate the list prefix (template 24.5).
- **Infinite queries** for S23 with nullable cursor, `getNextPageParam`/`getPreviousPageParam`, and `maxPages: LEDGER_MAX_PAGES`.
- **Polling** in `use-exports`: `refetchInterval` returns `EXPORT_POLL_INTERVAL` while any job is in `ACTIVE_EXPORT_STATES`, else `false`; `refetchIntervalInBackground: false`.
- **Server prefetch** for LCP-critical sections through the same `queryOptions` factory.
- **Optimistic updates** only for S26 flag and category (and S34 mark-read); never for anything that looks like money.

## 9. Utilities

| File | Signature | Rule |
|---|---|---|
| `money.ts` | `formatMoney(amountMinor: string, currency: string, locale?: string): string` | `BigInt` parse; digits from `Intl…resolvedOptions().maximumFractionDigits`; `signDisplay: "exceptZero"` for movements, `"auto"` for balances. Only C40/C41 consume it. |
| `money.ts` | `sumMinor(amounts: string[]): string` | `BigInt` addition; server totals preferred. |
| `runway.ts` | `runwayMonths(balanceMinor, monthlyNetBurnMinor): number \| null` | `null` when not burning; whole months rounded down; property-tested. |
| `date-range.ts` | `resolveRange(preset, today): DateRange` | `date-fns`; presets enum in `lib/enums/`; `DATE_VALUE_FORMAT`. |
| `ledger-params.ts` | `parseLedgerFilters(params)` / `serializeLedgerFilters(filters)` | `.catch()` defaults; serialises via host `queryString`. |
| `unwrap.ts`, `action-error.ts` | `unwrap(result)`, `class ActionError { status }` | Lets C61 route 401 and step-up. |
| `read-envelope.ts` | `readEnvelope(upstream, schema)` | `server-only`; one place for response parsing. |
| `refusal-message.ts` | `refusalMessage(body)` | Promoted from `lib/actions/create-user.ts` on second use. |
| `get-query-client.ts` | `getQueryClient()` | Server-side, React `cache()`. |
| `mask.ts` | `maskAccountNumber(last4)` | Presentation only. |
| `onboarding-progress.ts`, `pending-items.ts`, `describe-filters.ts` | pure | Phase 5 S09, S17, S27. |
| host (B) | `date-formatter.ts`, `date-parser.ts`, `internal-path.ts`, `query-string.ts`, `local-storage.ts`, `session.ts`, `verify-session-token.ts` | Reused. `internalPath` guards every `next`. |

**Public page helper (B).** `lib/ledgerline/money.ts` formats integer minor units as an exact decimal (no float division) with a fixed exponent of 2 (`FRACTION_DIGITS`) in `en-GB`. It must not be used for product money: the fixed exponent breaks BR1 for 0- and 3-decimal currencies. Phase 9 H-24.

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
| Section limits | `DASHBOARD_ACCOUNT_LIMIT`, `DASHBOARD_ACTIVITY_LIMIT`, `REVEAL_TIMEOUT`, `SAVED_VIEW_LIMIT`, `MESSAGE_MAX_LENGTH`, `SUPPORT_QUERY_MIN`, `EXPORT_MAX_RANGE_DAYS`, `LEDGER_QUERY_MAX_LENGTH`, `HOVER_INTENT_MS`, `LOADING_DELAY_MS`, `TOAST_DURATION_MS` | Phase 5 A12; values set when each section is built. |

1.0.0's `THEME_CLASS`, `THEME_COLOR` and `THEME_COOKIE` (dark/Daylight) are withdrawn as visual; the working tree has its own `LEDGERLINE_THEME_CLASS` / `LEDGERLINE_THEME_COLOR` for the public page.

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
| Form drafts | component state (LD3 once approved); message drafts via `use-local-storage` |
| Palette open, dialog open, public-page samples (S58, S59, S63) | owning component state |
| Navigation collapsed, preferences | `use-local-storage` |
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

`pnpm contract:check` fails when `lib/contract/` disagrees with the backend document. It passes vacuously when the source is missing (`CONTRACT_SOURCE` defaults to a `nest-setup` path; this backend is `../backend`) — risk R-8.

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
| GET `/api/health` | `routes.healthCheck` | S54 outage variant |
| GET `/api/stats/users/total` · `/series` | `routes.statsUsersTotal` · `statsUsersSeries` | `use-admin-user-total` · `use-admin-user-series` |

Required from the backend (proposed resources):

| Resource | Operations | Hooks |
|---|---|---|
| Workspaces, memberships, invitations | current, update, list members, member detail, invite, change role, remove | `use-workspace`, `use-update-workspace`, `use-team`, `use-team-member`, `use-invite-member` |
| Accounts | list with balances, detail, reveal number (step-up) | `use-accounts`, `use-account`, `use-reveal-account-number` |
| Transactions | cursor list with filters, detail, PATCH annotations, attachments | `use-transactions`, `use-transaction`, `use-update-transaction`, `use-upload-attachment` |
| Ledger summary, cash flow, compare periods | read | `use-ledger-summary`, `use-cash-flow`, `use-compare-periods` |
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

## 14. Component organization

| Layer | Folder | May import | May not import | Contracts |
|---|---|---|---|---|
| Primitives | `components/ui/` | React, `clsx`, Carbon icons, LD1/LD5 once approved | `@/lib/hooks`, `@/lib/actions`, other component folders | C01–C33 |
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

## 15. Shared libraries

Reused, already in `package.json`: `next` 16.2, `react` 19.2, `tailwindcss` v4, `@tanstack/react-query` 5, `zod` 4, `motion` 12, `@carbon/icons-react`, `clsx`, `date-fns` 4, `nanoid`, `jose`, `axios`, `server-only`, `vitest`, `fast-check`, `ts-morph`.

Pending maintainer approval (OD8; per the seed's Library Selection Policy — reuse first, recommend, confirm before installing):

| ID | Need | Recommendation | Why | Contracts |
|---|---|---|---|---|
| LD1 | Charts | `recharts` (alternative `@visx/*`) | Most common React charting library; accessible data tables still hand-built | C30 → S18 S28 S29 S48 (S60 is hand-built SVG today) |
| LD2 | Table + virtualization | `@tanstack/react-table` + `@tanstack/react-virtual` | Same family as Query; headless | C53 → S23 S49 |
| LD3 | Forms | `react-hook-form` + `@hookform/resolvers` | Standard Zod resolver | S10 S11 S31 S35 S38 S40 S42 S43 S44 |
| LD4 | Testing | `@testing-library/react`, `@testing-library/user-event`, `jsdom`, `@playwright/test`, `@axe-core/playwright` | Component, E2E and a11y checks in Phase 9 need a browser | Phase 9 |
| LD5 | Positioning | native `popover` + CSS anchor positioning first; `@floating-ui/react` only if needed | Native first | C19 C20 |

Money formatting uses `Intl.NumberFormat`; no money library.

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
| User uploads | backend storage, signed URLs | never in `public/`. |

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
| C30 Chart (LD1) | `next/dynamic` in a client wrapper, `ssr: false`, C16 fallback | heaviest dependency; S18 is not the primary content on P08 |
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

Every balance shows an "as of" time from the response.

### 21.7 Prefetch

Account rows prefetch `use-account` and the first ledger page; transaction rows prefetch `use-transaction` and the overlay route; both after `HOVER_INTENT_MS`, skipped when `saveData` is set.

### 21.8 Other rules

`next/font` with swap and metric fallbacks; charts from summarized series; one memoised `Intl.NumberFormat` per currency and locale; no row animation in tables.

## 22. Security

| Control | Implementation |
|---|---|
| Session cookie | httpOnly, `secure` in production, `sameSite: "lax"`, `path: "/"`. Lifetime per OD2 (recommended 15 min idle + 12 h absolute). |
| Token verification | `proxy.ts` verifies RS256 with the public key only (`jose`, `JWT_PUBLIC_KEY`); missing key fails loudly. |
| Route protection | proxy over `PROTECTED_ROUTE_PREFIXES` and `ADMIN_ROUTE_PREFIX`; layouts repeat checks; backend authorizes every call. |
| Admin guard | proxy + `(admin)/layout.tsx` `notFound()`; C59 is never enforcement. |
| Step-up | reveal (C42), password change, two-step changes, revoke-all; actions return a step-up status; C61 opens C55/P06; the hook retries once. |
| Masking | last four by default; full value fetched on demand, time-limited, `gcTime: 0`. |
| No PII in URLs | opaque IDs only; free-text `q` stays for shareable search with `Referrer-Policy: strict-origin-when-cross-origin`. S64 email never in a URL. |
| No PII in logs | no `console` (lint); boundaries show a digest only. |
| Redirect safety | every `next` through `internalPath` (H-16). |
| CSRF | Server Actions check Origin; route handlers rely on `sameSite: "lax"` + JSON. |
| Security headers | `next.config.ts`: HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, CSP `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` (H-17). |
| CSP scripts | per-request nonce from `proxy.ts` (`nanoid`). |
| Shared machines | sign-out and workspace switch clear the cache; authenticated responses `no-store`. |

## 23. Observability

- Section errors render C33 with the `digest` as a reference that S53 can look up; route failures render S54; offline shows a persistent notice.
- Logging belongs in services: no `console`. Frontend server errors may be forwarded by `instrumentation.ts` `onRequestError` to a service the maintainer chooses (a new dependency under the approval rule).
- Web Vitals via `useReportWebVitals` to the same service once chosen; until then Phase 9 measures in the lab.

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
    if (!result.ok) throw new ActionError(result.status, result.message);
    return result.data;
};
```

```ts
import "server-only";
import { z } from "zod";
import { readJson } from "@/lib/api-server";
import { REQUEST_FAILED } from "@/lib/constants";
import { apiEnvelopeDtoSchema } from "@/lib/contract/schemas";
import type { ActionResult } from "@/lib/types/api";
import { refusalMessage } from "@/lib/utils/refusal-message";

const envelopeSchema = apiEnvelopeDtoSchema.extend({ data: z.unknown() });

export const readEnvelope = async <TSchema extends z.ZodType>(
    upstream: Response,
    schema: TSchema,
): Promise<ActionResult<z.output<TSchema>>> => {
    const body = await readJson(upstream);
    if (!upstream.ok) return { ok: false, status: upstream.status, message: refusalMessage(body) };
    const envelope = envelopeSchema.safeParse(body);
    const payload = schema.safeParse(envelope.success ? envelope.data.data : undefined);
    return payload.success ? { ok: true, data: payload.data } : { ok: false, status: 502, message: REQUEST_FAILED };
};
```

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

export const updateTransaction = async (
    transactionId: string,
    input: UpdateTransactionDto,
): Promise<ActionResult<TransactionResponseDto>> => {
    const parsed = updateTransactionDtoSchema.safeParse(input);
    if (!parsed.success) return { ok: false, status: 400, message: INVALID_REQUEST };
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

The action re-validates input because a Server Action is a public POST endpoint.

## 25. Open decisions touched by this phase

| ID | Decision | Effect here | Cost of reversal |
|---|---|---|---|
| OD2 | Session policy | `SESSION_MAX_AGE`, idle handling in C55, step-up windows | Low in code |
| OD3 | Money movement | `payments/` folder; P26/P27 `notFound()` while off | High |
| OD4 | Feature folders | every section path in §7; `components/ledgerline/` already exists | Low now, rising |
| OD8 | LD1–LD5 | C30, C53, forms, tests, C19/C20 | Contained behind C30/C53 |
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

## 27. Changes in this version

- **Retained:** principles, folder structure, route structure (with `(workspace)`), route handlers, layouts, providers, feature folders, section anatomy, hooks (inventory, query keys, patterns), utilities, constants placement, contexts, stores, API organization, component layers, lint map, shared libraries LD1–LD5, design-system location, assets, naming, code splitting, lazy loading, performance, security, observability, templates, open decisions, assumptions.
- **Changed:** file renumbered from phase 8 to phase 7; §2 "Styling organization" (CSS reset strategy, `globals.css` structure, component styling standards, raw values to tokenize, named layout class registry) replaced by a statement that styling follows host conventions and is decided at build; theme constants (`THEME_CLASS`, `THEME_COLOR`, `THEME_COOKIE`), Geist fonts and dark default removed; ThemeToggle wiring reframed as an optional colour-scheme preference; lint map updated to the working tree (token-first rule removed by the owner); template code stripped of class names; P8-A* assumptions renamed P7-A*; P7-A7 withdrawn.
- **Added:** built-state markers (B) across folders, hooks and routes; `components/ledgerline/` and `lib/ledgerline/` mapped to S04, S06, S07, S55–S64; `use-damped-pointer` and `use-enquiry`; the public-page money helper finding (H-24); the type-name collision finding (R-10); OD9 and OD10 rows.

## 28. Traceability

Upstream: [Phase 1](phase-1-product-vision.md), [Phase 2](phase-2-experience-maps.md), [Phase 3](phase-3-information-architecture.md), [Phase 4](phase-4-page-blueprints.md) (P01–P35 → files), [Phase 5](phase-5-section-blueprints.md) (S01–S64 → folders and hooks), [Phase 6](phase-6-interaction-contracts.md) (C01–C68 → layers). Downstream: [Phase 8](phase-8-implementation-roadmap.md) (foundations and sprint order), [Phase 9](phase-9-qa-checklist.md) (budgets, security, lint gates), [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md), [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md).

Host files referenced: [`.claude/CLAUDE.md`](../../.claude/CLAUDE.md) · [`eslint.config.ts`](../../eslint.config.ts) · [`proxy.ts`](../../proxy.ts) · [`lib/constants.ts`](../../lib/constants.ts) · [`lib/api-client.ts`](../../lib/api-client.ts) · [`lib/api-server.ts`](../../lib/api-server.ts) · [`lib/api-routes.ts`](../../lib/api-routes.ts) · [`components/providers/provider.tsx`](../../components/providers/provider.tsx) · [`app/layout.tsx`](../../app/layout.tsx) · [`app/page.tsx`](../../app/page.tsx) · [`lib/ledgerline/money.ts`](../../lib/ledgerline/money.ts) · [`lib/types/ledgerline.ts`](../../lib/types/ledgerline.ts)
