# Ledgerline Design OS — Phase 9: Quality Assurance Checklist

> Version 2.0.0 · 2026-09-28 (merge over 1.0.0 of 2026-09-26) · Ledgerline Design OS · Seed: [MASTER_PROMPT_COMPLETE.md](../../docs/MASTER_PROMPT_COMPLETE.md)

Previous: [Phase 8 — Implementation Roadmap](phase-8-implementation-roadmap.md) · Next: [Implementation Prompt](IMPLEMENTATION_PROMPT.md) · [Index](ARTIFACT_INDEX.md) · [Start here](START_HERE.md)

## Table of contents

- [How to use this checklist](#how-to-use-this-checklist)
- [1. Accessibility](#1-accessibility)
- [2. Behavioural consistency](#2-behavioural-consistency)
- [3. Responsiveness](#3-responsiveness)
- [4. Scalability](#4-scalability)
- [5. Performance](#5-performance)
- [6. State coverage](#6-state-coverage)
- [7. Error handling](#7-error-handling)
- [8. Loading behavior](#8-loading-behavior)
- [9. Retired: design system compliance](#9-retired-design-system-compliance)
- [10. Frontend readiness](#10-frontend-readiness)
- [11. Developer experience](#11-developer-experience)
- [12. SEO readiness](#12-seo-readiness)
- [13. Maintainability](#13-maintainability)
- [14. Cross-browser compatibility](#14-cross-browser-compatibility)
- [15. WCAG compliance](#15-wcag-compliance)
- [16. Money and data integrity](#16-money-and-data-integrity)
- [17. Security and privacy](#17-security-and-privacy)
- [18. Content truthfulness](#18-content-truthfulness)
- [19. Public site (added 2.0.0)](#19-public-site-added-200)
- [Host audit findings](#host-audit-findings)
- [Per-page state coverage matrix](#per-page-state-coverage-matrix)
- [Sign-off](#sign-off)
- [Verified gate](#verified-gate)
- [Traceability](#traceability)
- [Assumptions and open questions](#assumptions-and-open-questions)
- [Item count](#item-count)
- [Changes in this version](#changes-in-this-version)

## How to use this checklist

Every item is one pass/fail statement about the product, numbered `Q-001` onward and never renumbered — a retired item keeps its number and is marked retired, so references from [Phase 8](phase-8-implementation-roadmap.md) and pull requests stay valid. The "How to verify" column names the tool, lint rule, script or manual step that decides the result.

- **Lint rules** are the existing `starter/*` rules in `tools/eslint/rules/` plus the flat-config rules in [eslint.config.ts](../../eslint.config.ts). Where a rule has a known gap it is named in [Host audit findings](#host-audit-findings).
- **(needs LD4)** marks an item whose automated check needs the testing libraries proposed as LD4 (`@testing-library/react`, `@testing-library/user-event`, `jsdom`, `@playwright/test`, `@axe-core/playwright`). They are awaiting maintainer approval. Until approved, the manual step in the same cell is the check of record.
- **Manual screen-reader runs** use NVDA + Firefox and NVDA + Chrome on Windows, VoiceOver + Safari on macOS and iOS, TalkBack + Chrome on Android.
- **Seeded states** come from the backend seed (`backend/prisma/seed.ts`), never from frontend arrays — see [18. Content truthfulness](#18-content-truthfulness).
- Heavy commands (`pnpm type-check`, `pnpm lint`, `pnpm build`, test runs) are run at the Phase 8 gate or when a maintainer asks, not on every edit.

Why a numbered, single-statement list: a reviewer can mark each line pass or fail without interpretation, and a failure can be filed against one ID. Items that bundle two conditions were split.

## 1. Accessibility

Why: Ledgerline is a daily tool for finance staff, several of whom use keyboards, magnifiers or screen readers all day. WCAG success criteria are mapped one-to-one in [15. WCAG compliance](#15-wcag-compliance); this category covers the structural practices that make those criteria achievable.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-001 | Every page has exactly one `<h1>` and heading levels never skip inside a section. | axe `page-has-heading-one` + `heading-order` (needs LD4); manual: HeadingsMap extension. |
| Q-002 | Every route renders one `<main>`; [S01 Primary navigation](phase-5-section-blueprints.md#s01--primary-navigation) is a labelled `<nav>`; S02 Global utilities is a `<header>`. | axe landmark rules (needs LD4); manual: NVDA landmarks list (NVDA+F7). |
| Q-003 | A "Skip to content" link is the first focusable element in the `(app)` and `(admin)` layouts and moves focus to `<main>`. | Manual: load P08, press Tab once, Enter, confirm focus lands in main. |
| Q-004 | Every icon-only control (C02 IconButton, C39 Notification entry point, C51 CopyButton) exposes an accessible name. | axe `button-name` (needs LD4); manual: NVDA reads each control's name. |
| Q-005 | Decorative Carbon icons are hidden from assistive tech; icons that carry meaning have a text label. | Accessibility tree in Chrome DevTools on P08 and P10. |
| Q-006 | Every form control is tied to a visible label through [C10 Field](phase-6-interaction-contracts.md#c10--field) using an id from `useId`, never the label text. | Code review of C10; axe `label` (needs LD4). |
| Q-007 | A field in error carries `aria-invalid="true"` and references its message with `aria-describedby`. | Testing Library query by role + description (needs LD4); manual: NVDA reads the error on focus. |
| Q-008 | Opening [C21 Dialog](phase-6-interaction-contracts.md#c21--dialog) or [C22 Detail overlay](phase-6-interaction-contracts.md#c22--detail-overlay) moves focus inside, Escape closes, focus returns to the invoking control. | Playwright keyboard script (needs LD4); manual keyboard run. |
| Q-009 | [C38 CommandPalette](phase-6-interaction-contracts.md#c38--commandpalette) uses combobox + listbox semantics with `aria-activedescendant`; arrows move, Enter opens, Escape closes. | Manual: NVDA + Chrome, VoiceOver + Safari. |
| Q-010 | [C53 DataTable](phase-6-interaction-contracts.md#c53--datatable) keeps table semantics while virtualized: `aria-rowcount` equals the server total, rendered rows carry `aria-rowindex`. | DOM inspection on a seeded 100k-row ledger; manual SR "row N of M". |
| Q-011 | Sortable column headers expose `aria-sort` and announce the change. | DOM inspection; manual SR. |
| Q-012 | Every [C30 Chart](phase-6-interaction-contracts.md#c30--chart) has a text alternative (summary sentence plus an accessible data table with the same figures). | Manual SR on S18 and S28; review C30 props require the summary. |
| Q-013 | C24 Transient message messages are announced through a polite live region, and nothing that needs action exists only in a toast. | NVDA speech viewer during an export-ready event. |
| Q-014 | All motion honours `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` in C61 and the equivalent CSS media query); no information is conveyed only by motion. | DevTools → Rendering → emulate reduced motion on P01 and P08. |
| Q-015 | Screen-reader smoke scripts for P02, P08, P10, P12 and P18 complete without a blocker on all four SR + browser pairs listed above. | Manual script recorded in the Phase 8 testing strategy. |
| Q-016 | Focus indicators, control borders and status badges stay visible in forced-colors mode. | Edge DevTools → Rendering → emulate `forced-colors: active`; Tab through P02 and P10. |

## 2. Behavioural consistency

Why: in a finance tool, two renderings of the same amount or status read as two different facts. One concept, one component, one word.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-017 | *Retired in 2.0.0 — visual (heading sizes and field text sizes); judged in the owner's build review, not by this checklist.* | — |
| Q-018 | Every amount on screen renders through [C40 Amount](phase-6-interaction-contracts.md#c40--amount); `Intl.NumberFormat` is called nowhere else in `components/`. | grep `Intl.NumberFormat` in `components/` returns only `amount.tsx`. |
| Q-019 | Transaction, account, verification and export statuses map to C12 Status label labels and severities from one lib map each; no component spells a status label inline. | grep status literals (`"posted"`, `"frozen"` …) in `components/`; review lib map. |
| Q-020 | Domain vocabulary is fixed: Account, Transaction, Counterparty, Statement, Export, Workspace, Member; v1 UI never calls a transaction a "payment". | Copy review of `lib/constants.ts` and `lib/data/`. |
| Q-021 | *Retired in 2.0.0 — visual (accent-button count per view); judged in the owner's build review, not by this checklist.* | — |
| Q-022 | Every empty state uses C32 EmptyState with title, one sentence and at most one action. | Review against the matrix below. |
| Q-023 | Every recoverable error uses C33 ErrorState with a retry action. | grep for ad-hoc error markup in `components/`. |
| Q-024 | Tables show absolute dates in one format; relative time appears only in S34 Notification feed and always carries the absolute time as accessible text. | Review `lib/utils/date-formatter.ts` consumers. |
| Q-025 | Keyboard shortcuts are declared once in constants and displayed with C28 Shortcut hint. | grep key literals in `components/`. |
| Q-026 | Icons come only from `@carbon/icons-react`. | grep icon imports; no other icon package in `package.json`. |

## 3. Responsiveness

Why: owners check balances from a phone (A8: web only, responsive to 360px). Every task must be completable on every supported width; how pages adapt is decided at build.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-027 | No page scrolls horizontally at 360, 390, 768, 1024, 1280, 1440 and 1920 px wide. | Playwright viewport sweep (needs LD4); manual: DevTools device toolbar. |
| Q-028 | *Retired in 2.0.0 — visual (responsive rules in named classes); judged in the owner's build review, not by this checklist.* | — |
| Q-029 | *Retired in 2.0.0 — visual (breakpoint tokens in media queries); judged in the owner's build review, not by this checklist.* | — |
| Q-030 | S01 Primary navigation is fully reachable on small screens; any control that reveals it exposes `aria-expanded` and `aria-controls`. | Manual at 390 px with keyboard and VoiceOver iOS. |
| Q-031 | At 360 px [S23 Ledger entries](phase-5-section-blueprints.md#s23--ledger-entries) keeps date, description and amount visible; amounts are never truncated or ellipsized. | Manual on seeded ledger with long counterparty names. |
| Q-032 | Content that becomes secondary on narrower screens stays reachable another way (link, disclosure or inline). | Manual at 768 and 1024 px. |
| Q-033 | Fixed controls are never clipped by device notches or home indicators. | iOS Safari 17 on a notched device, portrait and landscape. |
| Q-034 | Dialogs keep their action row reachable with the on-screen keyboard open on phones. | iOS Safari + Android Chrome with a focused input. |
| Q-035 | Charts resize with their container and keep axis labels legible at 360 px. | Manual on S18 and S28. |
| Q-036 | *Retired in 2.0.0 — visual (tabular figure alignment); judged in the owner's build review, not by this checklist.* | — |
| Q-037 | Auth forms (S08) remain fully usable in phone landscape with the keyboard open. | Manual at 844×390 on iOS and Android. |

## 4. Scalability

Why: the scale target is 5 million rows in one ledger and 200 concurrent members per workspace (spine SCALE_TARGET). The UI must cost the same at row 5,000,000 as at row 50.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-038 | S23 Ledger entries keeps the DOM row count bounded (about two viewports of rows) regardless of total rows. | DevTools element count on a seeded 100k-row account (needs LD2 approval for C53). |
| Q-039 | Ledger and search lists paginate by cursor through an infinite query, never by offset page number. | Code review of `use-transactions`; network tab shows `cursor` param. |
| Q-040 | Filters, sort and search live in URL params and are part of every list query key. | Code review; reload P11 with filters and confirm identical results. |
| Q-041 | Search input is debounced with `use-debounced-search` and superseded requests are aborted. | Network tab: typing "coffee" fires one request, earlier ones cancelled. |
| Q-042 | Large exports run as backend jobs (S31 → S32); the client never assembles CSV from loaded rows. | Code review of S31; network tab. |
| Q-043 | S18 and S28 charts receive server-aggregated series, never raw transaction lists. | Network payload size on P08 and P15. |
| Q-044 | Every workspace-scoped query key includes the workspace id, so switching workspace never shows the previous workspace's data. | Manual: switch workspace with C36 while P10 is open; code review of keys. |
| Q-045 | S39 Team members and S49 Platform user directory page on the server and stay responsive at 200 members / 10,000 users. | Seeded backend; Performance panel. |
| Q-046 | Notification count polling uses an interval from constants and stops while the tab is hidden. | Code review (`refetchIntervalInBackground: false`); DevTools network with tab hidden. |
| Q-047 | Adding a navigation destination changes only the nav config in `lib/data/`, not S01 code. | Code review of S01. |

## 5. Performance

Why: every wait sits between a finance lead and a number they need. Budgets below are targets for Phase 8, measured on a mid-range Android device with 4G throttling.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-048 | Largest Contentful Paint ≤ 2.5 s (p75) on P02, P08 and P10. | Lighthouse (Chrome DevTools) on throttled profile; RUM after release. |
| Q-049 | Interaction to Next Paint ≤ 200 ms for filter change, row open and palette open. | DevTools Performance panel, INP overlay. |
| Q-050 | Cumulative Layout Shift ≤ 0.1; skeletons reserve final dimensions. | Lighthouse; visual comparison of skeleton and populated frames. |
| Q-051 | First-load JavaScript per `(app)` route stays within the budget set in [Phase 7](phase-7-frontend-architecture.md). | Route table from the production build at the Phase 8 gate. |
| Q-052 | The LD1 chart library loads only on routes that render a chart. | Build chunk review; network tab on P10 shows no chart chunk. |
| Q-053 | Components are Server Components unless they need state, effects or browser APIs; `"use client"` sits on leaves. | grep `"use client"` and review each hit. |
| Q-054 | Fonts load through `next/font` with no visible layout shift on swap. | Lighthouse CLS attribution; review [public/fonts/font.ts](../../public/fonts/font.ts). |
| Q-055 | Images use `next/image` with `sizes`. | `@next/next/no-img-element` (core-web-vitals config). |
| Q-056 | Scrolling a seeded 100k-row ledger holds 60 fps on a mid-range laptop. | DevTools Performance → frames. |
| Q-057 | Query `staleTime` and polling intervals come from constants per resource; none is a literal in a component or provider. | grep `staleTime`, `refetchInterval` (see H-23). |
| Q-058 | P08 Dashboard sections fetch in parallel with no request waterfall. | Network waterfall on P08. |
| Q-059 | Hovering or focusing an account row prefetches its ledger route. | Network tab on P09. |
| Q-060 | Ledger rows are memoized and keyed by server id; a filter change re-renders only affected rows. | React Profiler flamegraph. |

## 6. State coverage

Why: a blank area in a banking console reads as "zero balance". Every data-bound section states explicitly which of its states it is in. Page-level expectations are in the [matrix](#per-page-state-coverage-matrix).

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-061 | Every section S01–S54 renders distinct loading, empty, error and populated states through [C57 QueryBoundary](phase-6-interaction-contracts.md#c57--queryboundary). | Review each section against [Phase 5](phase-5-section-blueprints.md); mocked responses per state. |
| Q-062 | Empty states distinguish "nothing here yet" from "no results for these filters"; the second offers "Clear filters". | Manual on P11 with and without filters. |
| Q-063 | One failing section never blanks its page; C58 SectionErrorBoundary contains the failure. | Force a 500 on the cash-flow endpoint; P08 other sections still render. |
| Q-064 | A member without permission who opens a URL directly sees a permission state naming who can grant access, not a blank page or a sign-out. | Manual as seeded R4 viewer opening `/exports`. |
| Q-065 | Account states `active`, `frozen`, `closed`, `pending_verification` each render a distinct badge and explanatory copy in [S20 Account overview](phase-5-section-blueprints.md#s20--account-overview). | Seeded accounts in each state. |
| Q-066 | Transaction states `pending`, `posted`, `returned`, `reversed`, `failed` each render a distinct badge; `reversed` links to the original transaction. | Seeded transactions in each state. |
| Q-067 | Verification states `not_started`, `in_progress`, `submitted`, `needs_info`, `approved`, `rejected` each drive S09 and S13 correctly. | Seeded verification cases. |
| Q-068 | Export job states `queued`, `running`, `ready`, `failed`, `expired` each render; `expired` offers regeneration. | Seeded export jobs; [S32 Export jobs](phase-5-section-blueprints.md#s32--export-jobs). |
| Q-069 | Cached data shown after a failed refetch or while offline carries an "as of" timestamp. | DevTools offline after P08 loads. |
| Q-070 | Navigation lists only routes that have a page in the release; Deferred P26 and P27 stay specified in [Phase 4](phase-4-page-blueprints.md#p26--transfer) and unlinked until their revisit trigger. | Review nav config in `lib/data/`. |
| Q-071 | P08 composes D1–D4 by role; each seeded role sees only its permitted sections. | Sign in as seeded owner, finance, accountant and viewer. |
| Q-072 | [C55 SessionExpiryDialog](phase-6-interaction-contracts.md#c55--sessionexpirydialog) appears before idle expiry with an option to stay signed in. | Shorten idle timeout in dev config; wait. |

## 7. Error handling

Why: a finance user told "wrong password" during an outage resets a working password; one told nothing re-submits. Errors say what happened and what to do next.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-073 | Sign-in distinguishes invalid credentials (401), too many attempts (429), invalid input (400) and service unavailable (5xx or network) with a distinct message each. | Vitest on `app/api/session/route.ts` with mocked upstream; manual with backend stopped (see H-02). |
| Q-074 | Every API response is parsed with its contract Zod schema before use; a parse failure renders C33 ErrorState, never a crash. | Code review of hooks; vitest with malformed payloads. |
| Q-075 | Every mutation shows success or failure feedback; a failed note save keeps the typed text. | Manual on S26 with a forced 500. |
| Q-076 | Each `(app)` and `(admin)` segment has an `error.tsx` whose retry calls `reset`. | File review against [Phase 7](phase-7-frontend-architecture.md); throw in dev. |
| Q-077 | `app/global-error.tsx` renders its own `<html>` and `<body>` and offers reload. | File review; throw in root layout in dev. |
| Q-078 | A backend 404 for an account, transaction, counterparty or member id renders the segment's `not-found.tsx` ([P34](phase-4-page-blueprints.md#p34--not-found-404)). | Manual with an unknown id. |
| Q-079 | A 401 mid-session sends the member to sign-in with `next` preserved and returns them after re-authentication (X4). | Delete the session cookie in DevTools, click a row. |
| Q-080 | A 403 shows the permission state and never signs the member out. | Manual as R4 calling an export endpoint. |
| Q-081 | Going offline shows a non-blocking offline banner; writes are disabled with an explanation rather than failing silently. | DevTools → Network → Offline. |
| Q-082 | Error copy states what happened and what to do; raw codes appear only as a reference id; no stack traces reach the page. | Copy review; production build error pages. |
| Q-083 | No `console.*` call exists in committed code; errors are reported by services. | `no-console` rule. |
| Q-084 | Uploads (C49) reject wrong type or oversize files before sending, naming the limit. | Manual on S12 and S26. |
| Q-085 | Query retries use backoff and never retry 4xx responses. | Review QueryClient defaults in C61 Provider. |

## 8. Loading behavior

Why: skeletons shaped like the final layout let a user find their place before the numbers arrive, and stop the page jumping under the cursor.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-086 | Page and section loads use C16 Loading placeholders that reserve final space; no full-page blocking loader. | Throttled network review of every page. |
| Q-087 | C17 Progress indicator appears only for an action in flight (pending button, running export, pending switch), never in place of content. | grep consumers. |
| Q-088 | Each `(app)` segment has `loading.tsx` so the shell streams immediately. | File review; throttled navigation. |
| Q-089 | A pending button is disabled, sets `aria-busy`, keeps its label, and cannot submit twice even when `disabled={false}` is passed. | Manual double-click on P02; vitest on C01 (see H-22). |
| Q-090 | Skeletons appear only after a short delay constant, so fast responses do not flash. | Code review of C57; constant in `lib/constants.ts`. |
| Q-091 | Background refetches keep current content visible (`isFetching`), never swapping back to a skeleton (`isPending` only on first load). | Code review of C57. |
| Q-092 | Loading more ledger rows shows an inline loading row; the C25 range text updates and is announced. | Manual SR on P10. |
| Q-093 | Flag and category changes update optimistically and roll back with an error message on failure. | Forced 500 on transaction PATCH. |
| Q-094 | A member can leave P18 while an export runs and receives an X7 notification when it is ready. | Manual with a seeded slow export. |
| Q-095 | A loading region sets `aria-busy="true"` and screen readers hear one "Loading <section>" message, not one per skeleton bar. | NVDA speech viewer. |

## 9. Retired: design system compliance

Visual quality is judged when each page is built, with the owner (seed › Phase 9: "QA here is functional"). The styling items below are retired, not deleted, so their numbers stay stable. Q-113, Q-114 and Q-115 are code conventions and remain active; they are signed with Maintainability.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-096 | *Retired in 2.0.0 — visual (raw values in class names); judged in the owner's build review, not by this checklist.* | — |
| Q-097 | *Retired in 2.0.0 — visual (repeated utility chains promoted to named classes); judged in the owner's build review, not by this checklist.* | — |
| Q-098 | *Retired in 2.0.0 — visual (tokens as the only source of colours and sizes); judged in the owner's build review, not by this checklist.* | — |
| Q-099 | *Retired in 2.0.0 — visual (variant maps selecting tokens); judged in the owner's build review, not by this checklist.* | — |
| Q-100 | *Retired in 2.0.0 — visual (shared row-height class for look-alike rows); judged in the owner's build review, not by this checklist.* | — |
| Q-101 | *Retired in 2.0.0 — visual (raw values in globals.css); judged in the owner's build review, not by this checklist.* | — |
| Q-102 | *Retired in 2.0.0 — visual (token list vs @theme mapping); judged in the owner's build review, not by this checklist.* | — |
| Q-103 | *Retired in 2.0.0 — visual (colour utility names exist in @theme); judged in the owner's build review, not by this checklist.* | — |
| Q-104 | *Retired in 2.0.0 — visual (motion durations mirror tokens); judged in the owner's build review, not by this checklist.* | — |
| Q-105 | *Retired in 2.0.0 — visual (focus style from one global rule); judged in the owner's build review, not by this checklist.* | — |
| Q-106 | *Retired in 2.0.0 — visual (hover changes colour only); judged in the owner's build review, not by this checklist.* | — |
| Q-107 | *Retired in 2.0.0 — visual (density ceilings in app views); judged in the owner's build review, not by this checklist.* | — |
| Q-108 | *Retired in 2.0.0 — visual (named spacing classes within density ceiling); judged in the owner's build review, not by this checklist.* | — |
| Q-109 | *Retired in 2.0.0 — visual (figure typography on numbers); judged in the owner's build review, not by this checklist.* | — |
| Q-110 | Ordinary debits never carry problem severity; only `returned` and `failed` do, and severity is always also given in text. | Review C40 and C12 maps; seeded ledger read-through. |
| Q-111 | Every text and control in every colour scheme the build offers meets WCAG 2.2 AA contrast (4.5:1 text, 3:1 large text and UI). | Contrast check per page at build review; axe (needs LD4). |
| Q-112 | *Retired in 2.0.0 — visual (the 'explicitly not' visual list); judged in the owner's build review, not by this checklist.* | — |
| Q-113 | Every primitive in `components/ui/` uses `forwardRef`, explicit `HTMLAttributes` props and sets `displayName`. | grep `displayName` count equals primitive count (see H-07). |
| Q-114 | One component per file, kebab-case filename matching the export. | `starter/one-component-per-file`. |
| Q-115 | Stylesheets carry no comments (the `no-comments` lint rule does not read CSS). | grep `/\*` in `styles/` (see H-20). |
| Q-116 | *Retired in 2.0.0 — visual (globals.css baseline sections); judged in the owner's build review, not by this checklist.* | — |

## 10. Frontend readiness

Why: readiness means the next engineer can build a feature from the blueprints without inventing a location, a type or an endpoint.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-117 | Route groups `(marketing)`, `(auth)`, `(app)`, `(admin)` exist with the layouts specified in [Phase 7](phase-7-frontend-architecture.md). | File tree review. |
| Q-118 | Every page P01–P35 in [Phase 4](phase-4-page-blueprints.md) has either a route file or a status in [Phase 8](phase-8-implementation-roadmap.md); none is missing from both. | Cross-check script over the page registry. |
| Q-119 | Every backend call goes through `@/lib/contract` or `lib/api-routes.ts`, and the generated contract matches `openapi.json`. | `pnpm contract:check` at the gate. |
| Q-120 | Components never import `@/lib/api-client`; transport is called only inside `use-*` hooks in `lib/hooks/`. | `starter/api-access-boundary` + `no-restricted-imports`. |
| Q-121 | Hooks for authenticated calls wrap Server Actions in `lib/actions/` (pattern of `use-create-user`). | Code review of each new hook. |
| Q-122 | Required environment variables (`JWT_PUBLIC_KEY`, `NEXT_PUBLIC_API_URL`) fail loudly when missing in production instead of falling back silently. | Start production build without each variable; review [lib/constants.ts](../../lib/constants.ts) fallback. |
| Q-123 | Type-check passes with zero errors. | `pnpm type-check` at the gate. |
| Q-124 | Lint passes with zero errors and zero warnings. | `pnpm lint` at the gate. |
| Q-125 | Unit suites pass and cover money formatting, redirects and session parsing. | `pnpm test` (vitest) at the gate. |
| Q-126 | End-to-end scripts for X1, F2, F3 and F4 pass on Chromium, Firefox and WebKit. | Playwright (needs LD4). |
| Q-127 | Every library in use has recorded maintainer approval (LD1–LD5); none was added without it. | `package.json` diff review against the approval log in Phase 8. |

## 11. Developer experience

Why: conventions that are checked by a tool survive; conventions that live in memory do not.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-128 | Adding a data-bound section touches at most: one hook, one section component, one type file, one page composition line. | Review of the first Sprint 3 section PR. |
| Q-129 | Every custom ESLint rule has a colocated `.test.ts`, and every mechanically checkable convention introduced by this Design OS has a rule or a config entry. | File review of `tools/eslint/rules/`. |
| Q-130 | Cross-file fixes have a codemod in `tools/codemods/` that is dry-run by default. | Run codemod without `--write`; review output. |
| Q-131 | Lint messages name the fix, not only the violation. | Review rule `messages` blocks. |
| Q-132 | Every shared domain type is exported from `lib/types/<domain>.ts` and re-exported by `lib/types/index.ts`. | `starter/domain-types-in-lib`; review index. |
| Q-133 | Hand-written Zod in `lib/validations/` composes contract schemas with `.extend` or `.pick`, never restates a field. | Code review. |
| Q-134 | Every state in the [matrix](#per-page-state-coverage-matrix) is reachable locally from the backend seed. | Checklist run against a fresh seed. |
| Q-135 | Components link to routes through constants; no string literal `href="/..."` appears in `components/`. | grep `href="/`. |
| Q-136 | With git hooks disabled, the pull request template lists the manual gate commands (`pnpm type-check`, `pnpm lint`, `pnpm test`, `pnpm contract:check` with `CONTRACT_SOURCE=../backend/openapi.json`). `lint-staged` is not installed today, so it is not a gate until approved. | Review PR template. |

## 12. SEO readiness

Why: only P01, P02–P06 and P28 are public. Everything behind sign-in must stay out of search results; everything public must describe Ledgerline truthfully.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-137 | Root metadata title, description and title template come from constants and name Ledgerline; no starter copy remains. | Review [app/layout.tsx](../../app/layout.tsx) (see H-08). |
| Q-138 | Every public page (P01–P06, P28) exports its own unique title and description. | View source per page. |
| Q-139 | `(app)` and `(admin)` pages send `robots: noindex, nofollow`. | View source on P08 and P29. |
| Q-140 | `app/sitemap.ts` lists public routes only; `app/robots.ts` disallows `/admin`, `/api` and app routes. | Fetch `/sitemap.xml` and `/robots.txt`. |
| Q-141 | Canonical URLs derive from one metadata base constant. | View source `<link rel="canonical">`. |
| Q-142 | Open Graph and social images contain only true claims and no fabricated figures. | Review generated images. |
| Q-143 | P01 and P28 deliver their primary content in server-rendered HTML. | View source with JavaScript disabled. |
| Q-144 | Structured data, if any, states only verifiable facts (organisation name, URL); no ratings or reviews. | Rich Results Test on P01. |
| Q-145 | Help article slugs (P28) are stable, lowercase and human-readable. | Review `lib/data/` help articles. |
| Q-146 | `themeColor` and `colorScheme` are declared from constants for each colour scheme the build offers. | View source `<meta name="theme-color">`. |

## 13. Maintainability

Why: the host rules are not style preferences; each one keeps a future change to one place.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-147 | No file in `app/`, `components/` or `lib/` exceeds 150 lines. | `max-lines` rule. |
| Q-148 | No comment appears in TypeScript or TSX source outside machine-read directives. | `starter/no-comments`. |
| Q-149 | No `any`, unchecked `as`, or `@ts-ignore` appears in source. | `@typescript-eslint/no-explicit-any`; grep ` as ` and `@ts-ignore`. |
| Q-150 | Route `page.tsx` files compose sections only — no inline data arrays, no inline components. | `starter/page-composes-only`. |
| Q-151 | Copy used twice, routes, durations and enums live in `lib/constants.ts` or `lib/<feature>/constants.ts`. | grep repeated string literals across `components/`. |
| Q-152 | Feature folders `components/<feature>/` appear only after OD4 amends the host CLAUDE.md folder table. | Review folder tree against CLAUDE.md. |
| Q-153 | No specified feature, export, schema or rule is deleted without a maintainer instruction naming it. | PR diff review against [Phase 8](phase-8-implementation-roadmap.md) statuses. |
| Q-154 | Only one library serves each need (one chart library, one table library, one form library). | `package.json` review. |
| Q-155 | IDs generated on the client use `nanoid`; `uuid` and `Date.now()` are never used for IDs. | `no-restricted-imports` + `no-restricted-properties`. |

## 14. Cross-browser compatibility

Why: finance teams run managed laptops (Edge, Chrome) and owners check on iPhones. The matrix below is the support contract.

| Browser | Versions | Engine |
|---|---|---|
| Chrome (desktop) | Last 2 stable | Blink |
| Edge (desktop) | Last 2 stable | Blink |
| Firefox (desktop) | Last 2 stable | Gecko |
| Safari (macOS) | Last 2 major | WebKit |
| iOS Safari | 17 and later | WebKit |
| Android Chrome | Last 2 stable | Blink |

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-156 | Flows X1, F1, F2, F3 and F4 complete on every browser in the matrix. | Playwright on Chromium, Firefox, WebKit (needs LD4); manual on iOS 17 and Android devices. |
| Q-157 | Native `<dialog>` in C21 and C22 opens with `showModal`, renders `::backdrop`, closes on Escape and restores focus on every matrix browser, including iOS Safari 17. | Manual on Safari 17 and iOS 17. |
| Q-158 | The `popover` attribute in C19 Tooltip and C20 Menu light-dismisses and stacks above dialogs on every matrix browser. | Manual on Firefox and Safari. |
| Q-159 | Per LD5, CSS anchor positioning is feature-detected (`CSS.supports("anchor-name", "--a")`); where unsupported, C19 and C20 fall back to the approved positioning path and never render off-screen. | Manual on Firefox and Safari 17 at viewport edges. |
| Q-160 | *Retired in 2.0.0 — visual (colour-function rendering parity); judged in the owner's build review, not by this checklist.* | — |
| Q-161 | Native date inputs in C48 DateRangeField accept and emit `yyyy-MM-dd` (`DATE_VALUE_FORMAT`) on Chrome, Firefox, Safari and iOS. | Manual per browser. |
| Q-162 | `Intl.NumberFormat` output for supported currencies (including negatives) is identical across engines. | Vitest snapshot plus manual spot check in Safari and Firefox. |
| Q-163 | C51 CopyButton uses `navigator.clipboard` in a secure context and shows a fallback message where permission is denied. | Manual on Safari and Firefox. |
| Q-164 | C49 File upload supports drag-and-drop on desktop and tap-to-choose on iOS and Android. | Manual per device. |
| Q-165 | *Retired in 2.0.0 — visual (scrollbar styling in Firefox); judged in the owner's build review, not by this checklist.* | — |
| Q-166 | Full-height layouts use dynamic viewport units, so the iOS toolbar never hides actions. | Manual on iOS Safari 17. |
| Q-167 | Form fields on touch devices do not trigger browser zoom on focus. | Manual: focus the email field on iOS Safari 17. |
| Q-168 | `:focus-visible` shows for keyboard focus and hides for pointer clicks on every matrix browser. | Manual keyboard vs mouse on Safari and Firefox. |

## 15. WCAG compliance

Why: WCAG 2.2 AA is the declared bar (seed, Technology Stack). Each row names the success criterion and the Ledgerline surface where it is most at risk.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-169 | 1.1.1 Non-text content: charts, sparklines (C31), avatars and status dots have text alternatives. | Manual SR on P08 and P23. |
| Q-170 | 1.3.1 Info and relationships: ledger headers use `<th scope>`; form groups (S11 owners) use `<fieldset>`/`<legend>`. | axe (needs LD4); DOM review. |
| Q-171 | 1.3.2 Meaningful sequence: DOM order matches visual order in S14 and S20 on all breakpoints. | Manual SR linear read. |
| Q-172 | 1.3.4 Orientation: no page locks portrait or landscape. | Manual rotate on iOS and Android. |
| Q-173 | 1.3.5 Identify input purpose: sign-in and profile fields set `autocomplete` (`email`, `current-password`, `new-password`, `one-time-code`, `name`, `tel`). | DOM review of S08 and S42 (see H-03). |
| Q-174 | 1.4.1 Use of colour: credit/debit and status are conveyed by sign, text and icon as well as colour. | Grayscale screenshot review of S23 and S34. |
| Q-175 | 1.4.3 Contrast (minimum): text is ≥ 4.5:1 in every colour scheme offered, including secondary text on every background. | Contrast check at build review; DevTools picker. |
| Q-176 | 1.4.4 Resize text: at 200% browser zoom no content or function is lost. | Manual at 200% on P10 and P12. |
| Q-177 | 1.4.10 Reflow: at 320 CSS px wide (400% zoom) content reflows without two-dimensional scrolling, except the data table itself. | Manual at 1280 px × 400%. |
| Q-178 | 1.4.11 Non-text contrast: input borders, focus ring and chart lines are ≥ 3:1 against adjacent colours. | Contrast script; manual picker. |
| Q-179 | 1.4.12 Text spacing: overriding line-height 1.5, paragraph 2×, letter 0.12em, word 0.16em clips nothing. | Text-spacing bookmarklet on P10 and P08. |
| Q-180 | 1.4.13 Content on hover or focus: C19 Tooltip is dismissible with Escape, hoverable and persistent. | Manual keyboard and pointer. |
| Q-181 | 2.1.1 Keyboard: every action, including row open, filter chips, file upload and chart data, works by keyboard. | Manual keyboard-only run of F1–F5. |
| Q-182 | 2.1.2 No keyboard trap: focus can leave the palette, dialogs, overlay and date inputs. | Manual. |
| Q-183 | 2.1.4 Character key shortcuts: single-key shortcuts can be turned off or remapped, or fire only with focus in the relevant widget. | Manual; review shortcut constants. |
| Q-184 | 2.2.1 Timing adjustable: members are warned before idle sign-out and can extend with one action (C55). | Manual with shortened timeout. |
| Q-185 | 2.2.2 Pause, stop, hide: auto-updating notification counts and export progress do not move or blink content. | Manual observation. |
| Q-186 | 2.3.1 Three flashes: nothing flashes more than three times per second. | Manual review of loaders. |
| Q-187 | 2.4.1 Bypass blocks: skip link present on every `(app)` and `(admin)` page. | Manual. |
| Q-188 | 2.4.2 Page titled: every page title is unique and descriptive ("Account ledger · Operating ···1234 · Ledgerline"), never the starter title. | View tab titles (see H-08). |
| Q-189 | 2.4.3 Focus order: after closing the transaction overlay focus returns to the row that opened it. | Manual on P10 → P12 overlay. |
| Q-190 | 2.4.4 Link purpose: "View", "Open" and "Download" links carry the object name in their accessible name. | Manual SR links list. |
| Q-191 | 2.4.6 Headings and labels describe topic or purpose. | Copy review. |
| Q-192 | 2.4.7 Focus visible: every focusable element shows the global focus indicator, including in forced-colors mode. | Manual Tab run in normal and forced-colors modes (see H-06). |
| Q-193 | 2.4.11 Focus not obscured (minimum): sticky S02 Global utilities, sticky table headers, toasts and fixed bottom bars never fully hide the focused element. | Manual Tab through a long S23 ledger and S26 notes with a toast visible; `scroll-padding` set from tokens. |
| Q-194 | 2.5.3 Label in name: visible button text is contained in its accessible name. | axe `label-content-name-mismatch` (needs LD4). |
| Q-195 | 2.5.7 Dragging movements: C49 File upload and any chart range selection have a single-pointer alternative (a button or inputs). | Manual. |
| Q-196 | 2.5.8 Target size (minimum): every target is at least 24×24 CSS px or has sufficient spacing, including filter-chip remove buttons and table row actions. | axe `target-size` (needs LD4); DevTools measure on C47 and C02. |
| Q-197 | 3.1.1 Language of page: `<html lang="en">` is set (A6). | View source. |
| Q-198 | 3.2.2 On input: changing a filter or date field never navigates or submits without explicit action. | Manual on S21. |
| Q-199 | 3.2.6 Consistent help: the help entry (P28 link and secure-message entry) sits in the same place in S02 Global utilities on every app page, and auth pages offer the same help link in the same place. | Visual review across pages; review S08 variants (see H-04). |
| Q-200 | 3.3.1 Error identification: each field error names the field and the problem in text. | Manual submit of empty S10 form. |
| Q-201 | 3.3.3 Error suggestion: errors say how to fix (format, length, allowed files). | Copy review. |
| Q-202 | 3.3.4 Error prevention (legal, financial, data): irreversible actions (removing a member, rejecting a compliance case, revoking sessions) require confirmation through C52 ConfirmDialog and can be reviewed before commit. | Manual on S39, S43, S52. |
| Q-203 | 3.3.7 Redundant entry: onboarding (S10, S11) never asks again for data already entered in the same flow; previously entered values are pre-filled. | Manual walk of F5. |
| Q-204 | 3.3.8 Accessible authentication (minimum): sign-in and step-up allow password managers and paste, accept passkeys, and never require a cognitive test (no CAPTCHA puzzle, no retyping characters). | Manual with a password manager; paste into password and OTP fields (see H-03). |
| Q-205 | 4.1.2 Name, role, value: custom controls (C09 Switch, C23 Tabs, C20 Menu) expose correct role and state. | Accessibility tree review. |
| Q-206 | 4.1.3 Status messages: filter result counts, save confirmations and export-ready events are announced without moving focus. | NVDA speech viewer. |

## 16. Money and data integrity

Why: a formatting bug in a banking console is a wrong balance. The backend sends integer minor units as strings plus an ISO 4217 code (spine §2); the frontend formats and never computes with floats.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-207 | Every money field in `lib/types/` and the contract is a string of integer minor units paired with a currency code; no money field is typed `number`. | Review contract schemas; grep `amount: number`. |
| Q-208 | No floating-point arithmetic touches money: sums and differences use `BigInt` over minor-unit strings. | grep `parseFloat`, `Number(`, `* 100`, `/ 100` near money; vitest with fast-check properties. |
| Q-209 | C40 Amount formats with `Intl.NumberFormat` using the currency's own minor-unit digits (0 for JPY, 2 for USD, 3 for BHD). | Vitest table test across currencies. |
| Q-210 | Minor-to-major conversion is exact for every integer up to 18 digits (no precision loss past 2^53). | fast-check property test round-tripping large values. |
| Q-211 | Sign convention holds: credits positive, debits negative, with the sign given in text; ordinary debits carry no problem severity. | Seeded ledger screenshot; vitest on C40. |
| Q-212 | Amounts in different currencies are never summed; S14 Cash position groups totals per currency. | Seeded multi-currency workspace; code review of S14. |
| Q-213 | Opening balance plus the sum of a contiguous ledger page equals the closing balance for that page. | Vitest property test on the reconciliation util; manual check on a seeded account. |
| Q-214 | When filters hide rows, the running-balance column is hidden or labelled as unfiltered, so a partial list never implies a false balance. | Manual on P10 with a type filter. |
| Q-215 | Pending transactions are excluded from the posted balance, and "current" and "available" balances are labelled distinctly when both are shown. | Seeded pending transactions; S20 review. |
| Q-216 | Percentages in C41 DeltaChip come from one tested util with a documented rounding rule; zero and negative baselines render "—" rather than infinity. | Vitest edge cases. |
| Q-217 | Dates distinguish posting date from value date where both exist; statement periods use the workspace timezone boundaries. | Review S24 and S30 with seeded cross-midnight transactions. |
| Q-218 | Totals in a CSV export equal the on-screen totals for the same filters and period. | Script summing export minor units with BigInt vs S22 figures. |
| Q-219 | C51 CopyButton on an amount copies a plain canonical value with currency code, not the localized display string. | Manual paste into a text editor. |
| Q-220 | [S29 Runway calculator](phase-5-section-blueprints.md#s29--runway-calculator) uses a pure util in `lib/utils/` with unit tests, shows its assumptions and rounds months down. | Vitest; UI review on P16. |
| Q-221 | Amounts are right-aligned and never truncated; a value too wide for its cell wraps or widens the column. | Seeded 12-digit amount on S23. |

## 17. Security and privacy

Why: the console exposes balances and account numbers for real businesses. Each item below closes a way that data could reach someone who should not see it.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-222 | The session cookie is `httpOnly`, `Secure` in production, `SameSite=Lax`, `path=/`. | Vitest on `lib/utils/session.ts`; DevTools Application → Cookies. |
| Q-223 | No access token is stored in `localStorage`, `sessionStorage` or client JavaScript state. | grep `accessToken` in client files; DevTools storage inspection. |
| Q-224 | Account numbers render masked (last 4) through [C42 MaskedAccountNumber](phase-6-interaction-contracts.md#c42--maskedaccountnumber) by default. | Visual review of S19, S20, S24. |
| Q-225 | Revealing a full account number requires step-up re-authentication (X4), is audit-logged by the backend, and re-masks on route change or after a timeout constant. | Manual reveal; backend audit log entry. |
| Q-226 | No PII (email, name, account number) appears in URLs, query strings, page titles or analytics payloads; routes use opaque ids. | Review route params; network tab on analytics calls. |
| Q-227 | No PII, token or full account number appears in logs from services or route handlers. | Review logging service redaction; grep log calls. |
| Q-228 | Idle timeout and absolute session lifetime follow the OD2 decision and are constants. | Review `lib/constants.ts`; manual timeout test. |
| Q-229 | Signing out invalidates the session on the backend, not only in the browser. | Replay the old token against `/api/users/me` after sign-out (see H-18). |
| Q-230 | Every `(app)` and `(admin)` route prefix is protected by the proxy; an unauthenticated request to any of them redirects to sign-in. | E2E sweep of all routes signed-out (needs LD4); manual curl of each prefix (see H-14). |
| Q-231 | `(admin)` routes require the ADMIN role in the proxy and again in the server layout; hiding navigation is not the guard. | Sign in as a USER and open `/admin` directly (see H-14). |
| Q-232 | C59 PermissionGate mirrors backend permissions, and the backend rejects the same call with 403 when the UI gate is bypassed. | Call a restricted endpoint as R4 via DevTools. |
| Q-233 | The post-sign-in `next` target is accepted only when it resolves to the same origin, including `/\` and encoded variants. | Vitest on `lib/utils/internal-path.ts` with `/\evil.test` (see H-16). |
| Q-234 | With no `next` target, a successful sign-in and a signed-in visit to `/auth/*` both land on P08 Dashboard, never on an empty page. | Vitest on `internal-path.ts` fallback and `proxy.ts` redirect; manual sign-in without `next` (see H-15). |
| Q-235 | Responses carry a Content-Security-Policy (script nonces, `frame-ancestors 'none'`, `connect-src` limited to the API origin), HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and a `Permissions-Policy`. | `curl -I` on P02 and P08; securityheaders scan (see H-17). |
| Q-236 | Route handlers that mutate state reject cross-origin requests (Origin check), in addition to `SameSite` cookies. | curl with a foreign `Origin` header. |
| Q-237 | Pages showing balances send `Cache-Control: no-store`, and the browser back button after sign-out does not show a cached balance. | Manual: sign out, press Back. |
| Q-238 | Statement and export downloads use short-lived signed URLs with `Content-Disposition: attachment`. | Network tab on S30 and S32. |
| Q-239 | Password reset and sign-in responses do not reveal whether an email has an account. | Manual with known and unknown emails on P02 and P04. |
| Q-240 | `localStorage` access is wrapped in a `useSyncExternalStore` hook that tolerates storage being unavailable (private mode, quota). | Code review of `lib/utils/local-storage.ts` consumers (see H-19). |
| Q-241 | Dependency audit shows no known high or critical vulnerability at release. | `pnpm audit` at the gate. |

## 18. Content truthfulness

Why: an invented balance, a fake testimonial or an unearned compliance badge is a claim the product makes to real businesses. Nothing invented reaches a real person.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-242 | Frontend source contains no fabricated balances, transactions, counterparties, customer names or logos. | grep `lib/data/` and `components/` for currency-shaped literals and company names. |
| Q-243 | Development and demo data come only from the backend seed (`backend/prisma/seed.ts`). | Review `lib/data/` holds only static copy and config (nav, help, empty-state copy, permission matrix). |
| Q-244 | Every marketing claim in S04–S07 comes from a constant approved by product and compliance, with its source recorded. | Review claim constants and approval record. |
| Q-245 | No testimonial, rating, customer logo, regulator badge or security certification appears unless it is true and approved in writing. | Visual review of P01; approval log. |
| Q-246 | Empty states never show sample or placeholder data styled as real data. | Review of every C32 usage. |
| Q-247 | Deferred features (P26 Transfer, P27 Payees & bill pay) are not advertised as available anywhere in v1 copy. | grep "send money", "pay", "transfer" in copy constants and P01. |
| Q-248 | Help articles (P28) describe shipped behaviour only and are reviewed at each release. | Release checklist sign-off. |
| Q-249 | No starter branding remains ("Next.js App Router Starter", "Opinionated Next.js starter"). | grep in `app/` and `lib/` (see H-08). |
| Q-250 | Metadata and social previews make no claim that the product page itself does not support. | Review metadata constants against P01 copy. |

## 19. Public site (added 2.0.0)

Why: the built home page (P01) is the first thing a real business reads. Its claims must be true or clearly marked, and it must lead people to sign in or start. These items stay failing, not waived, until OD9 and OD10 are answered.

| ID | Check (pass/fail) | How to verify |
|---|---|---|
| Q-251 | P01 states only approved, true claims about v1 — or is explicitly kept as a non-deployed design study (OD9 option C). | Review S04, S06, S55–S64 copy against [Phase 1 OD9](phase-1-product-vision.md#od9--what-the-public-home-page-promises-vs-what-v1-is). |
| Q-252 | Every sample figure, balance, rate, price and company on a public page is labelled as a sample in adjacent text. | Read-through of P01 with a screen reader. |
| Q-253 | While OD9 is open, the design-study disclosure is present on every public page. | Review S07 on P01 and P28. |
| Q-254 | P01 offers a route to sign in (P02) and a way to start (P03 or X11 per OD10). | Manual from P01. |
| Q-255 | S64 validates the email, ties the error to the field, never puts the email in a URL, and its confirmation says truthfully what was sent. | Manual; network tab. |
| Q-256 | C64 disclosures expose `aria-expanded` and `aria-controls` and operate with Enter/Space. | Accessibility tree; keyboard. |
| Q-257 | C65 exposes `aria-expanded`/`aria-controls`, its name reflects its state, Escape closes it and focus returns to the toggle. | Manual at 390 px with keyboard and VoiceOver. |
| Q-258 | C66 samples say in text that nothing real happens; switches expose `role="switch"` and `aria-checked`; the approval result is announced. | Accessibility tree; NVDA. |
| Q-259 | C68 exposes each heading to assistive technology as one phrase; with reduced motion the text appears at once. | Accessibility tree; reduced-motion emulation. |
| Q-260 | All P01 content is readable with JavaScript disabled and with reduced motion; nothing primary is hidden behind a reveal. | View with JS off; emulate reduced motion. |
| Q-261 | `lib/ledgerline/money.ts` is imported only by public-page files; product money goes through C40 (H-24). | grep imports. |
| Q-262 | No product domain type shares a name with a public-page sample type exported from `lib/types/` (H-25). | Type-check after domain types land; grep `lib/types/index.ts`. |

## Host audit findings

Confirmed in code on 2026-09-26 by reading the files named. Each finding leads with what a user experiences, then the mechanism, the fix, and the Q-item that catches a recurrence. Severity: **S1** blocks or misleads users or exposes data; **S2** degrades experience or accessibility; **S3** convention drift with no direct user effect.

### H-01 — Sign-in error text renders unstyled (S2)

- **Users see:** after a failed sign-in, the error sentence appears in the same colour as body text, so it is easy to miss.
- **Where:** [components/common/login-form.tsx:69](../../components/common/login-form.tsx) uses `text-danger`; `@theme` defines `--color-error`, not `--color-danger` ([styles/globals.css:10](../../styles/globals.css)).
- **Fix:** use `text-error`; add the class-existence script to the gate.
- **Caught by:** Q-007 (error tied to fields); Q-103 retired. The colour of the message is a build concern; that it is announced and associated is not.

### H-02 — Every sign-in failure says "Email or password is incorrect" (S1)

- **Users see:** during a backend outage, a rate limit or a malformed request, they are told their password is wrong and may reset a working password or lock their account.
- **Where:** [app/api/session/route.ts:13](../../app/api/session/route.ts) returns `INVALID_CREDENTIALS` for a 400; line 20 maps any non-OK upstream (including 5xx and 429) to 401 with the same text; [login-form.tsx:68-70](../../components/common/login-form.tsx) shows that one string for any `isError`.
- **Fix:** forward the upstream status class; map 401, 429, 400 and 5xx/network to distinct constants; the form reads the status.
- **Caught by:** Q-073.

### H-03 — Password managers and autofill are not helped on sign-in (S2)

- **Users see:** browsers and password managers may not recognise the fields, so members type credentials by hand; screen readers hear a field whose id is "Email".
- **Where:** [login-form.tsx:51,57,58](../../components/common/login-form.tsx) use the label text as `htmlFor`, `id` and `name`; lines 56-64 set no `autoComplete`; line 61 builds the placeholder "Enter Email" from the label.
- **Fix:** ids from `useId` through C10 Field; `name` equal to the schema key; `autoComplete="email"` and `"current-password"`.
- **Caught by:** Q-006, Q-173, Q-204.

### H-04 — A member who forgot their password has no way forward from sign-in (S1)

- **Users see:** no "Forgot password" and no "Create account" link on the sign-in card.
- **Where:** [login-form.tsx:41-77](../../components/common/login-form.tsx) renders heading, fields, error and submit only.
- **Fix:** S08 sign-in variant links to P04 and P03 from route constants, in the same position on every auth variant.
- **Caught by:** Q-199.

### H-05 — Sign-in error is not tied to the fields (S2)

- **Users see:** a screen-reader user hears the alert once, but on returning to the email field hears nothing about the error.
- **Where:** [login-form.tsx:56-64](../../components/common/login-form.tsx) sets no `aria-invalid` or `aria-describedby`; the alert at line 69 has no id.
- **Fix:** give the message an id and reference it from both inputs while `isError`.
- **Caught by:** Q-007.

### H-06 — Keyboard focus disappears in Windows high-contrast mode (S1)

- **Users see:** in forced-colors mode, tabbing onto the sign-in button or fields shows no focus indicator at all.
- **Where:** [components/ui/button.tsx:51](../../components/ui/button.tsx) and [login-form.tsx:63](../../components/common/login-form.tsx) combine `focus-visible:outline-none` with `focus-visible:ring-2`. In the installed Tailwind 4.3.3, `outline-none` sets `outline-style: none`, and the ring is a box-shadow, which forced-colors mode removes. [styles/globals.css](../../styles/globals.css) (lines 1-369) has no `:focus-visible` rule to fall back on.
- **Fix:** remove the `outline-none` overrides so a visible focus indicator survives forced-colours mode (how it looks is decided at build).
- **Caught by:** Q-192, Q-016.

### H-07 — Button has no displayName (S3)

- **Users see:** nothing directly; React DevTools and error stacks show an anonymous forwardRef.
- **Where:** [components/ui/button.tsx:29-64](../../components/ui/button.tsx) defines the forwardRef and exports without `Button.displayName`.
- **Fix:** set `displayName` per the primitive standard.
- **Caught by:** Q-113.

### H-08 — Every tab and search result says "Next.js App Router Starter" (S2)

> **2.0.0 status:** the working-tree `app/layout.tsx` now sets a Ledgerline title and description and a theme colour from `lib/ledgerline/constants.ts`. Open remainder: P02 exports no page title; no `PAGE_TITLES`.

- **Users see:** the browser tab, bookmarks and link previews carry starter branding; mobile browser chrome is painted white even when the product is dark.
- **Where:** [app/layout.tsx:9-10](../../app/layout.tsx) hard-codes `colorScheme: "light"` and `themeColor: "#ffffff"`; lines 14-15 hard-code the starter title and description; [app/auth/login/page.tsx](../../app/auth/login/page.tsx) exports no metadata, so P02 inherits the starter title.
- **Fix:** metadata and viewport constants (title template, description, per-scheme theme colour), and a page title on every route.
- **Caught by:** Q-137, Q-146, Q-188, Q-249.

### H-09 — `text-micro` is documented but cannot be used (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** nothing until a component writes `text-micro`, which then renders at the inherited size.
- **Where:** [styles/tokens.css:127-130](../../styles/tokens.css) defines `--font-sizes-micro`; the `@theme` block in [styles/globals.css:6-118](../../styles/globals.css) maps no `--text-micro`.
- **Fix:** add the mapping with line-height and weight siblings.
- **Caught by:** Q-102.

### H-10 — Raw values in globals.css bypass the tokens (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** nothing today; a reskin that changes tokens leaves these values behind, so parts of the UI stop matching.
- **Where:** [styles/globals.css](../../styles/globals.css) lines 206 (`32px` dot grid), 211 (`0 2px 10px` glow), 221 (`768px`), 230 (`18rem`), 234 (`1279px`), 251-252 (`8px` scrollbar), 261 (`4px` radius), 327-328 (`18px` icon), 337 (weight `600`), 341 (`0.4px` letter-spacing), 346 (weight `300`), 357 (weight `400`).
- **Fix:** move each to a token in tokens.css (breakpoints, icon size, scrollbar size, tracking, weights) and reference it.
- **Caught by:** Q-101.

### H-11 — Every stat card lifts on hover and transitions all properties (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** cards shift by a pixel under the pointer across the whole dashboard, which the density brief reserves for one focal tile.
- **Where:** [styles/globals.css:284-288](../../styles/globals.css) (`translateY(-1px)` on every `.stat-card`), line 278 and line 161 (`transition: all`).
- **Fix:** a focal-tile modifier carries the lift; base cards and `.smooth` transition colour properties only.
- **Caught by:** Q-106.

### H-12 — Named spacing classes are editorial-sized in a dense register (S2)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** any app view that uses `.pad` or `.gap` gets 40 px padding and gaps, so a ledger shows noticeably fewer rows per screen.
- **Where:** `.pad`, `.gap` in [styles/globals.css:126-150](../../styles/globals.css) resolve to `--paddings-md` / `--gaps-md` = `2.5rem` ([styles/tokens.css:157,164](../../styles/tokens.css)), above the p-4 / gap-4 ceiling in [tools/eslint/rules/application-register-density.ts:14-22](../../tools/eslint/rules/application-register-density.ts), which checks utility classes only.
- **Fix:** decided at build (visual).
- **Caught by:** Q-108.

### H-13 — No dark theme tokens exist (S2)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** the product renders only in the light starter palette; the dark default specified for Ledgerline (OD7) is unavailable.
- **Where:** [styles/tokens.css:4-239](../../styles/tokens.css) is a single `:root` block; [styles/globals.css:4](../../styles/globals.css) declares the `dark` variant but no token redefinition exists for it.
- **Fix:** decided at build (visual).
- **Caught by:** Q-111.

### H-14 — Only `/dashboard` is protected, and no route checks the admin role (S1)

- **Users see:** any future app or admin route not added to the list is reachable signed-out; a signed-in USER is not stopped from opening admin routes by the proxy.
- **Where:** [lib/constants.ts:11](../../lib/constants.ts) `PROTECTED_ROUTE_PREFIXES = ["/dashboard"]`; [proxy.ts:23-33](../../proxy.ts) checks session presence only, never `session.role`.
- **Fix:** protected prefixes for every `(app)` and `(admin)` segment from one constant; admin prefixes require `ADMIN` in the proxy and in the `(admin)` server layout.
- **Caught by:** Q-230, Q-231.

### H-15 — After signing in without a `next` target, members land on a blank page (S1)

- **Users see:** a completely empty page after a successful sign-in, and again whenever a signed-in member opens `/auth/login`.
- **Where:** [lib/utils/internal-path.ts:6](../../lib/utils/internal-path.ts) falls back to `HOME_ROUTE` (`"/"`, [lib/constants.ts:9](../../lib/constants.ts)); [proxy.ts:19-21](../../proxy.ts) redirects signed-in `/auth/*` visitors to the same route; [app/page.tsx:1-3](../../app/page.tsx) returns an empty fragment. `/dashboard` has no route file in `app/`, so `next=/dashboard` ends at a 404.
- **Fix:** a post-sign-in route constant pointing at P08, used by both the fallback and the proxy redirect.
- **Caught by:** Q-234, Q-233.

### H-16 — A crafted sign-in link can send members off-site after they sign in (S1)

- **Users see:** a phishing link to the real sign-in page that forwards them to a look-alike site right after authenticating.
- **Where:** [lib/utils/internal-path.ts:4](../../lib/utils/internal-path.ts) accepts any value starting with `/` but not `//`; `/\evil.test` passes, and URL parsing treats `\` as `/` for http(s), producing `//evil.test`. [internal-path.test.ts](../../lib/utils/internal-path.test.ts) covers `https://` and `//` only.
- **Fix:** resolve against a fixed origin and accept only same-origin results; add the backslash and encoded cases to the test.
- **Caught by:** Q-233.

```ts
import { HOME_ROUTE } from "@/lib/constants";

const PROBE_ORIGIN = "http://internal.invalid";

export const internalPath = (candidate: string | undefined): string => {
    if (!candidate?.startsWith("/")) return HOME_ROUTE;
    const resolved = new URL(candidate, PROBE_ORIGIN);
    return resolved.origin === PROBE_ORIGIN
        ? `${resolved.pathname}${resolved.search}${resolved.hash}`
        : HOME_ROUTE;
};
```

### H-17 — No security headers or Content-Security-Policy (S1)

- **Users see:** nothing until an injected script or a framing attack runs; nothing in the response limits either.
- **Where:** [next.config.ts:3](../../next.config.ts) is an empty config; [proxy.ts](../../proxy.ts) sets no headers.
- **Fix:** CSP with nonces set in the proxy; HSTS, nosniff, Referrer-Policy, Permissions-Policy, `frame-ancestors 'none'` via `headers()`.
- **Caught by:** Q-235.

### H-18 — Signing out does not end the session on the server (S2)

- **Users see:** nothing; but a token copied before sign-out keeps working until it expires, up to 7 days.
- **Where:** [app/api/session/route.ts:23-27](../../app/api/session/route.ts) deletes the cookie only; [lib/constants.ts:16](../../lib/constants.ts) `SESSION_MAX_AGE` is 7 days (OD2). Backend dependency: a revoke endpoint.
- **Fix:** call the backend revoke on DELETE once published; shorten lifetime per OD2.
- **Caught by:** Q-229.

### H-19 — localStorage helper can throw and has no React binding (S3)

- **Users see:** in Safari private mode or with storage full, a preference write can throw and break the interaction that triggered it.
- **Where:** [lib/utils/local-storage.ts:1-18](../../lib/utils/local-storage.ts) calls `localStorage` without try/catch; no `useSyncExternalStore` hook wraps it.
- **Fix:** a `use-local-storage` hook over `useSyncExternalStore` with guarded reads and writes.
- **Caught by:** Q-240.

### H-20 — Lint rules have blind spots (S3)

> **2.0.0 status:** the owner removed `token-first-classnames` in the working tree, so its part of this finding no longer applies. The density-rule blind spot remains.

- **Users see:** nothing directly; violations the rules were written to stop can merge.
- **Where:** `tools/eslint/rules/token-first-classnames.ts:10` (removed by the owner in the working tree) anchors the responsive pattern at the token start, so `hover:md:p-4` and `dark:lg:flex` pass; line 67 checks arbitrary values only inside a `className` attribute, so module-scope variant maps (the pattern in [button.tsx:16-27](../../components/ui/button.tsx)) escape. [application-register-density.ts:14-22](../../tools/eslint/rules/application-register-density.ts) has no ceiling for `px-`, `pt-`, `pb-`, `m-` families. ESLint reads only TypeScript, so CSS comments ([globals.css:7,164-166,268-270,306-308,331-333](../../styles/globals.css) and the banner comments throughout [tokens.css](../../styles/tokens.css)) are unchecked by `starter/no-comments`.
- **Fix:** widen the regex to any variant stack; inspect string literals in `Record` maps consumed by `clsx`; add missing spacing families; a stylesheet comment check at the gate.
- **Caught by:** Q-115, Q-028.

### H-21 — globals.css lacks the baseline the styling agreement assigns to it (S3)

> **Retired in 2.0.0 — visual/styling finding, handed to build review.** Kept for the record.

- **Users see:** headings, links and form controls fall back to browser defaults wherever a component forgets to style them.
- **Where:** [styles/globals.css:120-124](../../styles/globals.css) is the only reset (box-sizing); no typography defaults, form baseline, font smoothing or `:focus-visible` rule.
- **Fix:** add the baseline sections listed in the seed's Styling Architecture Agreement.
- **Caught by:** Q-116.

### H-22 — A loading button can still be clicked when `disabled={false}` is passed (S2)

- **Users see:** a double-submitted form when a caller passes an explicit `disabled={false}` while a request is pending.
- **Where:** [components/ui/button.tsx:47](../../components/ui/button.tsx) `disabled={disabled ?? isLoading}` lets an explicit `false` override `isLoading`.
- **Fix:** `disabled={disabled || isLoading}`.
- **Caught by:** Q-089.

### H-23 — Query cache timing is a literal in the provider (S3)

- **Users see:** nothing directly; balances and statements share one staleness window, so balance freshness cannot be tuned separately.
- **Where:** [components/providers/provider.tsx:13](../../components/providers/provider.tsx) `staleTime: 60 * 1000`.
- **Fix:** per-resource timing constants in `lib/constants.ts`.
- **Caught by:** Q-057.

### H-24 — Public-page money helper assumes a fixed exponent (S2)

- **Status (2026-09-28):** partly resolved. The float division is gone: the helper now builds an exact decimal from integer minor units and rejects non-integers. The fixed two-digit exponent remains.
- **Users see:** nothing today (sample figures only); if reused for real balances, currencies with 0 or 3 decimal places would show amounts 100× or 10× off.
- **Where:** [lib/ledgerline/money.ts](../../lib/ledgerline/money.ts) takes `minor: number` with a fixed `FRACTION_DIGITS` of 2 in `en-GB`.
- **Fix:** keep it confined to the public page; product money uses C40 over minor-unit strings with a per-currency exponent (BR1).
- **Caught by:** Q-261, Q-207, Q-208.

### H-25 — Public-page sample types share names with planned domain types (S3)

- **Status (2026-09-28):** partly resolved. `Transaction` was renamed to `ActivityEntry` with the owner's approval. Other generic names (`Figure`, `NavLink`, `Plan`, `Approval` and the rest) remain.
- **Users see:** nothing; engineers adding a domain type with one of the remaining names will hit a duplicate export through `lib/types/index.ts` or silently import the wrong shape.
- **Where:** [lib/types/ledgerline.ts](../../lib/types/ledgerline.ts) exports `Figure`, `NavLink` and others via [lib/types/index.ts](../../lib/types/index.ts).
- **Fix:** rename any remaining sample type before a domain type with the same name lands (R-10).
- **Caught by:** Q-262.

## Per-page state coverage matrix

Requirements, not observations: every cell states what the page must do. "Shell" means S01/S02 render from cache while content loads. "Offline" follows Frontend Standards ("offline behaviour where appropriate"): read views show cached data with an "as of" time; writes are disabled with an explanation. Deferred pages keep their full specification.

| Page | Loading | Empty | Error | Success | Offline | Keyboard | Screen reader |
|---|---|---|---|---|---|---|---|
| [P01 Home](phase-4-page-blueprints.md#p01--home) | Static; no skeleton | n/a (static copy) | P35 boundary | Built: proposition, capability sections, figures, pricing, FAQ, enquiry, disclosure (OD9/OD10 pending) | Browser offline page; no stale claims | Skip link; all CTAs tabbable | Landmarks; one h1 |
| [P02 Sign in](phase-4-page-blueprints.md#p02--sign-in) | Button pending, aria-busy | n/a | Distinct 401/429/400/5xx messages | Redirect to `next` or P08 | Submit disabled + notice | Enter submits; links to P03/P04 | Labelled fields; error described; autocomplete |
| [P03 Register](phase-4-page-blueprints.md#p03--register) | Button pending | n/a | Field errors + duplicate-email message | Session + P07 | Submit disabled + notice | Logical order | Errors announced per field |
| [P04 Forgot password](phase-4-page-blueprints.md#p04--forgot-password) | Button pending | n/a | Rate-limit and 5xx messages | Same confirmation for any email | Submit disabled | Enter submits | Status message announced |
| [P05 Reset password](phase-4-page-blueprints.md#p05--reset-password) | Token check skeleton | n/a | Expired/invalid token with restart link | Sign-in with confirmation | Submit disabled | Show-password toggle reachable | Password rules announced |
| [P06 Two-step verification](phase-4-page-blueprints.md#p06--two-step-verification) | Button pending | n/a | Wrong code, expired challenge | Continue to `next` | Submit disabled | Paste allowed; passkey button | `one-time-code`; errors described |
| [P07 Onboarding & verification](phase-4-page-blueprints.md#p07--onboarding--verification) | Stepper skeleton | `not_started` intro | Upload and save errors per step | Step advances; `submitted` state | Drafts kept; submit disabled | Stepper and uploads by keyboard | Step "N of M"; status banner announced |
| [P08 Dashboard](phase-4-page-blueprints.md#p08--dashboard) | Shell + per-section skeletons | No accounts yet: verification CTA | Per-section C33; others render | D1–D4 by role | Cached figures with "as of" | Palette, sections in order | Chart summaries; balance labels |
| [P09 Accounts](phase-4-page-blueprints.md#p09--accounts) | Row skeletons | No accounts | C33 retry | Account rows with state badges | Cached list, "as of" | Rows open with Enter | Masked numbers read as "ending 1234" |
| [P10 Account ledger](phase-4-page-blueprints.md#p10--account-ledger) | Hero + table skeleton | No transactions / no matches (clear filters) | C33 retry; frozen/closed banner | Virtualized ledger, summary | Cached rows, filters disabled | Row nav, filters, load more | Row count, sort state, amounts with sign |
| [P11 Transaction search](phase-4-page-blueprints.md#p11--transaction-search) | Table skeleton after debounce | Prompt / no matches | C33 retry | Results with counts | Search disabled + notice | `/` or palette focus search | Result count announced |
| [P12 Transaction detail](phase-4-page-blueprints.md#p12--transaction-detail) | Drawer skeleton | n/a | 404 → P34; C33 | Detail, timeline, notes | Read-only cached; notes disabled | Focus trapped in overlay; Escape returns | Drawer labelled by description + amount |
| [P13 Saved views](phase-4-page-blueprints.md#p13--saved-views) | List skeleton | No saved views + how-to | C33 retry | Views list | Cached; edits disabled | Menu actions by keyboard | Confirm delete announced |
| [P14 Flagged transactions](phase-4-page-blueprints.md#p14--flagged-transactions) | Table skeleton | Nothing flagged | C33 retry | Flagged rows | Cached; unflag disabled | Same as P10 | Flag state in row name |
| [P15 Compare periods](phase-4-page-blueprints.md#p15--compare-periods) | Chart + table skeleton | No activity in period | C33 retry | Comparison chart + table | Cached; period change disabled | Date fields and presets | Chart data table |
| [P16 Runway calculator](phase-4-page-blueprints.md#p16--runway-calculator) | Input skeleton | No cash-flow history | C33 retry | Runway with assumptions | Uses cached inputs, labelled | All inputs by keyboard | Result announced as status |
| [P17 Statements](phase-4-page-blueprints.md#p17--statements) | Row skeletons | No statements yet (first period pending) | C33 retry | Statement list, download | Downloads disabled | Download buttons named by period | Period + account in names |
| [P18 Exports](phase-4-page-blueprints.md#p18--exports) | Builder + job skeletons | No exports yet | Create error; job `failed` state | Job list with states | Create disabled; cached jobs | Builder form order | Job state changes announced |
| [P19 Counterparty](phase-4-page-blueprints.md#p19--counterparty) | Summary + table skeleton | No transactions with counterparty | 404 → P34; C33 | Summary + ledger | Cached | Same as P10 | Totals labelled per currency |
| [P20 Notifications](phase-4-page-blueprints.md#p20--notifications) | Feed skeleton | All caught up | C33 retry | Feed, mark read | Cached; mark-read disabled | Items and actions tabbable | Unread count announced |
| [P21 Messages](phase-4-page-blueprints.md#p21--messages) | Thread + conversation skeleton | No threads; start one | Send failure keeps draft | Threads and conversation | Draft kept; send disabled | Thread list arrows; Enter sends | New message announced politely |
| [P22 Workspace settings](phase-4-page-blueprints.md#p22--workspace-settings) | Form skeleton | No alert rules yet | Save errors per field | Saved confirmation | Save disabled | Form order; switches | Save status announced |
| [P23 Team](phase-4-page-blueprints.md#p23--team) | Table skeleton | Only you: invite CTA | Invite errors; C33 | Members, roles, invites | Invite disabled | Row menus; dialog trap | Role and status in row name |
| [P24 Team member profile](phase-4-page-blueprints.md#p24--team-member-profile) | Profile skeleton | n/a | 404 → P34; C33 | Read-only profile + permissions | Cached | Tab order | Permission matrix as table |
| [P25 Profile & security](phase-4-page-blueprints.md#p25--profile--security) | Form + sessions skeleton | No other sessions | Save and revoke errors | Saved; session revoked | Changes disabled | Revoke confirm dialog | Two-step state announced |
| [P26 Transfer](phase-4-page-blueprints.md#p26--transfer) (Deferred) | Form skeleton | No payees | Validation, limit and review errors | Review then confirmation | Submit disabled | Review step reachable | Amount and payee read before confirm |
| [P27 Payees & bill pay](phase-4-page-blueprints.md#p27--payees--bill-pay) (Deferred) | Table skeleton | No payees | C33 retry | Payee list | Edits disabled | Row actions | Masked payee accounts |
| [P28 Help center](phase-4-page-blueprints.md#p28--help-center) | Static; search debounce | No article matches | Unknown slug → P34 | Categories, article | Cached articles | Search then results | Article headings structured |
| [P29 Admin overview](phase-4-page-blueprints.md#p29--admin-overview) | KPI + chart skeleton | Zero users series | Per-section C33 | KPIs and series | Cached, "as of" | Section order | Chart data table |
| [P30 Admin users](phase-4-page-blueprints.md#p30--admin-users) | Table skeleton | No users match | C33; create errors | Paged users, create dialog | Create disabled | Table + dialog | Row count and status |
| [P31 Admin user detail](phase-4-page-blueprints.md#p31--admin-user-detail) | Record skeleton | n/a | 404 → P34; save/delete errors | Record saved | Edits disabled | Confirm delete dialog | Status changes announced |
| [P32 Compliance queue](phase-4-page-blueprints.md#p32--compliance-queue) | Queue + case skeleton | Queue clear | C33; decision errors | Case decided | Decisions disabled | Queue filters; decision dialog | Case state + document names |
| [P33 Support console](phase-4-page-blueprints.md#p33--support-console) | Result skeleton | No match | C33 retry | Lookup results (read-only) | Cached last lookup | Search then results | Result count announced |
| [P34 Not found (404)](phase-4-page-blueprints.md#p34--not-found-404) | n/a | n/a | n/a | Explanation + route home by role | Same page | Primary action focused first | Title states "Page not found" |
| [P35 Server error (500)](phase-4-page-blueprints.md#p35--server-error-500) | n/a | n/a | Global and segment variants | Retry + reference id | Offline variant of S54 | Retry reachable first | Error announced on load |

## Sign-off

Each category is signed by one accountable role and co-signed where another discipline owns part of the risk. A signature records that every item in the category passed or has a written, accepted exception.

| Category | Signs | Co-signs |
|---|---|---|
| 1 Accessibility, 15 WCAG compliance | Accessibility champion | Design lead, QA lead |
| 2 Behavioural consistency | Design lead | Frontend lead |
| 9 (active items Q-113–Q-115) | Frontend lead | Maintainer |
| 19 Public site | Product owner | Compliance reviewer, Accessibility champion |
| 3 Responsiveness, 14 Cross-browser compatibility | QA lead | Frontend lead |
| 4 Scalability, 5 Performance | Frontend lead | Backend lead |
| 6 State coverage, 7 Error handling, 8 Loading behavior | QA lead | Design lead |
| 10 Frontend readiness, 11 Developer experience, 13 Maintainability | Frontend lead | Maintainer |
| 12 SEO readiness | Product owner | Frontend lead |
| 16 Money and data integrity | Backend lead | Frontend lead, Finance-domain reviewer |
| 17 Security and privacy | Security engineer | Backend lead, Compliance reviewer |
| 18 Content truthfulness | Product owner | Compliance reviewer |
| Host audit findings | Frontend lead | Security engineer for S1 findings |

## Verified gate

[Phase 8](phase-8-implementation-roadmap.md) owns build status. This section defines the only way a feature moves from **Built** to **Verified**.

1. **Scope.** The feature's Q-items are: its row in the [matrix](#per-page-state-coverage-matrix) (for a page), every category item that names it or its components, and every item in categories 1, 15, 16, 17, 18 and 19 that applies to the surfaces it renders.
2. **Evidence.** Each item carries a recorded result: a lint or test run link, a screenshot, or a screen-reader note with browser and version. An item without evidence is a fail.
3. **(needs LD4) items.** Until LD4 is approved, the manual step in the same cell is the check of record and must be recorded. After approval, the automated check must also pass.
4. **Host findings.** Every host audit finding whose "Where" touches the feature is fixed, or carries an accepted exception signed by the category owner.
5. **Severity.** No open S1 or S2 defect against the feature.
6. **Gate commands.** `pnpm type-check`, `pnpm lint`, `pnpm contract:check` and the unit suite pass on the merge commit (run at the gate, not per edit).
7. **Visual approval.** The owner has approved the rendered page's look (visual hand-off); this checklist does not judge it.
8. **Sign-off.** The roles in [Sign-off](#sign-off) for each category in scope have signed.
9. **Regression.** A feature returns from Verified to Built when a change touches it and any in-scope item has not been re-run; the Phase 8 table records the date.
10. **Deferred features.** P26, P27, S44, S45, F6 and F7 are not gated in v1; their matrix rows remain requirements for when the revisit trigger fires.

## Traceability

- **Upstream (consumed):** [Phase 1](phase-1-product-vision.md) personas R1–R8, v1 read-only stance and OD9/OD10; [Phase 2](phase-2-experience-maps.md) flows F1–F7 and X1–X11; [Phase 3](phase-3-information-architecture.md) route groups and navigation; [Phase 4](phase-4-page-blueprints.md) pages P01–P35 (matrix rows); [Phase 5](phase-5-section-blueprints.md) section states S01–S64; [Phase 6](phase-6-interaction-contracts.md) components C01–C63; (1.0.0 Design Tokens phase dropped as visual); [Phase 7](phase-7-frontend-architecture.md) folders, hooks, boundaries, budgets; [Phase 8](phase-8-implementation-roadmap.md) status vocabulary, sprints, LD1–LD5 approvals.
- **Downstream (consumers):** [IMPLEMENTATION_PROMPT.md](IMPLEMENTATION_PROMPT.md) (Phase 9 implementation and Styling QA checklist), [Phase 8](phase-8-implementation-roadmap.md) (Built → Verified gate, Sprint 1 host-defect fixes), [ARTIFACT_INDEX.md](ARTIFACT_INDEX.md) and README (QA item count).
- **Host sources read:** [.claude/CLAUDE.md](../../.claude/CLAUDE.md), [eslint.config.ts](../../eslint.config.ts), `tools/eslint/rules/*.ts`, [styles/globals.css](../../styles/globals.css), [styles/tokens.css](../../styles/tokens.css), [lib/constants.ts](../../lib/constants.ts), [proxy.ts](../../proxy.ts), [app/layout.tsx](../../app/layout.tsx), [components/ui/button.tsx](../../components/ui/button.tsx), [components/common/login-form.tsx](../../components/common/login-form.tsx), plus the files cited in H-02, H-15, H-16, H-17, H-18, H-19 and H-23.

## Assumptions and open questions

- **A6** English, single locale: 3.1.1 and copy items assume `lang="en"`; all formatting still goes through `Intl`.
- **A8** Web only, responsive to 360 px: the responsiveness sweep starts at 360 px; WCAG reflow is checked at 320 CSS px.
- **A9** Internal roles share backend `ADMIN`: the admin guard item checks `ADMIN` until finer platform roles are published.
- **Performance budgets** (LCP, INP, CLS) are targets for Phase 8 measurement, not claims about the current product.
- **OD1** Currency and jurisdiction decide which currencies the money tests cover and the statement timezone rules.
- **OD2** Session policy decides the timeout values tested by the timing and session items.
- **OD6** Two-step method decides whether the passkey path in 3.3.8 is tested in v1.
- **OD8 / LD4** Automated accessibility and E2E checks depend on LD4 approval; **LD5** decides the anchor-positioning fallback path.

## Item count

This checklist contains 262 numbered Q-items (Q-001 to Q-262): 239 active and 23 retired as visual (Q-017, Q-021, Q-028, Q-029, Q-036, Q-096–Q-109, Q-112, Q-116, Q-160, Q-165). Host findings: 25 (H-01–H-25), of which six are retired as visual (H-09–H-13, H-21).

## Changes in this version

- **Retained:** Q-001–Q-250 numbering and every functional check; H-01–H-23; the per-page matrix; sign-off; the Verified gate.
- **Changed:** file renumbered from phase 10 to phase 9; category 2 renamed Behavioural consistency; category 9 retired (visual) except Q-113–Q-115; 23 items retired as visual; Q-014, Q-030, Q-032–Q-034, Q-086, Q-087, Q-110, Q-111, Q-146, Q-167, Q-175 reworded without visual prescription; H-09–H-13 and H-21 retired as visual; H-01 and H-06 fixes reworded; H-08 and H-20 updated to the working tree; the Verified gate adds owner visual approval.
- **Added:** category 19 Public site (Q-251–Q-262); H-24, H-25; P01 matrix row updated to the built page.
